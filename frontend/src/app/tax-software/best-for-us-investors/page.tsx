import type { Metadata } from "next";
import Link from "next/link";
import { TAX_SOFTWARE } from "@/data/tax-software";

export const metadata: Metadata = {
  title: "Best Crypto Tax Software for US Investors 2025",
  description:
    "The IRS requires reporting every crypto trade. These are the best platforms for US investors: CoinLedger, Koinly, ZenLedger, and TaxBit — compared on price, features, and TurboTax compatibility.",
};

const US_PLATFORMS = TAX_SOFTWARE.filter((t) =>
  ["coinledger", "zenledger", "taxbit", "koinly"].includes(t.id)
);

export default function BestCryptoTaxSoftwareUSPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-xs text-slate-400 mb-6 flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-slate-600">Home</Link>
        <span>/</span>
        <Link href="/tax-software" className="hover:text-slate-600">Tax software</Link>
        <span>/</span>
        <span className="text-slate-600">Best for US investors</span>
      </nav>

      <p className="section-label mb-2">Updated June 2025</p>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
        Best crypto tax software for US investors in 2025
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        The IRS treats every crypto trade, swap, and NFT sale as a taxable event. With Form 1099-DA
        rolling out in 2026, accurate reporting has never been more important — or more scrutinized.
        Here's what US investors should use.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-amber-800 mb-1">⚠️ New IRS rule in 2026</p>
        <p className="text-amber-700 leading-relaxed">
          Form 1099-DA is now required from digital asset brokers. Only TaxBit currently
          generates this form. If you're a broker or high-volume trader, this matters.
        </p>
      </div>

      <div className="space-y-6">
        {US_PLATFORMS.map((platform, i) => (
          <div key={platform.id} className="card p-5">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                style={{ background: platform.logoColor + "18", border: `1.5px solid ${platform.logoColor}40`, color: platform.logoColor }}
              >
                {platform.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900">
                    #{i + 1} {platform.name}
                  </h2>
                  {platform.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: platform.badgeColor! + "18", color: platform.badgeColor! }}>
                      {platform.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{platform.tagline}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-900">from ${platform.pricingStart}/yr</p>
                {platform.freeTier && <p className="text-xs text-emerald-600">Free tier ✓</p>}
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">{platform.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-center">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="font-bold text-slate-900">{platform.exchanges}+</p>
                <p className="text-slate-400">integrations</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="font-bold text-slate-900">{platform.rating}/5</p>
                <p className="text-slate-400">rating</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="font-bold text-emerald-600">{platform.commissionPct}%</p>
                <p className="text-slate-400">commission</p>
              </div>
            </div>

            <div className="flex gap-2">
              <a href={platform.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white text-center hover:opacity-90 transition-opacity"
                style={{ background: platform.logoColor }}>
                Try {platform.name} {platform.freeTier ? "free" : "now"} →
              </a>
              <Link href={`/tax-software/${platform.slug}`}
                className="px-3 py-2.5 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Full review
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-5">
        <h2 className="text-base font-bold text-slate-900 mb-3">Quick decision guide</h2>
        <div className="space-y-3 text-sm">
          {[
            { q: "You use TurboTax",          a: "CoinLedger — direct import, no CSV needed" },
            { q: "You trade on 10+ exchanges", a: "Koinly — 800+ integrations" },
            { q: "You're a high-volume trader", a: "ZenLedger — best audit trail" },
            { q: "You're an institution",      a: "TaxBit — only platform with Form 1099-DA" },
            { q: "You want free to start",     a: "Any platform — all have free tiers" },
          ].map(({ q, a }) => (
            <div key={q} className="flex gap-3">
              <span className="text-brand-500 font-semibold flex-shrink-0">If:</span>
              <span className="text-slate-600 flex-shrink-0">{q}</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-900 font-medium">{a}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-6 leading-relaxed">
        Not tax advice. Commission rates are for informational purposes. Consult a CPA for your
        specific tax situation. Affiliate disclosure: we earn commissions through links on this page.
      </p>
    </div>
  );
}
