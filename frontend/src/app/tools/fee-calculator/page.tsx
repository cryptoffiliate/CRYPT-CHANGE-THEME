import type { Metadata } from "next";
import { FeeCalculator } from "@/components/FeeCalculator";
import { EXCHANGES } from "@/data/exchanges";

export const metadata: Metadata = {
  title: "Crypto Exchange Fee Calculator 2025 — Compare Real Trading Costs",
  description:
    "Enter your trade size and see exactly how much each exchange charges. Compare maker and taker fees across 5 major exchanges instantly.",
};

export default function FeeCalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="section-label">Free tool</p>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Crypto exchange fee calculator
      </h1>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">
        Enter your trade size to see exactly what each exchange charges. Fees
        shown are standard tier — actual fees may be lower if you hold the
        exchange's native token or have high monthly volume.
      </p>
      <FeeCalculator exchanges={EXCHANGES} />
    </div>
  );
}
