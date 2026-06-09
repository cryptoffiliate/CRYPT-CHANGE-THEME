import type { Metadata } from "next";
import Link from "next/link";
import { VPN_TOOLS } from "@/data/security-tools";

export const metadata: Metadata = {
  title: "Best VPN for Crypto 2025 — NordVPN vs ProtonVPN vs ExpressVPN",
  description:
    "The best VPN for crypto investors in 2025. We compared NordVPN, ExpressVPN, Proton VPN, and Surfshark on privacy credentials, crypto payment support, jurisdiction, and affiliate commissions.",
};

export default function VPNComparisonPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <nav className="text-xs text-slate-400 mb-4 flex gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <span>/</span>
            <Link href="/security" className="hover:text-slate-600">Security</Link>
            <span>/</span>
            <span className="text-slate-600">VPNs</span>
          </nav>
          <p className="section-label mb-2">Updated June 2025</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Best VPN for crypto investors 2025
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Using a VPN while trading crypto isn't paranoia — it's operational security.
            Blockchain analytics firms correlate IP addresses with on-chain activity.
            Your exchange knows your IP. Your ISP can see which sites you visit.
            Here's how to fix that.
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
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">VPN</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Price/mo</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Jurisdiction</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Crypto pay</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Affiliate</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Get it</th>
                </tr>
              </thead>
              <tbody>
                {VPN_TOOLS.map((tool) => (
                  <tr key={tool.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                          style={{ background: tool.logoColor + "18", border: `1.5px solid ${tool.logoColor}40`, color: tool.logoColor }}>
                          {tool.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-slate-900">{tool.name}</span>
                            {tool.badge && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold hidden sm:inline"
                                style={{ background: tool.badgeColor! + "18", color: tool.badgeColor! }}>
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{tool.specs["No-logs audit"]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-sm font-bold text-slate-900">${tool.pricingStart}</p>
                      <p className="text-xs text-slate-400">/{tool.pricingPeriod}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-xs font-medium text-slate-700">{tool.specs["Jurisdiction"]}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-emerald-500 text-sm">✓</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-xs font-semibold text-emerald-600">{tool.commissionFirst}</p>
                      {tool.commissionRecurring !== "None — one-time CPA" && (
                        <p className="text-xs text-slate-400">{tool.commissionRecurring}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border-[1.5px] transition-all"
                        style={{ color: tool.logoColor, borderColor: tool.logoColor + "50", background: tool.logoColor + "10" }}>
                        Get →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
            All VPNs support crypto payments · Affiliate disclosure: we earn commissions through links
          </div>
        </div>

        {/* Individual VPN deep dives */}
        {VPN_TOOLS.map((tool, i) => (
          <div key={tool.id} className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                  style={{ background: tool.logoColor + "18", border: `1.5px solid ${tool.logoColor}40`, color: tool.logoColor }}>
                  {tool.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-900">#{i + 1} {tool.name}</h2>
                    {tool.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: tool.badgeColor! + "18", color: tool.badgeColor! }}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{tool.tagline}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-900">${tool.pricingStart}/{tool.pricingPeriod}</p>
                <p className="text-xs text-slate-400">{tool.pricingNote}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-3">{tool.description}</p>

            {/* Why crypto users care */}
            <div className="bg-slate-50 rounded-xl p-3 mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Why crypto investors use it</p>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {tool.cryptoRelevance.map((r) => (
                  <p key={r} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <span className="text-emerald-500 flex-shrink-0 mt-0.5 font-bold">✓</span>{r}
                  </p>
                ))}
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {Object.entries(tool.specs).slice(0, 4).map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{v}</p>
                  <p className="text-xs text-slate-400">{k}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-emerald-600">{tool.commissionFirst}</span>
                {tool.commissionRecurring !== "None — one-time CPA" && (
                  <span className="text-slate-400"> · {tool.commissionRecurring}</span>
                )}
              </div>
              <div className="flex gap-2">
                <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                  className="text-xs font-bold px-4 py-2 rounded-xl text-white hover:opacity-90 transition-opacity"
                  style={{ background: tool.logoColor }}>
                  Get {tool.name} →
                </a>
                <Link href={`/security/${tool.slug}`}
                  className="text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  Full review
                </Link>
              </div>
            </div>
          </div>
        ))}

        <p className="text-xs text-slate-400 leading-relaxed">
          Not financial or legal advice. VPN performance and features may vary by region.
          Affiliate disclosure: we earn commissions through links on this page, at no cost to you.
        </p>
      </div>
    </div>
  );
}
