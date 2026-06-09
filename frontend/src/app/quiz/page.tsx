import type { Metadata } from "next";
import { FindMyExchangeQuiz } from "@/components/FindMyExchangeQuiz";

export const metadata: Metadata = {
  title: "Find My Exchange Quiz — Which Crypto Exchange Is Right for You?",
  description:
    "Answer 5 quick questions and get a personalized crypto exchange recommendation. We match you based on experience, goals, fees, and location — not commissions.",
  openGraph: {
    title: "Find My Crypto Exchange — 5-Question Quiz",
    description:
      "Get a personalized exchange recommendation in under 60 seconds.",
  },
};

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <p className="section-label mb-3">Takes 60 seconds</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Find your perfect crypto exchange
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
            Answer 5 quick questions. We&apos;ll match you to the exchange that
            fits your experience, goals, and location — not just the one that
            pays us the most.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-5 text-xs text-slate-400">
            <span>✓ 5 questions</span>
            <span>✓ Personalized results</span>
            <span>✓ No email required</span>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <FindMyExchangeQuiz />
      </div>
    </div>
  );
}
