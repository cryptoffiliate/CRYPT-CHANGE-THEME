# Cryptoffiliate — PRD

## Original Problem Statement
> "i built this with claude, how ever i want to improve the project and make imporve on the foundation ive built im open to coming up with a better color scheme"
>
> Subsequent session: "continue building this project" → assume defaults.

User uploaded `cryptoffiliate-main.zip` — a Next.js 14 affiliate platform with 30+ pages, "Editorial Neo-Brutalism" design already applied in iterations 1-2.

## Goal
Wire up the live integrations that were placeholders, so the platform feels real end-to-end: live market ticker + AI advisor.

## User Personas
- **Crypto-curious newcomer** — needs an honest "which exchange should I use?" answer
- **Active trader** — needs to compare fees down to the basis point
- **Self-custody focused** — needs unbiased hardware-wallet & VPN/security guidance
- **Tax-season researcher** — needs to compare tax software & strategies

## Tech Stack
- Next.js 14 App Router + TypeScript (frontend, served on port 3000)
- FastAPI + MongoDB (backend, served on port 8001 — k8s ingress routes `/api/*` here)
- Tailwind CSS + custom CSS-variable brutalist design system
- Supabase (lead capture, fee history) — env keys still placeholder
- Resend (transactional email) — env keys still placeholder
- **Claude Sonnet 4.6** via `emergentintegrations` + `EMERGENT_LLM_KEY` (AI advisor, scam detector, whitepaper analyser)
- Kraken public API (live ticker)

## What's Been Implemented

### Iteration 3 — Live integrations (2026-06-09)
- **Frontend restored** to Next.js (was wrongly running CRA scripts) — removed `craco.config.js`, legacy `tailwind.config.js`, and reinstalled clean Next.js dependencies
- **Backend rewritten** (`/app/backend/server.py`) with three new public endpoints:
  - `GET  /api/ticker` → live BTC/ETH/BNB/SOL/XRP/ADA/DOGE/AVAX prices + 24h % from Kraken public API, in-process 60 s cache, with exchange-fee static rows appended. Returns `{items, updated_at, source}`. Handles Kraken's quirky pair aliases (`XBTUSD→XXBTZUSD`, `XDGUSD→XXDGZUSD`, etc.).
  - `POST /api/ai-advisor` → SSE-streamed Claude Sonnet 4.6 chat. Emits BOTH new (`{type:"delta",text}`) and legacy (`{type:"content_block_delta",delta:{text}}`) event shapes so old client code keeps working. Validates last-message-is-user and non-empty history.
  - `POST /api/ai-advisor/analyze` → non-streaming one-shot analysis for scam-detector / whitepaper / general modes.
- **Ticker.tsx** rewired to fetch `/api/ticker` on mount + every 60 s; shows a green "LIVE" pill (or amber "CACHED" when serving fallback). Adds `data-testid` per ticker row.
- **AIChat.tsx** updated to parse the new SSE format, with proper buffer handling across chunked decodes.
- **ScamDetector.tsx** switched to the new `/api/ai-advisor/analyze` endpoint and robust JSON extraction.
- Deleted dead `src/app/api/ai-advisor/route.ts` (Next.js API route — never reachable because ingress routes `/api/*` to FastAPI on :8001).
- Added `EMERGENT_LLM_KEY` to `/app/backend/.env`; installed `emergentintegrations` + `httpx` and pinned in `requirements.txt`.

**Testing**: All 9 backend tests pass (100%). Verified live: BTC $61,685 -2.19% via Kraken; AI advisor streams Claude Sonnet 4.6 responses.

### Iteration 2 — Inner-page cascade (2026-01-09 PM)
- Tailwind config rebuilt — brutalist palette + Cabinet Grotesk / IBM Plex Sans / IBM Plex Mono fonts
- ExchangeCard, ExchangeComparisonTable, BonusAlertCapture restyled
- /reviews listing + /reviews/[slug] detail pages redesigned

### Iteration 1 — Foundation
- Editorial Neo-Brutalism design system established
- Ticker, Nav, Footer, AIChat (terminal-style), HomeExchangeTable, homepage all rewritten

## Architecture / Files Modified (this session)
- `/app/backend/server.py` — rewritten with `/api/ticker`, `/api/ai-advisor`, `/api/ai-advisor/analyze`
- `/app/backend/.env` — added `EMERGENT_LLM_KEY`
- `/app/backend/requirements.txt` — added `httpx>=0.27.0` (emergentintegrations already pinned)
- `/app/frontend/src/components/Ticker.tsx` — fetches live data with LIVE/CACHED pill
- `/app/frontend/src/components/AIChat.tsx` — new SSE delta parser
- `/app/frontend/src/components/tools/ScamDetector.tsx` — uses /analyze endpoint
- `/app/frontend/src/app/api/ai-advisor/route.ts` — deleted

## Prioritized Backlog

### P0 (next session)
- Wire real Supabase project URL + service key so `BonusAlertCapture` lead capture actually persists
- Wire Resend API key so subscription confirmations send
- Replace placeholder `EXCHANGES` static data with periodic CoinGecko Pro / CryptoCompare exchange-fee scrape (the nightly cron route `/app/frontend/src/app/api/cron/` already scaffolds this)
- Apply the new design language to remaining inner components: `ScoreRing`, `FeeCalculator`, `TaxComparisonTable`, hardware-wallets/tax-software/security pages

### P1
- Light/dark theme toggle (system is currently dark cyberpunk; add light brutalist mode)
- Mobile redesign pass for `/compare`, `/reviews`, `/hardware-wallets`, `/tax-software`
- Multi-turn AI memory — currently each `/api/ai-advisor` call rebuilds context via system prompt; consider persisting per-session chat history in Mongo for true continuity
- Author bylines + editorial dates on review pages
- "Last updated" freshness badge on every comparison table

### P2
- Print stylesheet for review pages (editorial brand extension)
- Animated number counters on hero stats
- Per-session rate limiting on `/api/ai-advisor` to prevent abuse of the EMERGENT_LLM_KEY budget

## Notes
- The Kraken public API is unauthenticated and free — sufficient for the ticker. Coinbase/Binance APIs were blocked from our IP range (CoinGecko rate-limited, Binance geo-blocked HTTP 451).
- AI advisor uses `claude-sonnet-4-6` (the "recommended" Anthropic model in the Emergent playbook) — switch to `claude-opus-4-7` if you want adaptive thinking + larger task budgets, at higher cost.
- The legacy Next.js `/api/ai-advisor` route file was removed — all external `/api/*` traffic is routed to FastAPI by the kube ingress.
