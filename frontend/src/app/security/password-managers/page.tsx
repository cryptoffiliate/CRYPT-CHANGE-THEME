import type { Metadata } from "next";
import Link from "next/link";
import { PASSWORD_TOOLS } from "@/data/security-tools";

export const metadata: Metadata = {
  title: "Best Password Manager for Crypto 2025 — Bitwarden vs 1Password",
  description:
    "The best password manager for crypto investors in 2025. Store seed phrases, secure exchange accounts, and protect your entire crypto setup. Bitwarden vs 1Password compared.",
};

export default function PasswordManagersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <nav className="text-xs text-slate-400 mb-4 flex gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <span>/</span>
            <Link href="/security" className="hover:text-slate-600">Security</Link>
            <span>/</span>
            <span className="text-slate-600">Password managers</span>
          </nav>
          <p className="section-label mb-2">Updated June 2025</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Best password manager for crypto investors 2025
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            A compromised exchange password can cost you everything. A password manager generates
            unique, unguessable passwords for every account — and many can securely store your
            seed phrases and private keys with AES-256 encryption.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* Why it matters */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-red-800 mb-1">⚠️ The risk most crypto investors ignore</p>
          <p className="text-red-700 leading-relaxed">
            82% of data breaches involve weak or reused passwords (Verizon DBIR 2024). If you use the
            same password on your email, Coinbase, and Binance accounts — a single breach on any
            service exposes all three. Password managers solve this completely.
          </p>
        </div>

        {/* Comparison table */}
        <div className="card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Manager</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Price/yr</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Free tier</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Open source</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Commission</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Get it</th>
                </tr>
              </thead>
              <tbody>
                {PASSWORD_TOOLS.map((tool) => (
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
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                                style={{ background: tool.badgeColor! + "18", color: tool.badgeColor! }}>
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{tool.cookieDays}-day cookie</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-sm font-bold text-slate-900">
                        {tool.id === "bitwarden" ? "$10" : "$36"}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {tool.freeTier
                        ? <span className="text-emerald-500 text-base">✓</span>
                        : <span className="text-slate-400 text-sm">14d trial</span>
                      }
                    </td>
                    <td className="px-3 py-3 text-center">
                      {tool.id === "bitwarden"
                        ? <span className="text-emerald-500 text-base">✓</span>
                        : <span className="text-red-400 text-sm">✗</span>
                      }
                    </td>
                    <td className="px-3 py-3 text-center">
                      <p className="text-xs font-semibold text-emerald-600">{tool.commissionFirst}</p>
                      <p className="text-xs text-slate-400">{tool.commissionRecurring}</p>
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
        </div>

        {/* Deep dives */}
        {PASSWORD_TOOLS.map((tool, i) => (
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
                {tool.freeTier
                  ? <p className="text-sm font-bold text-emerald-600">Free</p>
                  : <p className="text-sm font-bold text-slate-900">14-day trial</p>
                }
                <p className="text-xs text-slate-400">{tool.pricingNote}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-3">{tool.description}</p>

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

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-semibold text-emerald-600">{tool.commissionFirst}</span>
                <span className="text-slate-400"> · {tool.commissionRecurring} · {tool.cookieDays}d cookie</span>
              </div>
              <div className="flex gap-2">
                <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                  className="text-xs font-bold px-4 py-2 rounded-xl text-white hover:opacity-90 transition-opacity"
                  style={{ background: tool.logoColor }}>
                  {tool.freeTier ? `Try ${tool.name} free →` : `Get ${tool.name} →`}
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
          Affiliate disclosure: we earn commissions through links on this page.
          Not financial or security advice — consult a professional for your specific situation.
        </p>
      </div>
    </div>
  );
}
