from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import time
import asyncio
import uuid
import json
from pathlib import Path
from typing import List, Optional, Literal
from datetime import datetime, timezone

import httpx
from pydantic import BaseModel, Field, ConfigDict

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
SUPABASE_URL = os.environ.get('SUPABASE_URL', '').rstrip('/')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
RESEND_AUDIENCE_ID = os.environ.get('RESEND_AUDIENCE_ID', '')
RESEND_FROM_DOMAIN = os.environ.get('RESEND_FROM_DOMAIN', 'cryptoffiliate.com')
SITE_URL = os.environ.get('SITE_URL', '')
CRON_SECRET = os.environ.get('CRON_SECRET', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ============================================================
# Models
# ============================================================
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AIAdvisorRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[str] = None


# ============================================================
# Health / status
# ============================================================
@api_router.get("/")
async def root():
    return {"message": "Cryptoffiliate API", "status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    obj = StatusCheck(**input.model_dump())
    doc = obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r['timestamp'], str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


# ============================================================
# Live ticker (CoinGecko, cached 60 s)
# ============================================================
TICKER_COINS = [
    {"pair": "XBTUSD",  "label": "BTC/USD",  "aliases": ["XXBTZUSD"]},
    {"pair": "ETHUSD",  "label": "ETH/USD",  "aliases": ["XETHZUSD"]},
    {"pair": "BNBUSD",  "label": "BNB/USD",  "aliases": []},
    {"pair": "SOLUSD",  "label": "SOL/USD",  "aliases": []},
    {"pair": "XRPUSD",  "label": "XRP/USD",  "aliases": ["XXRPZUSD"]},
    {"pair": "ADAUSD",  "label": "ADA/USD",  "aliases": []},
    {"pair": "XDGUSD",  "label": "DOGE/USD", "aliases": ["XXDGZUSD"]},
    {"pair": "AVAXUSD", "label": "AVAX/USD", "aliases": []},
]

# Static exchange-fee items (these don't change minute-to-minute)
EXCHANGE_FEE_ITEMS = [
    {"label": "BINANCE MAKER",  "value": "0.10%", "change": "", "up": True},
    {"label": "OKX MAKER",      "value": "0.08%", "change": "", "up": True},
    {"label": "KRAKEN MAKER",   "value": "0.16%", "change": "", "up": True},
    {"label": "COINBASE TAKER", "value": "0.60%", "change": "", "up": False},
]

_ticker_cache: dict = {"data": None, "ts": 0.0}
_TICKER_TTL = 60.0  # seconds


def _format_price(p: float) -> str:
    if p >= 1000:
        return f"${p:,.0f}"
    if p >= 1:
        return f"${p:,.2f}"
    return f"${p:.4f}"


async def _fetch_prices() -> list:
    """Fetch live spot prices + 24h change from Kraken public API."""
    pairs = ",".join(c["pair"] for c in TICKER_COINS)
    url = f"https://api.kraken.com/0/public/Ticker?pair={pairs}"
    async with httpx.AsyncClient(timeout=8.0) as hc:
        r = await hc.get(url, headers={"User-Agent": "cryptoffiliate/1.0"})
        r.raise_for_status()
        data = r.json()
    if data.get("error"):
        raise RuntimeError(f"Kraken error: {data['error']}")
    result = data.get("result") or {}

    # Kraken sometimes returns altered keys (e.g. XXBTZUSD); build a lookup by
    # checking common prefixes / matching substring.
    def find_row(coin: dict) -> dict | None:
        if coin["pair"] in result:
            return result[coin["pair"]]
        for alias in coin.get("aliases", []):
            if alias in result:
                return result[alias]
        # Last-resort substring match (strip USD suffix)
        stem = coin["pair"].replace("USD", "")
        for k, v in result.items():
            if stem in k:
                return v
        return None

    items = []
    for c in TICKER_COINS:
        row = find_row(c)
        if not row:
            continue
        try:
            last = float(row["c"][0])
            open_p = float(row["o"])
            change = ((last - open_p) / open_p * 100.0) if open_p else 0.0
        except (KeyError, ValueError, TypeError):
            continue
        items.append({
            "label": c["label"],
            "value": _format_price(last),
            "change": f"{change:+.2f}%",
            "up": change >= 0,
        })
    return items


@api_router.get("/ticker")
async def get_ticker():
    now = time.time()
    if _ticker_cache["data"] and (now - _ticker_cache["ts"]) < _TICKER_TTL:
        return _ticker_cache["data"]
    try:
        prices = await _fetch_prices()
        payload = {
            "items": prices + EXCHANGE_FEE_ITEMS,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "source": "kraken",
        }
        _ticker_cache["data"] = payload
        _ticker_cache["ts"] = now
        return payload
    except Exception as e:
        logging.warning(f"[ticker] price fetch failed: {e}")
        if _ticker_cache["data"]:
            return _ticker_cache["data"]
        # Fallback (static) when API down and no cache
        return {
            "items": EXCHANGE_FEE_ITEMS,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "source": "fallback",
        }


# ============================================================
# AI Advisor (Claude Sonnet, streamed via SSE)
# ============================================================
AI_SYSTEM_PROMPT = """You are the Cryptoffiliate AI Advisor — an expert, direct, and genuinely helpful crypto analyst embedded on cryptoffiliate.com.

PERSONALITY: Sharp, opinionated, concise. Like a knowledgeable friend in the industry — not a compliance department. Give real answers, not disclaimers.

YOUR KNOWLEDGE BASE (live fee data, 2026):
EXCHANGES:
- Binance: 0.10% maker/taker. 350+ coins. No US. Best: volume, altcoins.
- OKX: 0.08% maker, 0.10% taker. 340+ coins. No US. Web3 wallet built in. Best: lowest fees, DeFi.
- Kraken: 0.16% maker, 0.26% taker. 200+ coins. US available. Best: security, US traders.
- Coinbase: 0.40% maker, 0.60% taker. 240+ coins. US regulated. FDIC insured. Best: beginners, US.
- Bybit: 0.10% maker/taker. 300+ coins. No KYC option. Best: derivatives, futures.

HARDWARE WALLETS:
- Ledger Nano X: $149. Bluetooth, 15,000+ coins.
- Trezor Safe 3: $79. Open-source, Secure Element, 8,000+ coins.
- CoolWallet Pro: $149. Credit card size, Bluetooth.

TAX SOFTWARE:
- Koinly: from $49/yr. 800+ integrations. 20+ countries.
- CoinLedger: from $49/yr. US-focused.

SECURITY:
- NordVPN: $3.39/mo.
- Bitwarden: $10/yr. Open source.

TRADING BOTS:
- WunderTrading: from $19/mo.
- TradingView: from $14.95/mo.

RESPONSE RULES:
1. Keep answers SHORT: 2-5 sentences max for simple questions.
2. Always give a SPECIFIC recommendation when asked.
3. If someone asks about fees, give EXACT percentages.
4. If someone is from the US, remind them which exchanges are/aren't available.
5. Be direct: "Use OKX" not "You might want to consider OKX as an option."
6. Use markdown sparingly — bold for key terms, no headers for short answers.

NEVER: give generic disclaimers as your main answer, refuse to recommend, be vague."""


def _build_chat(session_id: str, system: str = AI_SYSTEM_PROMPT) -> LlmChat:
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system,
    ).with_model("anthropic", "claude-sonnet-4-6")
    return chat


@api_router.post("/ai-advisor")
async def ai_advisor(req: AIAdvisorRequest):
    if not req.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    session_id = req.session_id or str(uuid.uuid4())

    # Save history for context replay — emergentintegrations LlmChat is single-turn here.
    # We feed the last user message; prior history is summarised in system context.
    last = req.messages[-1]
    if last.role != "user":
        raise HTTPException(status_code=400, detail="Last message must be from user")

    # Compose a thread-aware system message that includes the prior turns
    prior = req.messages[:-1][-8:]  # cap at last 8 prior turns
    thread_context = ""
    if prior:
        rendered = "\n".join(
            f"{'User' if m.role == 'user' else 'Assistant'}: {m.content}" for m in prior
        )
        thread_context = f"\n\nPRIOR CONVERSATION:\n{rendered}\n"

    system = AI_SYSTEM_PROMPT + thread_context
    chat = _build_chat(session_id, system=system)
    user_msg = UserMessage(text=last.content)

    async def event_gen():
        try:
            async for ev in chat.stream_message(user_msg):
                if isinstance(ev, TextDelta) and ev.content:
                    # Emit BOTH formats for backward compatibility:
                    # - new: {"type":"delta","text":"..."}
                    # - legacy Anthropic-style: {"type":"content_block_delta","delta":{"text":"..."}}
                    new_fmt = json.dumps({"type": "delta", "text": ev.content})
                    legacy_fmt = json.dumps({"type": "content_block_delta", "delta": {"text": ev.content}})
                    yield f"data: {new_fmt}\n\n"
                    yield f"data: {legacy_fmt}\n\n"
                elif isinstance(ev, StreamDone):
                    break
            yield "data: [DONE]\n\n"
        except Exception as e:
            logging.exception("[ai-advisor] stream error")
            err = json.dumps({"type": "error", "message": str(e)})
            yield f"data: {err}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


class AnalyzeRequest(BaseModel):
    prompt: str
    context: Optional[str] = None
    mode: Optional[Literal["scam-detector", "whitepaper", "general"]] = "general"


@api_router.post("/ai-advisor/analyze")
async def ai_analyze(req: AnalyzeRequest):
    """Non-streaming one-shot analysis (scam detector, whitepaper review)."""
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Empty prompt")

    system_map = {
        "scam-detector": "You are a crypto scam detector. Given a token, project, URL, or contract, identify red flags and return a clear risk verdict (LOW / MEDIUM / HIGH / CRITICAL) with 3-6 bullet reasons.",
        "whitepaper": "You are a crypto whitepaper analyst. Summarise the project's value proposition, tokenomics, team credibility, technical novelty, and risks in <250 words. End with a TL;DR verdict.",
        "general": AI_SYSTEM_PROMPT,
    }
    system = system_map.get(req.mode or "general", AI_SYSTEM_PROMPT)
    chat = _build_chat(str(uuid.uuid4()), system=system)

    text = req.prompt if not req.context else f"{req.prompt}\n\nCONTEXT:\n{req.context}"
    user_msg = UserMessage(text=text)

    # Collect the streamed deltas into a single string
    parts: list[str] = []
    try:
        async for ev in chat.stream_message(user_msg):
            if isinstance(ev, TextDelta) and ev.content:
                parts.append(ev.content)
            elif isinstance(ev, StreamDone):
                break
    except Exception as e:
        logging.exception("[analyze] error")
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")

    return {"response": "".join(parts), "mode": req.mode}


# ============================================================
# Supabase + Resend helpers
# ============================================================
def _supabase_headers() -> dict:
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }


async def _supabase_upsert(table: str, rows: list, on_conflict: str | None = None) -> dict:
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    params = {}
    if on_conflict:
        params["on_conflict"] = on_conflict
    headers = {**_supabase_headers(), "Prefer": "resolution=merge-duplicates,return=representation"}
    async with httpx.AsyncClient(timeout=10.0) as hc:
        r = await hc.post(url, headers=headers, params=params, json=rows)
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"Supabase upsert failed ({r.status_code}): {r.text[:300]}")
        return {"data": r.json() if r.text else []}


async def _supabase_insert(table: str, row: dict) -> dict:
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {**_supabase_headers(), "Prefer": "return=representation"}
    async with httpx.AsyncClient(timeout=10.0) as hc:
        r = await hc.post(url, headers=headers, json=row)
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"Supabase insert failed ({r.status_code}): {r.text[:300]}")
        return {"data": r.json() if r.text else []}


async def _supabase_select(table: str, params: dict | None = None) -> list:
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    async with httpx.AsyncClient(timeout=10.0) as hc:
        r = await hc.get(url, headers=_supabase_headers(), params=params or {})
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"Supabase select failed ({r.status_code}): {r.text[:300]}")
        return r.json()


# ============================================================
# Email subscribe (Resend Audience + Supabase log)
# ============================================================
EMAIL_RX = __import__("re").compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")

_subscribe_rate: dict[str, float] = {}  # ip -> last subscribe ts
_SUBSCRIBE_TTL = 60.0


class SubscribeRequest(BaseModel):
    email: str
    firstName: Optional[str] = None
    preferences: Optional[List[str]] = None


def _welcome_html(first_name: str | None, preferences: list[str], unsubscribe_url: str) -> str:
    name = (first_name or "there").strip()
    prefs_html = ", ".join(p.replace("_", " ") for p in (preferences or ["all"]))
    return f"""<!doctype html>
<html><body style="margin:0;padding:0;background:#F4F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F4F4F0;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#FFFFFF;border:2px solid #111111;box-shadow:6px 6px 0 0 #111111;">
        <tr><td style="height:14px;background:repeating-linear-gradient(-45deg,#FFD600 0 12px,#111111 12px 24px);border-bottom:2px solid #111111;"></td></tr>
        <tr><td style="padding:32px;">
          <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#FF5722;margin:0 0 12px;font-weight:700;">▲ Cryptoffiliate · Bonus Alerts</p>
          <h1 style="font-size:28px;line-height:1.1;margin:0 0 16px;color:#111111;font-weight:900;letter-spacing:-.02em;">You're in, {name}.</h1>
          <p style="font-size:15px;line-height:1.6;color:#111111;margin:0 0 20px;">
            We'll email you the moment a new exchange bonus drops — verified, no spam, you control the topics.
          </p>
          <div style="background:#F4F4F0;border:1.5px solid #111111;padding:12px 16px;margin:0 0 24px;">
            <p style="font-family:monospace;font-size:11px;color:#4A4A4A;margin:0 0 4px;letter-spacing:.08em;text-transform:uppercase;">Alerting on</p>
            <p style="font-size:14px;color:#111111;margin:0;font-weight:600;">{prefs_html}</p>
          </div>
          <p style="font-size:13px;color:#4A4A4A;line-height:1.6;margin:0 0 24px;">
            P.S. Editorial independence — affiliate links disclosed in every email.
          </p>
          <p style="font-size:11px;color:#4A4A4A;margin:24px 0 0;border-top:1px solid #EAEAEA;padding-top:16px;">
            Unsubscribe with one click: <a href="{unsubscribe_url}" style="color:#002FA7;">{unsubscribe_url}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


@api_router.post("/subscribe")
async def subscribe(req: SubscribeRequest, request: __import__("fastapi").Request):
    email = (req.email or "").strip().lower()
    if not email or not EMAIL_RX.match(email) or len(email) > 254:
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    ip = (request.headers.get("x-forwarded-for", "").split(",")[0].strip()
          or request.client.host if request.client else "unknown")
    now = time.time()
    last = _subscribe_rate.get(ip, 0.0)
    if now - last < _SUBSCRIBE_TTL:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a minute.")
    _subscribe_rate[ip] = now

    preferences = req.preferences or ["all"]
    first_name = (req.firstName or "").strip() or None

    resend_ok = False
    resend_error = None
    if RESEND_API_KEY and RESEND_AUDIENCE_ID:
        try:
            async with httpx.AsyncClient(timeout=10.0) as hc:
                # Add to Resend audience (ignore 'already exists' style 422s)
                contact_res = await hc.post(
                    f"https://api.resend.com/audiences/{RESEND_AUDIENCE_ID}/contacts",
                    headers={
                        "Authorization": f"Bearer {RESEND_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={"email": email, "first_name": first_name, "unsubscribed": False},
                )
                if contact_res.status_code >= 400 and contact_res.status_code != 422:
                    resend_error = f"contact create {contact_res.status_code}: {contact_res.text[:200]}"

                # Send welcome email
                unsub_url = f"{SITE_URL}/unsubscribed?email={email}" if SITE_URL else "https://cryptoffiliate.com"
                email_res = await hc.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {RESEND_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": f"Cryptoffiliate <alerts@{RESEND_FROM_DOMAIN}>",
                        "to": [email],
                        "subject": "You're in — bonus alerts are live",
                        "html": _welcome_html(first_name, preferences, unsub_url),
                        "headers": {
                            "List-Unsubscribe": f"<{unsub_url}>",
                            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                        },
                    },
                )
                if email_res.status_code < 400:
                    resend_ok = True
                else:
                    resend_error = f"email send {email_res.status_code}: {email_res.text[:200]}"
        except Exception as e:
            resend_error = f"resend exception: {e}"
            logging.exception("[subscribe] Resend failed")

    # Persist to Supabase (best-effort — log not blocking response)
    supabase_ok = False
    supabase_error = None
    if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
        try:
            ip_hash = hex(abs(hash(ip)) & 0xFFFFFFFF)[2:]
            await _supabase_upsert(
                "email_subscribers",
                [{
                    "email": email,
                    "first_name": first_name,
                    "preferences": preferences,
                    "subscribed_at": datetime.now(timezone.utc).isoformat(),
                    "ip_hash": ip_hash,
                    "source": "website",
                }],
                on_conflict="email",
            )
            supabase_ok = True
        except HTTPException as e:
            supabase_error = e.detail
            logging.warning(f"[subscribe] Supabase log failed: {e.detail}")
        except Exception as e:
            supabase_error = str(e)
            logging.exception("[subscribe] Supabase log failed")

    # If both services are unconfigured, report 503
    if not resend_ok and not supabase_ok and not RESEND_API_KEY and not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Email service not configured")

    return {
        "ok": True,
        "message": "You're subscribed! Check your inbox.",
        "resend": {"ok": resend_ok, "error": resend_error},
        "supabase": {"ok": supabase_ok, "error": supabase_error},
    }


# ============================================================
# Live fees endpoints (Supabase-backed)
# ============================================================
FALLBACK_EXCHANGE_FEES = {
    "binance":  {"maker": 0.10, "taker": 0.10},
    "kraken":   {"maker": 0.16, "taker": 0.26},
    "okx":      {"maker": 0.08, "taker": 0.10},
    "bybit":    {"maker": 0.10, "taker": 0.10},
    "coinbase": {"maker": 0.40, "taker": 0.60},
}


async def _fetch_kraken_exchange_fee() -> dict:
    url = "https://api.kraken.com/0/public/AssetPairs?pair=XBTUSD"
    async with httpx.AsyncClient(timeout=8.0) as hc:
        r = await hc.get(url, headers={"User-Agent": "cryptoffiliate/1.0"})
        r.raise_for_status()
        data = r.json()
    if data.get("error"):
        raise RuntimeError(f"Kraken: {data['error']}")
    pair = list((data.get("result") or {}).values())
    if not pair:
        raise RuntimeError("Kraken: empty result")
    p = pair[0]
    maker = float((p.get("fees_maker") or p.get("fees") or [[0, 0.16]])[0][1])
    taker = float((p.get("fees") or [[0, 0.26]])[0][1])
    return {"exchange_id": "kraken", "maker_fee": maker, "taker_fee": taker, "source": "api"}


async def _fetch_bybit_exchange_fee() -> dict:
    url = "https://api.bybit.com/v5/market/fee-rate?category=spot&symbol=BTCUSDT"
    async with httpx.AsyncClient(timeout=8.0) as hc:
        r = await hc.get(url)
        r.raise_for_status()
        data = r.json()
    if data.get("retCode") != 0:
        raise RuntimeError(f"Bybit: {data.get('retMsg')}")
    item = (data.get("result") or {}).get("list", [None])[0]
    if not item:
        raise RuntimeError("Bybit: empty list")
    return {
        "exchange_id": "bybit",
        "maker_fee": float(item["makerFeeRate"]) * 100,
        "taker_fee": float(item["takerFeeRate"]) * 100,
        "source": "api",
    }


async def _fetch_all_exchange_fees() -> list[dict]:
    """Fetch fees for all 5 exchanges in parallel, falling back to published tier on failure."""
    fetchers = {
        "kraken": _fetch_kraken_exchange_fee,
        "bybit":  _fetch_bybit_exchange_fee,
    }
    # binance, okx, coinbase are geo-blocked or auth-required from this env → use fallback

    results = []
    fetched_at = datetime.now(timezone.utc).isoformat()

    tasks = {eid: asyncio.create_task(fn()) for eid, fn in fetchers.items()}
    for eid, task in tasks.items():
        try:
            row = await task
            row["fetched_at"] = fetched_at
            row["error_msg"] = None
            results.append(row)
        except Exception as e:
            fb = FALLBACK_EXCHANGE_FEES[eid]
            results.append({
                "exchange_id": eid,
                "maker_fee": fb["maker"],
                "taker_fee": fb["taker"],
                "source": "fallback",
                "fetched_at": fetched_at,
                "error_msg": str(e)[:240],
            })

    for eid in ("binance", "okx", "coinbase"):
        fb = FALLBACK_EXCHANGE_FEES[eid]
        results.append({
            "exchange_id": eid,
            "maker_fee": fb["maker"],
            "taker_fee": fb["taker"],
            "source": "fallback",
            "fetched_at": fetched_at,
            "error_msg": "Published standard tier (geo-restricted or requires auth)",
        })

    return results


@api_router.get("/fees")
async def get_fees():
    """Public read of current exchange fees. Falls back to in-memory fetch if Supabase is unconfigured."""
    if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
        try:
            rows = await _supabase_select("exchange_fees", {"select": "*"})
            if rows:
                return {"fees": rows, "source": "supabase"}
        except HTTPException as e:
            logging.warning(f"[fees] Supabase read failed: {e.detail}")
    # Fallback: live fetch + static fallback
    fees = await _fetch_all_exchange_fees()
    return {"fees": fees, "source": "live"}


@api_router.post("/cron/sync-fees")
async def sync_fees(request: __import__("fastapi").Request):
    """Triggered by external scheduler. Auth via Authorization: Bearer <CRON_SECRET>."""
    auth = request.headers.get("authorization", "")
    if not CRON_SECRET or auth != f"Bearer {CRON_SECRET}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    started_at = datetime.now(timezone.utc)
    fees = await _fetch_all_exchange_fees()
    updated_count = sum(1 for f in fees if f["source"] == "api")
    fallback_count = sum(1 for f in fees if f["source"] == "fallback")

    supabase_ok = False
    errors: list[str] = []
    if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
        try:
            await _supabase_upsert("exchange_fees", fees, on_conflict="exchange_id")
            supabase_ok = True
        except HTTPException as e:
            errors.append(str(e.detail))
            logging.warning(f"[cron] Supabase upsert failed: {e.detail}")

        # Log the cron run (best-effort)
        try:
            await _supabase_insert("cron_runs", {
                "job_name": "sync-fees",
                "started_at": started_at.isoformat(),
                "completed_at": datetime.now(timezone.utc).isoformat(),
                "success": supabase_ok,
                "updated_count": updated_count,
                "fallback_count": fallback_count,
                "errors": errors,
            })
        except Exception as e:
            logging.warning(f"[cron] run log failed: {e}")

    return {
        "ok": True,
        "started_at": started_at.isoformat(),
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "updated_count": updated_count,
        "fallback_count": fallback_count,
        "supabase_written": supabase_ok,
        "errors": errors,
        "fees": fees,
    }


# ============================================================
# Wire up
# ============================================================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
