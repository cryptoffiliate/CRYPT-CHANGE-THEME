import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TRADING_BOT_PLATFORMS, getTradingBotBySlug } from "@/data/trading-bots";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return TRADING_BOT_PLATFORMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getTradingBotBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} Review 2025 — Pricing, Features & Affiliate Commission`,
    description: `${p.name} review: ${p.freeTier ? "free tier available," : `from $${p.priceFrom}/month,`} ${p.supportedExchanges} exchanges, ${p.commissionFirst} affiliate commission. Honest verdict.`,
  };
}

function Check({ val }: { val: boolean }) {
  return val ? <span className="text-emerald-500">✓</span> : <span className="text-red-400">✗</span>;
}

export default function TradingBotReviewPage({ params }: Props) {
  const platform = getTradingBotBySlug(params.slug);
  if (!platform) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "SoftwareApplication", name: platform.name, url: platform.affiliateUrl },
    reviewRating: { "@type": "Rating", ratingValue: platform.rating, bestRating: 5 },
    author: { "@type": "Organization", name: "Cryptoffiliate" },
    datePublished: platform.lastUpdated,
    reviewBody: platform.verdict,
  };

  const highlightPlan = platform.plans.find((p) => p.highlight) ?? platform.plans[1] ?? platform.plans[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-slate-400 mb-6 flex gap-1.5 flex-wrap items-center">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/trading-bots" className="hover:text-slate-600">Trading bots</Link>
          <span>/</span>
          <span className="text-slate-600">{platform.name}</span>
        </nav>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-black font-mono flex-shrink-0"
            style={{ background: platform.logoColor + "18", border: `2px solid ${platform.logoColor}40`, color: platform.logoColor }}>
            {platform.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{platform.name} review 2025</h1>
              {platform.badge && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: platform.badgeColor! + "18", color: platform.badgeColor! }}>
                  {platform.badge}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{platform.tagline}</p>
            <p className="text-xs text-slate-400 mt-1">Rating: {platform.rating}/5 · {platform.supportedExchanges} exchanges · Last updated {platform.lastUpdated}</p>
          </div>
        </div>

        <p className="text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 mb-6">
          Affiliate disclosure: we earn {platform.commissionFirst} if you subscribe via our link.
        </p>

        {/* Top CTA */}
        <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-semibold text-slate-900">
              {platform.freeTier ? `Try ${platform.name} free` : `${platform.name} from $${platform.priceFrom}/mo`}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{platform.commissionRecurring}</p>
          </div>
          <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: platform.logoColor }}>
            {platform.freeTier ? `Try ${platform.name} free →` : `Get ${platform.name} →`}
          </a>
        </div>

        {/* Verdict */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Our verdict</h2>
          <div className="card p-5">
            <p className="text-sm text-slate-700 leading-relaxed">{platform.verdict}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {platform.bestFor.map((b) => (
                <span key={b} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: platform.logoColor + "12", color: platform.logoColor }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Pricing</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {platform.plans.map((plan) => (
              <div key={plan.name}
                className={`rounded-2xl border p-4 ${plan.highlight ? "border-brand-200 bg-brand-50 ring-1 ring-brand-100" : "card"}`}>
                {plan.highlight && <p className="text-xs font-semibold text-brand-600 mb-1">Most popular</p>}
                <p className="font-bold text-slate-900">{plan.name}</p>
                <p className="text-xl font-black text-slate-900 my-1">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-sm font-normal text-slate-400">/{plan.period}</span>}
                </p>
                <p className="text-xs text-slate-500">
                  {plan.bots === "unlimited" ? "Unlimited" : plan.bots} bots ·{" "}
                  {plan.exchanges === "unlimited" ? "Unlimited" : plan.exchanges} exchanges
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key features */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Key features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Supported exchanges", value: `${platform.supportedExchanges}` },
              { label: "Free tier",            value: platform.freeTier ? "Yes ✓" : "No" },
              { label: "TradingView",          value: platform.tradingViewIntegration ? "Yes ✓" : "No" },
              { label: "Copy trading",         value: platform.copyTrading ? "Yes ✓" : "No" },
              { label: "Paper trading",        value: platform.paperTrading ? "Yes ✓" : "No" },
              { label: "Mobile app",           value: platform.mobileApp ? "Yes ✓" : "No" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-sm font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bot types */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Available bot types</h2>
          <div className="card p-4 flex flex-wrap gap-2">
            {platform.botTypes.map((b) => (
              <span key={b} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: platform.logoColor + "12", color: platform.logoColor }}>
                {b}
              </span>
            ))}
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Pros & cons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Pros</p>
              <ul className="space-y-2">
                {platform.prosText.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">Cons</p>
              <ul className="space-y-2">
                {platform.consText.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Affiliate program */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Affiliate program</h2>
          <div className="card p-5 grid sm:grid-cols-3 gap-4 mb-3">
            <div><p className="text-xs text-slate-400 mb-1">First sale</p>
              <p className="text-sm font-black text-emerald-600">{platform.commissionFirst}</p></div>
            <div><p className="text-xs text-slate-400 mb-1">Recurring</p>
              <p className="text-sm font-black text-slate-900">{platform.commissionRecurring}</p></div>
            <div><p className="text-xs text-slate-400 mb-1">Cookie</p>
              <p className="text-xl font-black text-slate-900">{platform.cookieDays} days</p></div>
          </div>
          <a href={platform.affiliateSignupUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
            Join the {platform.name} affiliate program →
          </a>
        </section>

        {/* Bottom CTA */}
        <div className="card p-6 text-center">
          <p className="font-semibold text-slate-900 mb-1">Ready to automate your trading?</p>
          <p className="text-sm text-slate-400 mb-4">
            {platform.freeTier ? "Start free — no credit card needed." : `Plans from $${platform.priceFrom}/month.`}
          </p>
          <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: platform.logoColor }}>
            {platform.freeTier ? `Try ${platform.name} free →` : `Get ${platform.name} →`}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 items-center">
          <p className="text-sm font-semibold text-slate-600">Compare:</p>
          {TRADING_BOT_PLATFORMS.filter((p) => p.id !== platform.id).map((p) => (
            <Link key={p.id} href={`/trading-bots/${p.slug}`}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              {p.name} →
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
