# cryptoffiliate.com

Crypto exchange review and comparison site built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your Supabase keys
cp .env.local.example .env.local

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Homepage
│   ├── compare/page.tsx         # Exchange comparison table
│   ├── reviews/
│   │   ├── page.tsx             # Reviews index
│   │   └── [slug]/page.tsx      # Individual exchange review
│   ├── bonuses/page.tsx         # Promo codes & signup bonuses
│   └── tools/
│       └── fee-calculator/      # Interactive fee calculator
│           └── page.tsx
├── components/
│   ├── Nav.tsx                  # Sticky navigation
│   ├── Footer.tsx               # Footer with affiliate disclosure
│   ├── ExchangeComparisonTable.tsx  # ★ Main comparison table
│   ├── ExchangeCard.tsx         # Homepage top-pick cards
│   └── FeeCalculator.tsx        # Fee comparison tool
├── data/
│   └── exchanges.ts             # ★ Central exchange data — edit this
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   ├── supabase.ts              # Supabase client
│   └── utils.ts                 # Helpers (cn, buildAffiliateUrl, etc.)
└── app/globals.css              # Tailwind + base styles
```

---

## Adding a new exchange

Edit `src/data/exchanges.ts` and add a new object to the `EXCHANGES` array:

```ts
{
  id: "newexchange",
  slug: "newexchange",
  name: "New Exchange",
  logo: "NE",
  logoColor: "#FF5500",
  tagline: "Your tagline here",
  rating: 4.2,
  reviews: 3000,
  makerFee: 0.1,
  takerFee: 0.15,
  withdrawalFee: "Low",
  minDeposit: "$0",
  coins: 150,
  kyc: "required",
  fiatOnRamp: true,
  futures: false,
  staking: false,
  usBased: true,
  best: ["Great UI", "Low fees"],
  affiliateUrl: "https://newexchange.com/ref=CRYPTOFFILIATE",
  bonus: "$20 welcome bonus",
  commission: "$15 per signup",
  badge: null,
  badgeColor: null,
  founded: 2020,
  headquarters: "USA",
  lastUpdated: "2025-06-01",
}
```

The exchange will automatically appear on the comparison table, fee calculator, bonuses page, and get its own review page at `/reviews/newexchange`.

---

## Updating affiliate links

All affiliate URLs are in `src/data/exchanges.ts` under the `affiliateUrl` field. UTM parameters are added automatically by `buildAffiliateUrl()` in `src/lib/utils.ts`.

Replace `CRYPTOFFILIATE` in each URL with your actual referral code from each program.

---

## Setting up Supabase (optional — for live fee data)

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the SQL editor
3. Copy your project URL and anon key into `.env.local`
4. Build a cron job (Vercel Cron or a GitHub Action) to sync fee data from exchange APIs nightly

---

## Deployment

```bash
# Deploy to Vercel (recommended)
npx vercel

# Or build for production
npm run build
npm start
```

Point your `cryptoffiliate.com` domain to Vercel in your domain registrar.

---

## SEO notes

- Every review page generates JSON-LD Review schema automatically → star ratings in Google SERPs
- All pages use Next.js `generateMetadata` for dynamic `<title>` and `<meta description>`
- Exchange review pages use `generateStaticParams` for full SSG at build time
- Affiliate links use `rel="noopener noreferrer sponsored"` per Google's guidelines

---

## Affiliate disclosure

This site earns commissions when visitors sign up through affiliate links.
Disclosures appear on every page containing affiliate links, per FTC requirements.
