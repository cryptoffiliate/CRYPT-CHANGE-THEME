import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Cryptoffiliate — AI-Powered Crypto Intelligence",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div className="container-sm" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
        <div className="eyebrow" style={{ marginBottom: "16px" }}>About us</div>
        <h1 className="heading-xl" style={{ marginBottom: "20px" }}>
          The world's first <span className="italic-serif">AI-native</span> crypto platform
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", color: "var(--chrome)", lineHeight: 1.75, marginBottom: "48px" }}>
          We built Cryptoffiliate because every existing crypto comparison site shows you a static table of fees and calls it research. You deserve better.
        </p>
        {[
          { icon: "🧠", title: "AI-first, not AI-sprinkled", body: "Every page has an AI entry point. Ask a question, upload a trade history, check a URL for scams, or analyse a whitepaper — and get a direct expert answer instantly." },
          { icon: "📊", title: "Live data, not copy-paste", body: "Fees sync nightly from exchange public APIs. When Binance changes its fee structure, we know within 24 hours. No competitor does this." },
          { icon: "🔍", title: "Independent, always", body: "We earn affiliate commissions and disclose every one. Ratings are never influenced by commission rates — if OKX has the lowest fees, it gets the top score regardless of what they pay us." },
          { icon: "🌍", title: "6 verticals, one platform", body: "Exchanges, hardware wallets, tax software, security tools, trading bots, cloud mining — every product a crypto investor needs, with 40+ affiliate programs throughout." },
        ].map(({ icon, title, body }) => (
          <div key={title} style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--paper)", marginBottom: "10px" }}>{title}</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--chrome)", lineHeight: 1.75 }}>{body}</p>
          </div>
        ))}
        <div style={{ display: "flex", gap: "12px", marginTop: "40px", flexWrap: "wrap" }}>
          <Link href="/ai-advisor" style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, background: "var(--gold)", color: "var(--ink)", padding: "12px 24px", borderRadius: "99px", textDecoration: "none" }}>Try AI advisor →</Link>
          <Link href="/compare" style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600, color: "var(--chrome)", padding: "12px 24px", borderRadius: "99px", border: "1px solid var(--wire)", textDecoration: "none" }}>Compare exchanges</Link>
        </div>
      </div>
    </div>
  );
}
