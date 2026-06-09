import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — Cryptoffiliate",
  description: "How Cryptoffiliate earns commissions and our commitment to editorial independence.",
};

export default function DisclosurePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div className="container-sm" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
        <div className="eyebrow" style={{ marginBottom: "16px" }}>Legal</div>
        <h1 className="heading-lg" style={{ marginBottom: "32px" }}>Affiliate disclosure</h1>
        {[
          { title: "How we make money", body: "Cryptoffiliate.com participates in affiliate marketing programs. When you click a link to an exchange, hardware wallet, software, or service on this site and make a purchase or create an account, we may earn a commission from the company. This commission comes at no additional cost to you." },
          { title: "Our editorial independence", body: "Affiliate relationships do not influence our editorial content. Our ratings, reviews, comparisons, and recommendations are based on independent analysis, user reviews, and our own testing. We do not accept payment for positive reviews or higher rankings. An exchange or product paying us a higher commission does not receive a higher score." },
          { title: "FTC compliance", body: "In accordance with the FTC's 16 CFR Part 255, we disclose material connections between our site and companies whose products we recommend. All affiliate links are clearly marked with rel='sponsored'." },
          { title: "AI advisor disclaimer", body: "The Cryptoffiliate AI Advisor is powered by Anthropic's Claude. The AI provides general information only and is not financial, legal, or investment advice. Always do your own research before making financial decisions." },
          { title: "Price and data accuracy", body: "Exchange fees, prices, and product details change frequently. While we update our data nightly and verify information regularly, we cannot guarantee complete accuracy at all times. Always verify current fees and terms directly with the relevant company before making a decision." },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--paper)", marginBottom: "10px" }}>{title}</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--chrome)", lineHeight: 1.75 }}>{body}</p>
          </div>
        ))}
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", borderTop: "1px solid var(--wire)", paddingTop: "20px" }}>Last updated: June 2025</p>
      </div>
    </div>
  );
}
