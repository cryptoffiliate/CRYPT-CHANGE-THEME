import type { Metadata } from "next";
import { EXCHANGES } from "@/data/exchanges";
import { buildAffiliateUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Best Crypto Exchange Signup Bonuses & Promo Codes 2025",
  description:
    "Exclusive signup bonuses, referral codes, and promo offers from the top crypto exchanges. All verified and updated monthly.",
};

export default function BonusesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="section-label">Verified June 2025</p>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Crypto exchange signup bonuses
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        All bonuses below are active and verified. Click any link to claim —
        most require signing up through the referral link to qualify.{" "}
        <span className="text-brand-500">
          Affiliate disclosure: we earn a commission at no cost to you.
        </span>
      </p>

      <div className="space-y-4">
        {EXCHANGES.map((exchange) => {
          const url = buildAffiliateUrl(
            exchange.affiliateUrl,
            exchange.id,
            "bonus"
          );
          return (
            <div
              key={exchange.id}
              className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Logo */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                style={{
                  background: exchange.logoColor + "18",
                  border: `1.5px solid ${exchange.logoColor}40`,
                  color: exchange.logoColor,
                }}
              >
                {exchange.logo}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900 text-sm">
                    {exchange.name}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-base font-bold text-emerald-600 mt-0.5">
                  🎁 {exchange.bonus}
                </p>
                {exchange.promoCode && (
                  <p className="text-xs text-slate-400 mt-1">
                    Code:{" "}
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">
                      {exchange.promoCode}
                    </code>
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Maker fee: {exchange.makerFee}% · {exchange.coins}+ coins
                </p>
              </div>

              {/* CTA */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-semibold px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ background: exchange.logoColor }}
              >
                Claim bonus →
              </a>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 mt-8 leading-relaxed">
        Bonuses are subject to the exchange&apos;s terms and conditions. Some
        bonuses require a minimum deposit or trading volume. Last verified June
        2025.
      </p>
    </div>
  );
}
