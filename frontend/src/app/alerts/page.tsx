import type { Metadata } from "next";
import { BonusAlertInline } from "@/components/BonusAlertCapture";
import { EXCHANGES } from "@/data/exchanges";

export const metadata: Metadata = {
  title: "Crypto Bonus Alerts — Get Notified When New Exchange Offers Drop",
  description:
    "Subscribe to instant alerts for new crypto exchange signup bonuses, promo codes, and limited-time offers. Verified before we send. Unsubscribe any time.",
};

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5 text-2xl">
            🔔
          </div>
          <p className="section-label mb-3">Free · No spam · Unsubscribe anytime</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Never miss a crypto bonus again
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
            Exchange bonuses expire fast and rarely get announced on social media.
            We track every major exchange and email you the moment a new offer goes live —
            with the affiliate link so you can claim it before it's gone.
          </p>

          {/* Social proof */}
          <div className="flex flex-wrap gap-5 justify-center text-sm text-slate-400 mb-2">
            <span>✓ 2,400+ subscribers</span>
            <span>✓ Verified before sending</span>
            <span>✓ 1–3 emails/week max</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 grid sm:grid-cols-5 gap-8">

        {/* Signup form */}
        <div className="sm:col-span-3">
          <BonusAlertInline />
        </div>

        {/* What you'll get */}
        <div className="sm:col-span-2">
          <p className="section-label mb-4">We watch these exchanges</p>
          <div className="space-y-3">
            {EXCHANGES.map((exchange) => (
              <div key={exchange.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                  style={{
                    background: exchange.logoColor + "18",
                    border: `1.5px solid ${exchange.logoColor}40`,
                    color: exchange.logoColor,
                  }}
                >
                  {exchange.logo}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{exchange.name}</p>
                  <p className="text-xs text-emerald-600 truncate">
                    Current: {exchange.bonus}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-500">Affiliate disclosure:</strong> We earn a commission
              when you sign up via our links. This never affects which bonuses we alert you about —
              we cover all major exchanges equally.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
