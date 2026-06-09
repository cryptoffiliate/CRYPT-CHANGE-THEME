# 🚀 Deploying cryptoffiliate.com — Step-by-Step Guide

This guide takes you from the zip file to a live, fully functional site at cryptoffiliate.com.
Total time: approximately 45–60 minutes.

---

## Prerequisites

- Node.js 18+ installed (`node -v` to check)
- A GitHub account
- A Vercel account (free at vercel.com)
- A Supabase account (free at supabase.com)
- A Resend account (free at resend.com — 3,000 emails/month free)
- Your affiliate referral codes from the exchanges

---

## Step 1 — Set up the project locally

```bash
# 1. Unzip the project
unzip cryptoffiliate-complete.zip
cd cryptoffiliate

# 2. Install dependencies
npm install

# 3. Copy the env template
cp .env.local.example .env.local
```

---

## Step 2 — Set up Supabase

1. Go to **supabase.com** → New Project → name it `cryptoffiliate`
2. Copy your **Project URL** and **anon key** from Settings → API
3. Copy your **service role key** from Settings → API (keep this secret)
4. Go to the **SQL Editor** and run these files in order:
   - `supabase-schema.sql`
   - `supabase-fees-schema.sql`
   - `supabase-subscribers-schema.sql`

---

## Step 3 — Set up Resend

1. Go to **resend.com** → sign up → Create API Key (Full Access)
2. Go to **Domains** → Add Domain → add `cryptoffiliate.com`
3. Add the DNS records Resend shows you to your domain registrar
   (usually takes 5–15 minutes to verify)
4. Go to **Audiences** → Create Audience → name it `Cryptoffiliate Alerts`
5. Copy the Audience ID (looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

## Step 4 — Register affiliate programs

Apply to these programs (all free, most approve within 24–48 hours):

| Exchange | Affiliate Program URL                              | What to get          |
|----------|----------------------------------------------------|----------------------|
| Binance  | binance.com/en/activity/referral                   | Referral code        |
| Coinbase | coinbase.com/affiliates                            | Referral link        |
| Kraken   | kraken.com/affiliate                               | Referral code        |
| Bybit    | bybit.com/en/login → Partner Program               | Affiliate ID         |
| OKX      | okx.com/affiliate                                  | Referral code        |

Once approved, update `src/data/exchanges.ts` and `src/lib/quiz-engine.ts`:
- Replace every `CRYPTOFFILIATE` placeholder with your real referral codes

Example:
```ts
// Before:
affiliateUrl: "https://www.binance.com/en/register?ref=CRYPTOFFILIATE",

// After (use YOUR actual code from the Binance affiliate dashboard):
affiliateUrl: "https://www.binance.com/en/register?ref=ABC123XYZ",
```

---

## Step 5 — Fill in your .env.local

```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cron secret (generate one with: openssl rand -base64 32)
CRON_SECRET=your-generated-secret

# Site URL
NEXT_PUBLIC_SITE_URL=https://cryptoffiliate.com

# Resend (from Step 3)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
RESEND_FROM_DOMAIN=cryptoffiliate.com

# Admin secret for sending broadcasts (generate one with: openssl rand -base64 32)
ADMIN_SECRET=your-admin-secret

# Optional: OKX and Coinbase API keys for live fee data
OKX_API_KEY=
OKX_SECRET=
OKX_PASSPHRASE=
COINBASE_API_KEY=
```

---

## Step 6 — Test locally

```bash
npm run dev
# Open http://localhost:3000

# Test the fee cron job (in a separate terminal while dev server is running):
npm run cron:local

# Test fee fetchers directly:
npm run test:fees
```

Check these pages work:
- [ ] http://localhost:3000 — homepage
- [ ] http://localhost:3000/compare — comparison table
- [ ] http://localhost:3000/quiz — quiz (answer all 5 questions)
- [ ] http://localhost:3000/tools/fee-breakdown — hidden fee calculator
- [ ] http://localhost:3000/bonuses — bonuses page
- [ ] http://localhost:3000/alerts — email signup
- [ ] http://localhost:3000/reviews/coinbase — individual review

---

## Step 7 — Deploy to Vercel

### Option A — GitHub (recommended for auto-deploys)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit — cryptoffiliate.com"
git remote add origin https://github.com/YOUR_USERNAME/cryptoffiliate.git
git push -u origin main
```

Then:
1. Go to **vercel.com** → New Project → Import from GitHub → select `cryptoffiliate`
2. Framework: **Next.js** (auto-detected)
3. Click **Deploy** (it will fail — that's ok, you need env vars next)

### Option B — Vercel CLI

```bash
npx vercel --prod
```

---

## Step 8 — Add environment variables to Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add every variable from your `.env.local` file
3. Make sure they're set for **Production**, **Preview**, and **Development**
4. **Redeploy** from the Deployments tab

---

## Step 9 — Point cryptoffiliate.com to Vercel

1. In Vercel: Project → **Settings** → **Domains** → Add `cryptoffiliate.com`
2. Vercel will show you DNS records to add
3. At your domain registrar (where you bought the domain):
   - Add the `A` record Vercel provides
   - Add the `CNAME` for `www`
4. Wait 10–30 minutes for DNS propagation
5. Vercel auto-provisions an SSL certificate

---

## Step 10 — Verify the cron job

The fee sync cron runs at 2:00 AM UTC automatically.
To test it manually after deploy:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://cryptoffiliate.com/api/cron/sync-fees
```

Expected response:
```json
{ "ok": true, "updatedCount": 5, "fallbackCount": 2 }
```

Check Supabase → Table Editor → `exchange_fees` to see live fee data.

---

## Step 11 — Set up Google Search Console

1. Go to **search.google.com/search-console**
2. Add property → Domain → `cryptoffiliate.com`
3. Verify via DNS TXT record
4. Submit sitemap: `https://cryptoffiliate.com/sitemap.xml`
5. Request indexing for the homepage

---

## Step 12 — Post-launch checklist

- [ ] All 5 affiliate programs applied to
- [ ] All `CRYPTOFFILIATE` placeholders replaced with real codes
- [ ] Supabase tables created (all 3 SQL files run)
- [ ] Resend domain verified (DNS records added)
- [ ] Site loads at cryptoffiliate.com with SSL
- [ ] Fee cron job returns `ok: true`
- [ ] Test email signup at /alerts (check inbox)
- [ ] Google Search Console verified + sitemap submitted
- [ ] Instagram @Cryptoffiliate bio updated with site link

---

## Sending your first bonus alert broadcast

Once you have subscribers, send a broadcast with one curl command:

```bash
curl -X POST https://cryptoffiliate.com/api/admin/send-bonus-alert \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "exchange": { "name": "Binance", "logo": "B", "color": "#F0B90B" },
    "bonus": {
      "title": "20% fee discount for life",
      "description": "Binance just increased their referral bonus. New signups get a permanent 20% discount on all trading fees using our link.",
      "promoCode": "YOUR_REAL_CODE"
    },
    "affiliateUrl": "https://www.binance.com/en/register?ref=YOUR_REAL_CODE",
    "otherBonuses": [
      { "name": "Coinbase", "bonus": "$10 free Bitcoin", "url": "https://coinbase.com/join/YOUR_CODE" }
    ]
  }'
```

---

## Troubleshooting

**Build fails: "Cannot find module '@react-email/components'"**
→ This was replaced with the zero-dep renderer. Run `npm install` again — it should not be in package.json.

**Supabase connection error in logs**
→ Check that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly in Vercel env vars.

**Cron job returns 401**
→ The `Authorization: Bearer` header must match `CRON_SECRET` exactly. Check for trailing spaces.

**Emails not sending**
→ Verify your Resend domain DNS records are confirmed (green checkmark in Resend dashboard).

**Fee data showing "fallback" in Supabase**
→ Normal for Coinbase and OKX without API keys. Add the optional API keys to get live data.

---

## Support

Questions? Open the project zip, check the README, or ask Claude at claude.ai.
