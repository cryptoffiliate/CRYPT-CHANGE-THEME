import type { Metadata } from "next";
import Link from "next/link";
import { TRADING_BOT_PLATFORMS } from "@/data/trading-bots";

export const metadata: Metadata = {
  title: "Best Crypto Trading Bots 2025 — WunderTrading vs 3Commas vs TradingView",
  description:
    "Compare the best crypto trading bot platforms: WunderTrading, 3Commas, TradingView, and Pionex. Automate your trading strategy and earn passive income. Independent reviews.",
};

export default function TradingBotsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p className="section-label mb-2">Updated June 2025</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Best crypto trading bots 2025
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Trading bots execute your strategy 24/7 without emotion or fatigue. Whether you want
            to automate DCA, run a grid strategy, or turn your TradingView signals into live
            trades — there's a bot for that. We reviewed every major platform on features,
            pricing, and affiliate commissions.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* Comparison table */}
        <div className="card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">From</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Exchanges</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">TV Integration</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Commission</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Try it</th>
                </tr>
              </thead>
              <tbody>
                {TRADING_BOT_PLATFORMS.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                          style={{ background: p.logoColor + "18", border: `1.5px solid ${p.logoColor}40`, color: p.logoColor }}>
                          {p.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                            {p.badge && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold hidden sm:inline"
                                style={{ background: p.badgeColor! + "18", color: p.badgeColor! }}>
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{p.cookieDays}d cookie</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-sm font-bold text-slate-900">{p.freeTier ? "Free" : `$${p.priceFrom}`}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-sm font-semibold text-slate-900">{p.supportedExchanges}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {p.tradingViewIntegration
                        ? <span className="text-emerald-500 text-base">✓</span>
                        : <span className="text-red-400 text-sm">✗</span>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-xs font-semibold text-emerald-600">{p.commissionFirst}</p>
                      <p className="text-xs text-slate-400 truncate max-w-24">{p.commissionRecurring}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border-[1.5px] transition-all"
                        style={{ color: p.logoColor, borderColor: p.logoColor + "50", background: p.logoColor + "10" }}>
                        Try →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform cards */}
        {TRADING_BOT_PLATFORMS.map((p, i) => (
          <div key={p.id} className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                  style={{ background: p.logoColor + "18", border: `1.5px solid ${p.logoColor}40`, color: p.logoColor }}>
                  {p.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-slate-900">#{i + 1} {p.name}</h2>
                    {p.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: p.badgeColor! + "18", color: p.badgeColor! }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{p.tagline}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-900">{p.freeTier ? "Free tier" : `$${p.priceFrom}/mo`}</p>
                <p className="text-xs text-emerald-600 font-medium">{p.commissionFirst}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-3">{p.description}</p>

            {/* Bot types */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.botTypes.slice(0, 4).map((b) => (
                <span key={b} className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: p.logoColor + "10", color: p.logoColor }}>
                  {b}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white text-center hover:opacity-90 transition-opacity"
                style={{ background: p.logoColor }}>
                Try {p.name} {p.freeTier ? "free" : "now"} →
              </a>
              <Link href={`/trading-bots/${p.slug}`}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Full review
              </Link>
            </div>
          </div>
        ))}

        <p className="text-xs text-slate-400 leading-relaxed">
          Trading bots do not guarantee profits. Crypto markets are volatile.
          Affiliate disclosure: we earn commissions through links on this page.
        </p>
      </div>
    </div>
  );
}
