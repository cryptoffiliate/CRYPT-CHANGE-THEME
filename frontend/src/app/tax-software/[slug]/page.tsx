import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TAX_SOFTWARE, getTaxSoftwareBySlug } from "@/data/tax-software";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return TAX_SOFTWARE.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTaxSoftwareBySlug(params.slug);
  if (!t) return {};
  return {
    title: `${t.name} Review 2025 — Pricing, Features & Our Verdict`,
    description: `Is ${t.name} worth it? Our in-depth review covers pricing (from $${t.pricingStart}/yr), supported exchanges (${t.exchanges}+), features, and who it's actually best for.`,
    openGraph: { title: `${t.name} Review 2025`, description: t.tagline },
  };
}

function StarBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${(score / 5) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold text-slate-900 w-8 text-right">{score}/5</span>
      </div>
    </div>
  );
}

export default function TaxSoftwareReviewPage({ params }: Props) {
  const platform = getTaxSoftwareBySlug(params.slug);
  if (!platform) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: platform.name,
      applicationCategory: "FinanceApplication",
      url: platform.affiliateUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: platform.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: { "@type": "Organization", name: "Cryptoffiliate" },
    publisher: { "@type": "Organization", name: "Cryptoffiliate" },
    datePublished: platform.lastUpdated,
    dateModified: platform.lastUpdated,
    reviewBody: platform.verdict,
  };

  // Derived sub-scores
  const subScores = [
    { label: "Ease of use",         score: platform.id === "coinledger" ? 4.9 : platform.id === "taxbit" ? 3.5 : 4.3 },
    { label: "Exchange coverage",   score: platform.exchanges >= 800 ? 5.0 : platform.exchanges >= 400 ? 4.2 : 3.8 },
    { label: "Accuracy",            score: platform.id === "taxbit" ? 5.0 : platform.id === "coinledger" ? 4.8 : 4.4 },
    { label: "Value for money",     score: platform.pricingStart <= 49 ? 4.5 : 3.8 },
    { label: "Customer support",    score: platform.taxProfessionalHelp ? 4.6 : 3.9 },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex gap-1.5 items-center flex-wrap">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/tax-software" className="hover:text-slate-600">Tax software</Link>
          <span>/</span>
          <span className="text-slate-600">{platform.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-black font-mono flex-shrink-0"
            style={{ background: platform.logoColor + "18", border: `2px solid ${platform.logoColor}40`, color: platform.logoColor }}
          >
            {platform.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{platform.name} review</h1>
              {platform.badge && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: platform.badgeColor! + "18", color: platform.badgeColor! }}>
                  {platform.badge}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{platform.tagline}</p>
            <p className="text-xs text-slate-400 mt-1">Last updated: {platform.lastUpdated} · {platform.exchanges}+ integrations · {platform.countries} countries</p>
          </div>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 mb-6">
          Affiliate disclosure: we earn {platform.commissionPct}% commission if you purchase via our links, at no cost to you.
        </p>

        {/* Top CTA */}
        <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-semibold text-slate-900">Our verdict: {platform.name} scores <span className="text-brand-500">{platform.rating}/5</span></p>
            <p className="text-sm text-slate-500 mt-0.5">{platform.verdict.slice(0, 80)}...</p>
            {platform.freeTier && <p className="text-xs text-emerald-600 font-medium mt-1">✓ Free tier available — no credit card needed</p>}
          </div>
          <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: platform.logoColor }}>
            Try {platform.name} free →
          </a>
        </div>

        {/* Score breakdown */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Score breakdown</h2>
          <div className="card px-5 py-3">
            {subScores.map((s) => <StarBar key={s.label} label={s.label} score={s.score} />)}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Pricing</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {platform.plans.map((plan) => (
              <div key={plan.name}
                className={`rounded-xl p-4 border ${plan.highlight ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200" : "card"}`}>
                {plan.highlight && <p className="text-xs font-semibold text-brand-600 mb-1">Most popular</p>}
                <p className="font-bold text-slate-900">{plan.name}</p>
                <p className="text-2xl font-black text-slate-900 my-1">${plan.price}<span className="text-sm font-normal text-slate-400">/yr</span></p>
                <p className="text-xs text-slate-500">
                  {plan.transactions === 999999 ? "Unlimited" : plan.transactions.toLocaleString()} transactions
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key stats */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Key features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Exchanges supported", value: `${platform.exchanges}+` },
              { label: "Countries",           value: platform.countries === 1 ? "US only" : `${platform.countries}+` },
              { label: "Free tier",           value: platform.freeTier ? "Yes ✓" : "No" },
              { label: "DeFi support",        value: platform.defiSupport ? "Yes ✓" : "No" },
              { label: "NFT support",         value: platform.nftSupport ? "Yes ✓" : "No" },
              { label: "TurboTax export",     value: platform.turbotaxIntegration ? "Yes ✓" : "No" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-base font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tax forms */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Tax forms generated</h2>
          <div className="card p-4 flex flex-wrap gap-2">
            {platform.forms.map((f) => (
              <span key={f} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: platform.logoColor + "12", color: platform.logoColor }}>
                {f}
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
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">Cons</p>
              <ul className="space-y-2">
                {platform.consText.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-400 font-bold mt-0.5">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Affiliate program details — useful for your audience of crypto affiliates */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Affiliate program details</h2>
          <div className="card p-5 grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">First sale commission</p>
              <p className="text-xl font-black text-emerald-600">{platform.commissionPct}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Recurring commission</p>
              <p className="text-xl font-black text-slate-900">
                {platform.recurringPct > 0 ? `${platform.recurringPct}%` : "One-time"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Cookie duration</p>
              <p className="text-xl font-black text-slate-900">
                {platform.cookieDays === "lifetime" ? "Lifetime" : `${platform.cookieDays} days`}
              </p>
            </div>
          </div>
          <a href={platform.affiliateSignupUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
            Join the {platform.name} affiliate program →
          </a>
        </section>

        {/* Bottom CTA */}
        <div className="card p-6 text-center">
          <p className="font-semibold text-slate-900 mb-1">Ready to sort out your crypto taxes?</p>
          <p className="text-sm text-slate-400 mb-4">
            {platform.freeTier ? "Start for free — no credit card required." : `Plans start from $${platform.pricingStart}/year.`}
          </p>
          <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: platform.logoColor }}>
            Try {platform.name} {platform.freeTier ? "for free" : "now"} →
          </a>
          <p className="text-xs text-slate-400 mt-2">Affiliate link · {platform.commissionPct}% commission earned</p>
        </div>

        {/* Compare others */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-600 mb-3">Compare other platforms</p>
          <div className="flex flex-wrap gap-2">
            {TAX_SOFTWARE.filter((t) => t.id !== platform.id).map((t) => (
              <Link key={t.id} href={`/tax-software/${t.slug}`}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                {t.name} review →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
