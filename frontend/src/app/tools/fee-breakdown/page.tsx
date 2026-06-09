import type { Metadata } from "next";
import { HiddenFeeCalculator } from "@/components/HiddenFeeCalculator";

export const metadata: Metadata = {
  title: "Crypto Hidden Fee Calculator — See Your True Trading Cost",
  description:
    "Most exchanges hide up to 8% in fees. Enter your trade size and see a full breakdown: trading fees, spread markup, deposit fees, and withdrawal costs — side by side across 5 exchanges.",
  openGraph: {
    title: "What are you really paying? Crypto hidden fee calculator",
    description: "Reveal spread markups, deposit charges, and withdrawal fees your exchange doesn't advertise.",
  },
};

export default function FeeBreakdownPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="section-label mb-2">Free tool · Updated June 2025</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            What are you <span className="text-red-500">really</span> paying?
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            Most exchanges advertise their cheapest fee and hide the rest.
            This calculator shows every layer — trading fee, spread markup,
            deposit charges, and withdrawal costs — so you know your true total before you trade.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <HiddenFeeCalculator />
      </div>
    </div>
  );
}
