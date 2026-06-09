"""Backend tests for Cryptoffiliate FastAPI app.

Covers:
- GET /api/                       (root health)
- GET /api/ticker                 (Kraken-backed live ticker + 60s cache)
- POST /api/ai-advisor            (SSE streaming Claude via emergentintegrations)
- POST /api/ai-advisor/analyze    (non-streaming one-shot scam/whitepaper)
- POST /api/status, GET /api/status (Mongo round-trip)
"""
import json
import os
import time
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # frontend .env file source of truth
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break
BASE_URL = (BASE_URL or "").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def http():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root_ok(self, http):
        r = http.get(f"{API}/", timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body.get("status") == "ok"
        assert "message" in body


# ---------- Ticker ----------
class TestTicker:
    def test_ticker_shape_and_source(self, http):
        r = http.get(f"{API}/ticker", timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "items" in body and isinstance(body["items"], list) and len(body["items"]) > 0
        assert "updated_at" in body
        assert "source" in body
        labels = [it.get("label") for it in body["items"]]
        # static exchange-fee items must always be present
        assert "OKX MAKER" in labels, f"OKX MAKER missing, got {labels}"
        # When Kraken is reachable, source must be 'kraken' and BTC/USD should appear
        if body["source"] == "kraken":
            assert "BTC/USD" in labels, f"BTC/USD missing in kraken response: {labels}"
        else:
            # report fallback so main agent is aware
            print(f"[WARN] ticker source={body['source']} (Kraken upstream likely blocked)")

    def test_ticker_cache_hit(self, http):
        r1 = http.get(f"{API}/ticker", timeout=20)
        assert r1.status_code == 200
        updated1 = r1.json().get("updated_at")
        # second call within ~60s should be cache-served -> identical updated_at
        time.sleep(1.5)
        r2 = http.get(f"{API}/ticker", timeout=20)
        assert r2.status_code == 200
        updated2 = r2.json().get("updated_at")
        assert updated1 == updated2, "Cache should return identical updated_at within TTL"


# ---------- AI Advisor SSE ----------
class TestAIAdvisorStream:
    def test_empty_messages_returns_400(self, http):
        r = http.post(f"{API}/ai-advisor", json={"messages": []}, timeout=20)
        assert r.status_code == 400, r.text

    def test_assistant_last_returns_400(self, http):
        r = http.post(
            f"{API}/ai-advisor",
            json={"messages": [{"role": "assistant", "content": "hi"}]},
            timeout=20,
        )
        assert r.status_code == 400, r.text

    def test_stream_emits_both_delta_formats(self, http):
        with http.post(
            f"{API}/ai-advisor",
            json={"messages": [{"role": "user", "content": "hi"}]},
            stream=True,
            timeout=60,
        ) as r:
            assert r.status_code == 200, r.text
            ctype = r.headers.get("content-type", "")
            assert "text/event-stream" in ctype, ctype

            saw_new = False
            saw_legacy = False
            saw_done = False
            collected_text = []
            deadline = time.time() + 45
            for raw in r.iter_lines(decode_unicode=True):
                if time.time() > deadline:
                    break
                if not raw:
                    continue
                if not raw.startswith("data:"):
                    continue
                payload = raw[len("data:"):].strip()
                if payload == "[DONE]":
                    saw_done = True
                    break
                try:
                    ev = json.loads(payload)
                except json.JSONDecodeError:
                    continue
                if ev.get("type") == "delta" and ev.get("text"):
                    saw_new = True
                    collected_text.append(ev["text"])
                elif ev.get("type") == "content_block_delta":
                    if (ev.get("delta") or {}).get("text"):
                        saw_legacy = True
                elif ev.get("type") == "error":
                    pytest.fail(f"Stream returned error event: {ev}")

            assert saw_new, "Did not receive any new-format {type:delta} events"
            assert saw_legacy, "Did not receive any legacy content_block_delta events"
            assert saw_done, "Stream did not end with [DONE]"
            assert "".join(collected_text).strip(), "No text was streamed"


# ---------- AI Advisor analyze (non-streaming) ----------
class TestAIAdvisorAnalyze:
    def test_empty_prompt_returns_400(self, http):
        r = http.post(f"{API}/ai-advisor/analyze", json={"prompt": "   "}, timeout=20)
        assert r.status_code == 400, r.text

    def test_scam_detector_ok(self, http):
        r = http.post(
            f"{API}/ai-advisor/analyze",
            json={"prompt": "binance.com legit?", "mode": "scam-detector"},
            timeout=90,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body.get("mode") == "scam-detector"
        assert isinstance(body.get("response"), str)
        assert body["response"].strip(), "Empty LLM response"


# ---------- Status ----------
class TestStatus:
    def test_create_and_list_status(self, http):
        name = f"TEST_{uuid.uuid4().hex[:8]}"
        r = http.post(f"{API}/status", json={"client_name": name}, timeout=15)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created.get("client_name") == name
        assert "id" in created and "timestamp" in created
        assert isinstance(created["id"], str) and len(created["id"]) > 0

        r2 = http.get(f"{API}/status", timeout=15)
        assert r2.status_code == 200, r2.text
        rows = r2.json()
        assert isinstance(rows, list)
        names = [row.get("client_name") for row in rows]
        assert name in names, f"Created status not returned by GET; names={names[:5]}..."
