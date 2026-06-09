import type { Metadata } from "next";
import Link from "next/link";
import { TAX_SOFTWARE, getSortedByRating } from "@/data/tax-software";
import { TaxComparisonTable } from "@/components/TaxComparisonTable";
import { BonusAlertCompact } from "@/components/BonusAlertCapture";

export const metadata: Metadata = {
  title: "Best Crypto Tax Software 2025 — Comparison & Reviews",
  description:
    "Compare the best crypto tax software side-by-side: Koinly, CoinLedger, ZenLedger, CoinTracker, and TaxBit. See pricing, features, supported exchanges, and exclusive discounts.",
  openGraph: {
    title: "Best Crypto Tax Software 2025 — Independent Comparison",
    description:
      "Find the right crypto tax tool for your situation. Pricing, features, and honest reviews of every major platform.",
  },
};

// JSON-LD for SEO — ItemList schema for the comparison page
const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Crypto Tax Software 2025",
  description: "Independent comparison of the top crypto tax platforms",
  numberOfItems: TAX_SOFTWARE.length,
  itemListElement: TAX_SOFTWARE.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    description: t.tagline,
    url: `https://cryptoffiliate.com/tax-software/${t.slug}`,
  })),
};

export default function TaxSoftwarePage() {
  const sorted = getSortedByRating();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="brutalist-page min-h-screen bg-slate-50">
        {/* Hero */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <p className="section-label mb-2">Updated June 2025 · Independent review</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Best crypto tax software in 2025
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mb-6">
              The IRS now treats every crypto trade as a taxable event — and with Form 1099-DA
              rolling out in 2026, reporting has never been more scrutinized. We tested every
              major platform so you don't have to.
            </p>

            {/* Quick winner cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Best overall",     name: "Koinly",      color: "#4CAF50", slug: "koinly" },
                { label: "Best for US",      name: "CoinLedger",  color: "#2563EB", slug: "coinledger" },
                { label: "Best tracker",     name: "CoinTracker", color: "#0891B2", slug: "cointracker" },
                { label: "Best enterprise",  name: "TaxBit",      color: "#DC2626", slug: "taxbit" },
              ].map(({ label, name, color, slug }) => (
                <Link
                  key={slug}
                  href={`/tax-software/${slug}`}
                  className="card p-3 hover:shadow-md transition-shadow"
                >
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <p className="text-sm font-bold" style={{ color }}>{name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Comparison table */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
                  Side-by-side comparison
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  Click any row to expand. Affiliate disclosure: we earn commissions through links.
                </p>
                <TaxComparisonTable platforms={sorted} />
              </section>

              {/* In-depth summaries */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-5">
                  Platform breakdowns
                </h2>
                <div className="space-y-4">
                  {sorted.map((platform) => (
                    <div key={platform.id} className="card p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                            style={{
                              background: platform.logoColor + "18",
                              border: `1.5px solid ${platform.logoColor}40`,
                              color: platform.logoColor,
                            }}
                          >
                            {platform.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-sm">{platform.name}</h3>
                              {platform.badge && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                  style={{ background: platform.badgeColor! + "18", color: platform.badgeColor! }}
                                >
                                  {platform.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{platform.tagline}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            from ${platform.pricingStart}/yr
                          </p>
                          <p className="text-xs text-emerald-600 font-medium">
                            {platform.commissionPct}% commission
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        {platform.verdict}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {platform.bestFor.map((b) => (
                          <span
                            key={b}
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ background: platform.logoColor + "12", color: platform.logoColor }}
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={platform.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-white text-center hover:opacity-90 transition-opacity"
                          style={{ background: platform.logoColor }}
                        >
                          Try {platform.name} →
                        </a>
                        <Link
                          href={`/tax-software/${platform.slug}`}
                          className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          Full review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Buying guide */}
              <section className="prose-sm max-w-none">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">
                  How to choose the right platform
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      q: "Are you primarily in the US?",
                      a: "CoinLedger is built specifically for US tax law, integrates directly with TurboTax and H&R Block, and pays 25% recurring commissions. Koinly is the better choice if you're outside the US — it supports 20+ countries.",
                    },
                    {
                      q: "How many transactions do you have?",
                      a: "Under 100 transactions/year: any platform's starter plan works. 100–5,000: go with Koinly's Hodler or CoinLedger's Plus plan. 5,000+: ZenLedger Executive or CoinLedger Pro handles the volume.",
                    },
                    {
                      q: "Do you use DeFi or NFTs?",
                      a: "CoinLedger leads on DeFi and NFT reconciliation. CoinTracker is strong for per-wallet cost basis tracking (new IRS requirement in 2025). Avoid TaxBit if DeFi depth is your priority.",
                    },
                    {
                      q: "Do you need access to a tax professional?",
                      a: "CoinLedger and ZenLedger both offer expert review services — a CPA will review your return. ZenLedger also offers an unusual referral program where you can earn 5% on every client a referred CPA brings in.",
                    },
                    {
                      q: "Are you filing for an institution or business?",
                      a: "TaxBit is the only platform generating the new IRS Form 1099-DA (required for digital asset brokers in 2026). It's trusted by PayPal, Google, and the IRS itself.",
                    },
                  ].map(({ q, a }) => (
                    <div key={q} className="card p-4">
                      <p className="text-sm font-semibold text-slate-900 mb-1">💬 {q}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick picks */}
              <div className="card p-5">
                <p className="section-label mb-3">Quick picks</p>
                <div className="space-y-3">
                  {[
                    { label: "Simplest to use",       name: "CoinLedger", slug: "coinledger", color: "#2563EB" },
                    { label: "Most integrations",      name: "Koinly",     slug: "koinly",     color: "#4CAF50" },
                    { label: "Best recurring commis.", name: "CoinLedger", slug: "coinledger", color: "#2563EB" },
                    { label: "DeFi power users",       name: "CoinTracker",slug: "cointracker",color: "#0891B2" },
                    { label: "Enterprise / IRS",       name: "TaxBit",     slug: "taxbit",     color: "#DC2626" },
                  ].map(({ label, name, slug, color }) => (
                    <Link
                      key={label}
                      href={`/tax-software/${slug}`}
                      className="flex items-center justify-between group"
                    >
                      <span className="text-xs text-slate-500">{label}</span>
                      <span
                        className="text-xs font-semibold group-hover:underline"
                        style={{ color }}
                      >
                        {name} →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tax calendar */}
              <div className="card p-5">
                <p className="section-label mb-3">US tax calendar</p>
                <div className="space-y-2">
                  {[
                    { date: "Jan 31", event: "Exchanges send 1099s" },
                    { date: "Apr 15", event: "US tax filing deadline" },
                    { date: "Oct 15", event: "Extension deadline" },
                    { date: "Dec 31", event: "Tax-loss harvesting window closes" },
                  ].map(({ date, event }) => (
                    <div key={date} className="flex items-center gap-3 text-sm">
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex-shrink-0">
                        {date}
                      </span>
                      <span className="text-slate-600">{event}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Not tax advice. Consult a CPA for your situation.
                </p>
              </div>

              {/* Email signup */}
              <BonusAlertCompact />

              {/* Affiliate disclosure */}
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                <p className="text-xs text-brand-700 leading-relaxed">
                  <strong>Affiliate disclosure:</strong> Cryptoffiliate earns commissions
                  when you purchase via our links, at no extra cost to you. Commission rates
                  range from 15–25%. This never affects our ratings or recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
