# Cryptoffiliate — PRD

## Original Problem Statement
> "i built this with claude, how ever i want to improve the project and make imporve on the foundation ive built im open to coming up with a better color scheme"

User uploaded `cryptoffiliate-complete-v2.zip` — a Next.js 14 affiliate platform with 30+ pages built with Supabase, Resend, and Anthropic Claude.

## Goal
Establish a stronger, more distinctive design foundation with a fresh color scheme that distances the site from the AI-slop "dark + gold fintech" aesthetic, while preserving all existing functionality.

## User Personas
- **Crypto-curious newcomer** — needs an honest "which exchange should I use?" answer
- **Active trader** — needs to compare fees down to the basis point
- **Self-custody focused** — needs unbiased hardware-wallet & VPN/security guidance
- **Tax-season researcher** — needs to compare tax software & strategies

## Tech Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + custom CSS-variable design system
- Supabase (lead capture, fee history)
- Resend (transactional email)
- Anthropic Claude (AI advisor, scam detector, whitepaper analyser)
- Hosted at `claude-upgrade-4.preview.emergentagent.com`

## What's Been Implemented (2026-01-09)

### Iteration 2 — Inner-page cascade (2026-01-09 PM)
- **Tailwind config** rebuilt — `brand-*` now maps to vermilion (#FF5722), font families flipped to Cabinet Grotesk / IBM Plex Sans / IBM Plex Mono / Instrument Serif, all `border-radius` utilities flattened to 0
- **globals.css legacy adaptations** — added overrides so `text-slate-*`, `bg-slate-*`, `bg-brand-*`, `border-brand-*`, `rounded-*`, etc. resolve to the new brutalist palette automatically across ALL 30+ pages
- **ExchangeCard.tsx** — coloured top bar, brutalist logo tile, ★ rating row, 3-up stat grid, green bonus bar, brand-coloured CTA button + outline "Review" link
- **ExchangeComparisonTable.tsx** — fully restyled: brutalist filter/sort pill bar, hard-bordered table, alternating row bg, expanded row with 3-column brutalist detail panel (Best for / Commission / Features), dark footer with "LAST UPDATED: TONIGHT" yellow tag
- **BonusAlertCapture.tsx** — `Inline` variant has yellow diagonal stripe header, vermilion bell tile, social-proof bar with four coloured swatches, brutalist preference pills; `Compact` variant in canary-yellow; `Banner` (sticky) in ink-black with orange tile
- **/reviews** listing page — editorial masthead "THE REVIEW · SECTION B", huge "Crypto exchange / reviews." headline with blue italic serif accent, grid of cards with "№ 01"–"№ NN" issue numbers, coloured logo tiles, badge pills, ★ rating row
- **/reviews/[slug]** individual page — breadcrumb, black "THE REVIEW · № EXCHANGE" masthead, big review header card with shadow, yellow affiliate disclosure strip, dark verdict CTA box with orange-shadowed CTA button, brutalist score-breakdown bars (green/yellow/orange/red by tier), at-a-glance stat grid, brutalist pros/cons split, bottom affiliate CTA

### Iteration 1 — Foundation (earlier today)
- Design system overhaul — "Editorial Neo-Brutalism"
- New palette: bone-paper (#F4F4F0) backgrounds, ink-black (#111) text + borders, **vermilion (#FF5722)** primary accent, **Yves Klein blue (#002FA7)** secondary, **canary yellow (#FFD600)** highlight, **mint green (#00C853)** for live/positive states
- Typography: **Cabinet Grotesk** (display), **IBM Plex Sans** (body), **IBM Plex Mono** (code/eyebrow/ticker), **Instrument Serif** (italic accents)
- Hard 2-3px black borders, brutalist offset shadows, sharp (zero-radius) corners, alternating row striping, repeating diagonal "stripe" dividers
- Rebuilt: Ticker, Nav, Footer, AIChat (terminal-style), HomeExchangeTable, page.tsx homepage

## Architecture / Files Modified
- `src/app/globals.css` — entire design token system rewritten
- `src/app/page.tsx` — homepage fully redesigned
- `src/components/Nav.tsx`, `Footer.tsx`, `Ticker.tsx`, `AIChat.tsx`, `HomeExchangeTable.tsx` — all rewritten
- `package.json` scripts updated so `yarn start` runs `next dev` on 0.0.0.0:3000 (supervisor compatibility)
- `.env` — kept REACT_APP_BACKEND_URL, added Next.js placeholder vars

## Prioritized Backlog

### P0 (next session)
- Apply the new design language to inner-page components: `ExchangeCard`, `ExchangeComparisonTable`, `BonusAlertCapture`, `ScoreRing`, individual review pages
- Wire Anthropic / Supabase real env keys so AI advisor + lead capture work end-to-end

### P1
- Light/dark theme toggle (system is light-first; create an inverse dark mode as opt-in)
- Mobile redesign pass for `/compare`, `/reviews`, `/hardware-wallets`, `/tax-software` (test all dropdown menus on iPhone widths)
- Hero ticker: pull real prices from CoinGecko instead of static demo values

### P2
- "Last updated" freshness badge on every comparison table (pulled from Supabase)
- Animated number counters on hero stats (40+, 06, Nightly, Free)
- Author bylines + editorial dates on review pages (lean further into the "magazine" metaphor)
- Print stylesheet for review pages (editorial brand extension)

## Notes
- The existing 30+ sub-pages still render correctly because they consume CSS variables (`--ink`, `--paper`, `--gold`, `--klein`, etc.) — the variables now resolve to the new palette, so the entire site flipped to light/brutalist without breaking individual page layouts.
- Some sub-pages may still have hard-coded hex colors from the previous dark theme. These are non-critical (text remains readable) but should be cleaned up in P0.
- AI advisor backend (`/api/ai-advisor/route.ts`) and Supabase calls are wired but currently use placeholder env keys — replace before going live.
