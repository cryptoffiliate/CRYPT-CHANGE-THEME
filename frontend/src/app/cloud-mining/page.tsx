import type { Metadata } from "next";
import Link from "next/link";
import { CLOUD_MINING_PLATFORMS } from "@/data/cloud-mining";

export const metadata: Metadata = {
  title: "Best Cloud Mining Platforms 2025 — NiceHash, ECOS, BitFuFu Compared",
  description:
    "Compare the best cloud mining platforms: NiceHash, ECOS, and BitFuFu. Earn passive Bitcoin income without buying hardware. Independent reviews, real commissions.",
};

export default function CloudMiningPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p className="section-label mb-2">Updated June 2025 · Risk disclosure included</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Best cloud mining platforms 2025
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mb-4">
            Cloud mining lets you earn Bitcoin without buying hardware, dealing with electricity
            costs, or managing physical equipment. You rent hashrate from professional data centers
            and receive daily payouts. We reviewed the most credible platforms available in 2025.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 max-w-2xl">
            ⚠️ <strong>Risk disclosure:</strong> Cloud mining returns are NOT guaranteed.
            They depend on Bitcoin price and mining difficulty — both of which change daily.
            Only invest what you can afford to lose. We disclose affiliate commissions on all links.
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {CLOUD_MINING_PLATFORMS.map((platform, i) => (
          <div key={platform.id} className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                  style={{ background: platform.logoColor + "18", border: `1.5px solid ${platform.logoColor}40`, color: platform.logoColor }}>
                  {platform.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-slate-900">#{i + 1} {platform.name}</h2>
                    {platform.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: platform.badgeColor! + "18", color: platform.badgeColor! }}>
                        {platform.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{platform.tagline}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-900">From ${platform.minInvestment}</p>
                <p className="text-xs text-emerald-600 font-medium">{platform.commissionPct}% commission</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">{platform.description}</p>

            {/* Plans */}
            <div className="grid sm:grid-cols-3 gap-2 mb-4">
              {platform.plans.map((plan) => (
                <div key={plan.name}
                  className={`rounded-xl p-3 border text-center ${plan.highlight ? "border-brand-200 bg-brand-50" : "border-slate-100 bg-slate-50"}`}>
                  <p className="text-xs font-semibold text-slate-500">{plan.name}</p>
                  <p className="text-base font-black text-slate-900">${plan.price}</p>
                  <p className="text-xs text-slate-400">{plan.hashrate} · {plan.duration}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">{plan.dailyReturn}/day</p>
                </div>
              ))}
            </div>

            {/* Risk note */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4 text-xs text-amber-800">
              ⚠️ {platform.riskNote}
            </div>

            <div className="flex gap-2">
              <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white text-center hover:opacity-90 transition-opacity"
                style={{ background: platform.logoColor }}>
                Try {platform.name} →
              </a>
              <Link href={`/cloud-mining/${platform.slug}`}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Full review
              </Link>
            </div>
          </div>
        ))}

        <p className="text-xs text-slate-400 leading-relaxed">
          Affiliate disclosure: we earn commissions through links on this page.
          Cloud mining is speculative — returns are not guaranteed. Always do your own research.
        </p>
      </div>
    </div>
  );
}
