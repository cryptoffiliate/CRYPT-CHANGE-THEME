import type { Metadata } from "next";
import Link from "next/link";
import { EXCHANGES } from "@/data/exchanges";

export const metadata: Metadata = {
  title: "Crypto Exchange Reviews 2026 — In-depth & Unbiased",
  description:
    "Detailed reviews of the top crypto exchanges. We test fees, security, UX, and customer support so you can choose with confidence.",
};

export default function ReviewsPage() {
  return (
    <div style={{ background: "#F4F4F0" }} data-testid="reviews-listing">
      <div className="container" style={{ paddingTop: "56px", paddingBottom: "80px", maxWidth: "1024px" }}>
        {/* Editorial masthead */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 14px",
            background: "#FFFFFF",
            border: "2px solid #111111",
            marginBottom: "28px",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "#111111",
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span>● THE REVIEW · SECTION B</span>
          <span className="hidden md:inline-flex">EDITORIALLY INDEPENDENT</span>
          <span>UPDATED {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}</span>
        </div>

        <span className="eyebrow">§ Reviews — All Exchanges</span>
        <h1 className="heading-xl" style={{ fontSize: "clamp(40px, 5.4vw, 64px)", marginBottom: "16px" }}>
          Crypto exchange<br />
          <span className="italic-serif" style={{ color: "#002FA7" }}>reviews.</span>
        </h1>
        <p className="body-lg" style={{ marginBottom: "40px", maxWidth: "640px", color: "#111111", fontSize: "17px" }}>
          We open real accounts, make real trades, and document every fee. Each review is updated when an exchange changes its terms.
        </p>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "0",
            border: "2.5px solid #111111",
            background: "#111111",
          }}
        >
          {EXCHANGES.map((exchange, i) => (
            <Link
              key={exchange.id}
              href={`/reviews/${exchange.slug}`}
              data-testid={`review-card-${exchange.id}`}
              style={{
                background: "#FFFFFF",
                padding: "22px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                transition: "background .12s",
                position: "relative",
                outline: i === 0 ? undefined : "0.5px solid transparent",
              }}
              className="review-card-link"
            >
              {/* Issue number */}
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "14px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "#4A4A4A",
                  letterSpacing: ".1em",
                  fontWeight: 600,
                }}
              >
                № {String(i + 1).padStart(2, "0")}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: exchange.logoColor,
                    border: "2px solid #111111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#111111",
                    flexShrink: 0,
                  }}
                >
                  {exchange.logo}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "#111111", letterSpacing: "-.015em" }}>
                    {exchange.name} <span style={{ fontWeight: 400, fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#4A4A4A" }}>review</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#4A4A4A", marginTop: 2, letterSpacing: ".06em", textTransform: "uppercase" }}>
                    {exchange.tagline}
                  </p>
                </div>
              </div>

              {exchange.badge && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    background: exchange.badgeColor ?? exchange.logoColor,
                    color: "#111111",
                    border: "1.5px solid #111111",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    alignSelf: "flex-start",
                  }}
                >
                  {exchange.badge}
                </span>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "#111111",
                  padding: "8px 0",
                  borderTop: "1.5px solid #111111",
                  borderBottom: "1.5px solid #111111",
                }}
              >
                <span style={{ fontWeight: 700 }}>★ {exchange.rating}/5</span>
                <span style={{ color: "#4A4A4A" }}>|</span>
                <span>Maker {exchange.makerFee}%</span>
                <span style={{ color: "#4A4A4A" }}>|</span>
                <span>{exchange.coins}+ coins</span>
              </div>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#FF5722",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginTop: "auto",
                }}
              >
                Read review →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
