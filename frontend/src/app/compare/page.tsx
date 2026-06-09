import type { Metadata } from "next";
import { ExchangeComparisonTable } from "@/components/ExchangeComparisonTable";
import { EXCHANGES } from "@/data/exchanges";

export const metadata: Metadata = {
  title: "Compare Crypto Exchanges — Fees, Features & Bonuses",
  description:
    "Side-by-side comparison of the best crypto exchanges. Filter by fees, KYC requirements, fiat on-ramp, futures trading, and more.",
};

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ExchangeComparisonTable exchanges={EXCHANGES} />
    </div>
  );
}
