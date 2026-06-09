import type { Metadata } from "next";
import { ScamDetector } from "@/components/tools/ScamDetector";

export const metadata: Metadata = {
  title: "Crypto Scam Detector — Is This Exchange Legit? AI-Powered Check",
  description:
    "Paste any crypto exchange, wallet, or platform URL and our AI instantly assesses legitimacy. Check for red flags, scam patterns, and verify before you deposit.",
};

export default function ScamDetectorPage() {
  return (
    <div className="brutalist-page" style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Powered by Claude · Free to use</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Crypto scam <span className="italic-serif">detector</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "540px" }}>
            Paste any exchange, wallet, or platform URL. Our AI cross-references known scam patterns, checks domain age, regulatory status, and tells you exactly what to look out for.
          </p>
        </div>
      </div>
      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        <ScamDetector />
      </div>
    </div>
  );
}
