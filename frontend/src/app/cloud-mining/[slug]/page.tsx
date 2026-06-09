import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CLOUD_MINING_PLATFORMS, getCloudMiningBySlug } from "@/data/cloud-mining";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return CLOUD_MINING_PLATFORMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getCloudMiningBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} Review 2025 — Cloud Mining, Payouts & Is It Worth It?`,
    description: `${p.name} cloud mining review: contracts from $${p.minInvestment}, ${p.commissionPct}% affiliate commission, ${p.payoutFrequency.toLowerCase()} payouts. Honest verdict with risk disclosure.`,
  };
}

export default function CloudMiningReviewPage({ params }: Props) {
  const platform = getCloudMiningBySlug(params.slug);
  if (!platform) notFound();

  const riskColors = { low: "emerald", medium: "amber", high: "red" }[platform.riskLevel];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-xs text-slate-400 mb-6 flex gap-1.5 flex-wrap items-center">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <Link href="/cloud-mining" className="hover:text-slate-600">Cloud mining</Link>
        <span>/</span>
        <span className="text-slate-600">{platform.name}</span>
      </nav>

      {/* Header */}
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
          <p className="text-xs text-slate-400 mt-1">
            Founded {platform.founded} · {platform.jurisdiction} · Rating: {platform.rating}/5
          </p>
        </div>
      </div>

      {/* Risk disclosure first */}
      <div className={`bg-${riskColors}-50 border border-${riskColors}-200 rounded-xl p-4 mb-6`}>
        <p className={`text-xs font-bold text-${riskColors}-800 uppercase tracking-wider mb-1`}>
          ⚠️ Risk disclosure — {platform.riskLevel} risk
        </p>
        <p className={`text-xs text-${riskColors}-700 leading-relaxed`}>{platform.riskNote}</p>
      </div>

      {/* Affiliate disclosure */}
      <p className="text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 mb-6">
        Affiliate disclosure: we earn {platform.commissionPct}% commission on {platform.name} purchases through our links.
      </p>

      {/* Top CTA */}
      <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-semibold text-slate-900">{platform.name} — from ${platform.minInvestment}</p>
          <p className="text-sm text-slate-500 mt-0.5">{platform.payoutFrequency} payouts · {platform.jurisdiction}</p>
          {platform.freeTrial && <p className="text-xs text-emerald-600 font-medium mt-1">✓ Free trial available</p>}
          {platform.backedBy && <p className="text-xs text-slate-400 mt-1">Backed by: {platform.backedBy}</p>}
        </div>
        <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
          className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
          style={{ background: platform.logoColor }}>
          Start mining on {platform.name} →
        </a>
      </div>

      {/* Plans */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Contract plans</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {platform.plans.map((plan) => (
            <div key={plan.name}
              className={`rounded-2xl border p-4 text-center ${plan.highlight ? "border-brand-200 bg-brand-50 ring-1 ring-brand-100" : "card"}`}>
              {plan.highlight && <p className="text-xs font-semibold text-brand-600 mb-1">Most popular</p>}
              <p className="font-bold text-slate-900">{plan.name}</p>
              <p className="text-2xl font-black text-slate-900 my-1">${plan.price}</p>
              <p className="text-xs text-slate-500">{plan.hashrate}</p>
              <p className="text-xs text-slate-400">{plan.duration}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">{plan.dailyReturn}/day est.</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Daily return estimates based on current BTC price and difficulty. These are estimates, not guarantees.</p>
      </section>

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
          <div><p className="text-xs text-slate-400 mb-1">Commission</p>
            <p className="text-xl font-black text-emerald-600">{platform.commissionPct}%</p></div>
          <div><p className="text-xs text-slate-400 mb-1">Cookie</p>
            <p className="text-xl font-black text-slate-900">{platform.cookieDays} days</p></div>
          <div><p className="text-xs text-slate-400 mb-1">Payout</p>
            <p className="text-base font-bold text-slate-900">{platform.payoutMethod}</p></div>
        </div>
        <p className="text-xs text-slate-500 px-1 mb-2">{platform.commissionNote}</p>
        <a href={platform.affiliateSignupUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
          Join {platform.name} affiliate program →
        </a>
      </section>

      {/* Bottom CTA */}
      <div className="card p-6 text-center">
        <p className="font-semibold text-slate-900 mb-1">Start mining on {platform.name}</p>
        <p className="text-sm text-slate-400 mb-4">
          {platform.freeTrial ? "Free trial available." : `Contracts from $${platform.minInvestment}.`}
          {" "}Returns vary — read the risk disclosure above.
        </p>
        <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
          style={{ background: platform.logoColor }}>
          Get started on {platform.name} →
        </a>
      </div>

      {/* Compare others */}
      <div className="mt-8 flex flex-wrap gap-2 items-center">
        <p className="text-sm font-semibold text-slate-600">Compare:</p>
        {CLOUD_MINING_PLATFORMS.filter((p) => p.id !== platform.id).map((p) => (
          <Link key={p.id} href={`/cloud-mining/${p.slug}`}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            {p.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}
