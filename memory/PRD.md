# Cryptoffiliate — PRD

## Original Problem Statement
> "i built this with claude, how ever i want to improve the project and make imporve on the foundation ive built im open to coming up with a better color scheme"
>
> Session 2: "continue building this project" → assume defaults.
> Session 3: Wire Supabase + Resend lead capture; replace static EXCHANGES with a periodic fee scrape; cascade brutalist design to ScoreRing / FeeCalculator / TaxComparisonTable / hardware-wallets / tax-software / security pages.

## Goal
Make the platform's lead capture + nightly fee sync actually functional end-to-end, and start cascading the brutalist design language across the supporting components.

## User Personas
- Crypto-curious newcomer, active trader, self-custody focused, tax-season researcher.

## Tech Stack
- Next.js 14 App Router + TypeScript (frontend, port 3000)
- FastAPI + MongoDB + Supabase (REST) + Resend (REST) (backend, port 8001; k8s ingress routes `/api/*` here)
- Tailwind + CSS-variable brutalist design system
- Claude Sonnet 4.6 via `emergentintegrations` + EMERGENT_LLM_KEY
- Kraken public API (live ticker)
- Resend (transactional email + audience)

## What's Been Implemented

### Iteration 6 — Brutalist cascade extended to all 24 remaining inner pages (2026-06-09)
- Applied `brutalist-page` className to the root wrapper of every remaining inner page: `/about`, `/disclosure`, `/privacy`, `/quiz`, `/alerts`, `/bonuses`, `/proof-of-reserves`, `/regulatory-monitor`, `/security-audit`, `/status`, `/tax-harvesting`, `/volume`, `/whitepaper`, `/scam-detector`, `/ai-advisor`, and all 9 `/tools/*` pages.
- Most pages use `<div style={{ minHeight: "100vh", background: "var(--ink)" }}>` as the root, so I also **re-defined the `--ink / --paper / --gold / --chrome / --wire` CSS variables inside `.brutalist-page`** so inline `background: var(--ink)`, `color: var(--paper)`, `background: var(--gold)` declarations automatically flip to the brutalist palette without touching the per-page JSX. This means dozens of internal inline styles immediately become brutalist.
- Net effect: 29 of 30+ inner pages now render in editorial brutalist style (only the homepage `/`, `/compare`, and `/reviews` remain on the dark cyberpunk theme — those were intentionally designed for the dark hero look).
- All 24 pages return HTTP 200; backend test suite still 16/16 passing.

### Iteration 5 — Brutalist page cascade + in-process cron (2026-06-09)
**Frontend**
- **`.brutalist-page` CSS scope** added to `globals.css` (~200 lines) — re-flips the legacy dark-theme adaptations back to the editorial-brutalist light palette inside any element that opts in. Maps `bg-slate-50` → bone-paper, `bg-white` → surface, `text-slate-900` → ink, `.card` → bordered+offset-shadow, `.section-label` → vermilion bullet eyebrow, `.btn-outline` → brutalist outline button, inputs → 2 px ink border + zero radius, rounded-* utilities → 0. Includes inline-style re-flips for `#FFFFFF / #F4F4F0 / #111111 / 2px solid #111111` so React inline styles render correctly inside the scope.
- **Cascaded to 5 P0 pages** by adding `brutalist-page` class to the root wrapper of `/hardware-wallets`, `/tax-software`, `/security`, `/cloud-mining`, `/trading-bots`. All 5 now render in the editorial brutalist style with the dark navbar/ticker chrome remaining as the consistent global frame.

**Backend**
- **APScheduler in-process** (`AsyncIOScheduler`) — schedules `_scheduled_sync_fees()` at **02:00 UTC nightly**. Same logic as `POST /api/cron/sync-fees` but bypasses auth (internal). Logs to `cron_runs` table when Supabase is configured. Boot log confirms: `[scheduler] started — sync-fees scheduled nightly at 02:00 UTC`.
- `apscheduler>=3.10.4` pinned in `requirements.txt`.

**Backend tests** — all 16/16 still pass (100%) after the scheduler integration.

### Iteration 4 — Supabase + Resend + fee scrape + first design cascade (2026-06-09)
**Backend (`/app/backend/server.py`)**
- `POST /api/subscribe` — email validation, IP-keyed 60 s rate limit, Resend Audience + welcome email + Supabase log; graceful-degrades when either service is misconfigured.
- `GET /api/fees` — returns 5-exchange fee table, reads from Supabase `exchange_fees` when present, else falls back to live fetch.
- `POST /api/cron/sync-fees` — Bearer-token authed, parallel fetches fees from Kraken + Bybit, upserts to Supabase `exchange_fees` + logs the run in `cron_runs`. Geo-blocked exchanges (Binance, OKX, Coinbase) use published standard tier as fallback.
- Helpers added: `_supabase_upsert / _insert / _select` (REST), `_fetch_kraken_exchange_fee`, `_fetch_bybit_exchange_fee`, `_fetch_all_exchange_fees`.
- Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_AUDIENCE_ID, RESEND_FROM_DOMAIN, SITE_URL, CRON_SECRET.

**Frontend**
- `FeeCalculator.tsx` — fully rewritten in brutalist style: editorial header, mint "SAVE" callout, ranked rows with cheapest/worst color coding, vermilion CTAs, 2-3 px ink borders + offset shadows.
- `TaxComparisonTable.tsx` — fully rewritten: bordered filter/sort pill bar, jet-black header row, mint commission pills, brutalist check/cross icons, expanded row brutalist detail panel, ink footer.

**Bug fixes**
- Removed leftover CRA `utils.js` that was shadowing `utils.ts` in Next.js's module resolution (was causing 500s on /tools/fee-calculator).

**Backend tests** — 16/16 pass (100%): existing 9 + new 7 covering /subscribe valid/invalid/rate-limit, /fees, /cron/sync-fees no-auth/wrong-bearer/correct-bearer.

### Iteration 3 — Live integrations (2026-06-09)
- Live ticker via Kraken (`/api/ticker`); Claude Sonnet 4.6 streamed `/api/ai-advisor`; non-streaming `/api/ai-advisor/analyze`.
- Frontend Next.js install repaired (was wrongly on CRA); dead Next.js `/api/ai-advisor` route removed.

### Iteration 2 — Inner-page cascade
- ExchangeCard, ExchangeComparisonTable, BonusAlertCapture, /reviews restyled.

### Iteration 1 — Foundation
- Editorial Neo-Brutalism design system established; Ticker, Nav, Footer, AIChat, HomeExchangeTable, homepage rewritten.

## Files Modified This Iteration
- `/app/backend/server.py` — added subscribe / fees / cron endpoints + Supabase + Resend helpers; ~720 lines now (split candidate for next iteration).
- `/app/backend/.env` — added SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_*, SITE_URL, CRON_SECRET.
- `/app/frontend/src/components/FeeCalculator.tsx` — brutalist rewrite.
- `/app/frontend/src/components/TaxComparisonTable.tsx` — brutalist rewrite.
- Deleted `/app/frontend/src/lib/utils.js` (stale CRA shadow).

## Action Items For User
1. **Run the SQL schemas** in your Supabase project (Supabase Dashboard → SQL Editor):
   - `/app/frontend/supabase-subscribers-schema.sql`
   - `/app/frontend/supabase-fees-schema.sql`
   - `/app/frontend/supabase-schema.sql` (creates the base `exchanges` table that the fees schema references)
2. **Swap `SUPABASE_SERVICE_ROLE_KEY`** in `/app/backend/.env` — the value you provided is the *publishable* key (`sb_publishable_…`). Get the actual service-role key (starts with `eyJ…`) from Supabase → Project Settings → API → "service_role" secret, paste, then `sudo supervisorctl restart backend`.
3. **Verify Resend `from` domain** — `cryptoffiliate.com` must be a verified sending domain in your Resend account or emails will bounce.

## Prioritized Backlog

### P0 (next session)
- **Run the 3 Supabase SQL files + swap the publishable key for the real service-role JWT** (see "Action Items For User" above). Until these are done, all Supabase writes 404 with `PGRST205` and the nightly cron's persistence step is a no-op.
- Decide on the homepage/`/compare`/`/reviews` treatment — those 3 pages were intentionally designed for the dark cyberpunk hero. Either keep the dual-aesthetic (dark hero + brutalist everything else) or cascade them too for full consistency.

### P1
- Split `server.py` (~770 lines) into `routes/{ai,ticker,subscribe,fees,scheduler}.py`.
- Move hard-coded fee fallbacks + AI system prompt to a single `data/fees.json` config.
- Mobile responsive pass on `/compare`, `/reviews`, `/hardware-wallets`, `/tax-software`.
- Multi-turn AI chat memory persisted in Mongo (currently rebuilds context per request).

### P2
- Per-session rate-limit on `/api/ai-advisor` to protect the EMERGENT_LLM_KEY budget.
- `Last updated · N hours ago` freshness badge on every comparison table (reading `exchange_fees.fetched_at`).
- Animated number counters on hero stats.
- Track affiliate clicks in Supabase + nightly digest email of top-converting links.

## Notes
- Bybit/Binance APIs are geo-blocked from the Emergent container IP (HTTP 403/451) — the cron job uses published standard tier as the fallback for those exchanges. Switch the cron to run from a server with unrestricted egress (e.g. a Vercel/Cloudflare cron) to get live values for all 5 exchanges.
- CoinGecko free tier rate-limits this IP range aggressively, so the live ticker uses Kraken instead (Kraken returns BTC at the 0.25 % base tier in their data — this is actually accurate; the 0.16 % figure is a Pro-tier rate).

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
