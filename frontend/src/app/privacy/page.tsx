import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Cryptoffiliate" };

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div className="container-sm" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
        <div className="eyebrow" style={{ marginBottom: "16px" }}>Legal</div>
        <h1 className="heading-lg" style={{ marginBottom: "32px" }}>Privacy policy</h1>
        {[
          { title: "What we collect", body: "If you subscribe to bonus alerts, we collect your email address and preferences via Resend. We do not sell or share your email with third parties. We store a hashed IP address for rate limiting only." },
          { title: "AI tool data", body: "When you use our AI tools, your input is sent to Anthropic's Claude API. We do not store conversations. CSV uploads for the fee analyst are processed entirely in your browser — never uploaded to our servers." },
          { title: "Analytics", body: "We may use privacy-respecting analytics. No personally identifiable information is collected through analytics." },
          { title: "Cookies", body: "We use minimal cookies for site functionality only. No advertising cookies. We do not track you across other websites." },
          { title: "Your rights", body: "Unsubscribe from emails at any time via the one-click link in every email. To request data deletion: privacy@cryptoffiliate.com" },
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
