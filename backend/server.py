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
