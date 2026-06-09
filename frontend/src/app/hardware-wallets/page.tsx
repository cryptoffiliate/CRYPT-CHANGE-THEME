import type { Metadata } from "next";
import Link from "next/link";
import { HARDWARE_WALLETS, WALLET_RECOMMENDATIONS } from "@/data/hardware-wallets";
import { BonusAlertCompact } from "@/components/BonusAlertCapture";

export const metadata: Metadata = {
  title: "Best Hardware Wallets 2025 — Ledger vs Trezor & More",
  description:
    "Independent hardware wallet reviews and comparisons. Ledger Nano X, Trezor Safe 3, Trezor Safe 5, CoolWallet Pro — prices, security details, and where to buy with affiliate discounts.",
  openGraph: {
    title: "Best Hardware Wallets 2025 — Ledger, Trezor, CoolWallet Compared",
    description: "Find the right cold storage wallet. Real prices, real specs, honest verdicts.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Hardware Wallets 2025",
  numberOfItems: HARDWARE_WALLETS.length,
  itemListElement: HARDWARE_WALLETS.map((w, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: w.name,
    url: `https://cryptoffiliate.com/hardware-wallets/${w.slug}`,
  })),
};

export default function HardwareWalletsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <p className="section-label mb-2">Updated June 2025 · Independent reviews</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Best hardware wallets in 2025
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mb-6">
              Not your keys, not your coins. Every crypto investor who holds more than they can afford to lose
              should have their assets in cold storage. We tested every major hardware wallet so you can
              make the right call — whether you're buying your first one or upgrading.
            </p>

            {/* Why hardware wallets matter */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { icon: "🔌", stat: "$3.8B", label: "lost to exchange hacks in 2024", desc: "FTX, Bybit, and dozens of smaller exchanges. Cold storage removes exchange risk entirely." },
                { icon: "🦠", stat: "33%",   label: "of crypto losses are from malware", desc: "Software wallets on infected PCs are vulnerable. Hardware wallets sign transactions offline." },
                { icon: "📱", stat: "1 device", label: "protects unlimited assets", desc: "A $79 Trezor Safe 3 can protect any amount of crypto — there's no better ROI in security." },
              ].map(({ icon, stat, label, desc }) => (
                <div key={label} className="card p-4">
                  <p className="text-2xl mb-1">{icon}</p>
                  <p className="text-xl font-black text-slate-900">{stat}</p>
                  <p className="text-xs font-semibold text-slate-600 mb-1">{label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">

              {/* Quick picks grid */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Top picks by category</h2>
                <p className="text-sm text-slate-400 mb-4">
                  Affiliate disclosure: we earn 10–15% commission through links on this page.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {WALLET_RECOMMENDATIONS.map(({ label, winner, model, reason }) => {
                    const w = HARDWARE_WALLETS.find((h) => h.id === winner)!;
                    return (
                      <Link key={label} href={`/hardware-wallets/${w.slug}`}
                        className="card p-4 hover:shadow-md transition-shadow flex gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                          style={{ background: w.logoColor + "18", border: `1.5px solid ${w.logoColor}40`, color: w.logoColor }}>
                          {w.logo}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">{label}</p>
                          <p className="text-sm font-bold text-slate-900">{w.name} {model}</p>
                          <p className="text-xs text-slate-500 truncate">{reason}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Brand deep dives */}
              {HARDWARE_WALLETS.map((wallet, i) => (
                <div key={wallet.id} className="card p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black font-mono flex-shrink-0"
                        style={{ background: wallet.logoColor === "#000000" ? "#f1f5f9" : wallet.logoColor + "18",
                                 border: `1.5px solid ${wallet.logoColor === "#000000" ? "#cbd5e1" : wallet.logoColor + "40"}`,
                                 color: wallet.logoColor === "#000000" ? "#0f172a" : wallet.logoColor }}>
                        {wallet.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-bold text-slate-900">#{i + 1} {wallet.name}</h2>
                          {wallet.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ background: wallet.badgeColor === "#000000" ? "#f1f5f9" : wallet.badgeColor! + "18",
                                       color: wallet.badgeColor === "#000000" ? "#0f172a" : wallet.badgeColor! }}>
                              {wallet.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{wallet.tagline}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">${wallet.priceFrom}–${wallet.priceTo}</p>
                      <p className="text-xs text-emerald-600 font-medium">{wallet.commissionPct}% commission</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{wallet.description}</p>

                  {/* Models table */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Models & prices</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            {["Model", "Price", "Best for", "Bluetooth", "Touchscreen", "Secure Element", "Open Source"].map(h => (
                              <th key={h} className="px-2 py-1.5 text-left font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {wallet.models.map((m) => (
                            <tr key={m.name} className={`border-b border-slate-100 ${m.highlight ? "bg-brand-50/30" : ""}`}>
                              <td className="px-2 py-2 font-medium text-slate-900 whitespace-nowrap">
                                {m.name} {m.highlight && <span className="text-brand-500 font-semibold">★</span>}
                              </td>
                              <td className="px-2 py-2 font-bold text-slate-900">${m.price}</td>
                              <td className="px-2 py-2 text-slate-500">{m.bestFor}</td>
                              <td className="px-2 py-2 text-center">{m.bluetooth ? "✓" : "—"}</td>
                              <td className="px-2 py-2 text-center">{m.touchscreen ? "✓" : "—"}</td>
                              <td className="px-2 py-2 text-center">{m.secureElement ? <span className="text-emerald-500">✓</span> : <span className="text-red-400">✗</span>}</td>
                              <td className="px-2 py-2 text-center">{m.openSource ? <span className="text-emerald-500">✓</span> : <span className="text-red-400">✗</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">★ = recommended model</p>
                  </div>

                  {/* Security approach */}
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Security approach</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{wallet.securityApproach}</p>
                  </div>

                  <div className="flex gap-2">
                    <a href={wallet.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center hover:opacity-90 transition-opacity"
                      style={{
                        background: wallet.logoColor === "#000000" ? "#0f172a" : wallet.logoColor,
                        color: "white"
                      }}>
                      Shop {wallet.name} →
                    </a>
                    <Link href={`/hardware-wallets/${wallet.slug}`}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                      Full review
                    </Link>
                  </div>
                </div>
              ))}

              {/* Ledger vs Trezor CTA */}
              <div className="card p-5 bg-white text-center">
                <p className="font-bold text-slate-900 mb-1">Can't decide between Ledger and Trezor?</p>
                <p className="text-sm text-slate-500 mb-4">We wrote a detailed head-to-head comparison covering every spec, security model, and use case.</p>
                <Link href="/hardware-wallets/ledger-vs-trezor" className="btn-primary text-sm">
                  Read: Ledger vs Trezor 2025 →
                </Link>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick decision */}
              <div className="card p-5">
                <p className="section-label mb-3">Quick decision guide</p>
                <div className="space-y-3 text-sm">
                  {[
                    { q: "Just starting out",          a: "Trezor Model One — $59, proven, simple" },
                    { q: "Want mobile app",            a: "Ledger Nano X — Bluetooth + app" },
                    { q: "Privacy / open source",      a: "Trezor Safe 3 — open code + SE chip" },
                    { q: "Best value overall",         a: "Trezor Safe 3 — $79, SE, open source" },
                    { q: "Premium daily driver",       a: "Ledger Flex — touchscreen, Bluetooth" },
                    { q: "Travels a lot",              a: "CoolWallet Pro — credit card size" },
                  ].map(({ q, a }) => (
                    <div key={q} className="flex flex-col gap-0.5">
                      <span className="text-xs text-slate-400">{q}</span>
                      <span className="text-xs font-semibold text-slate-900">→ {a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="card p-5">
                <p className="section-label mb-3">Cold storage facts</p>
                <div className="space-y-3">
                  {[
                    { stat: "6M+",    label: "Ledger devices sold" },
                    { stat: "$59",    label: "Cheapest secure wallet (Trezor One)" },
                    { stat: "0",      label: "Ledger/Trezor hacks to date" },
                    { stat: "15,000+",label: "Coins supported (Ledger)" },
                    { stat: "12 yrs", label: "Trezor's proven track record" },
                  ].map(({ stat, label }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-900">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affiliate commissions */}
              <div className="card p-5">
                <p className="section-label mb-3">Affiliate commissions</p>
                <div className="space-y-2.5">
                  {HARDWARE_WALLETS.map((w) => (
                    <div key={w.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black font-mono"
                          style={{ background: w.logoColor === "#000000" ? "#f1f5f9" : w.logoColor + "18",
                                   color: w.logoColor === "#000000" ? "#0f172a" : w.logoColor }}>
                          {w.logo}
                        </div>
                        <span className="font-medium text-slate-700">{w.name}</span>
                      </div>
                      <span className="font-bold text-emerald-600">{w.commissionPct}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  On a $149 Nano X sale, you earn $14.90. On 10 sales/month that's $149 in passive income.
                </p>
              </div>

              {/* Email signup */}
              <BonusAlertCompact />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
