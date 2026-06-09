import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EXCHANGES, getExchangeBySlug } from "@/data/exchanges";
import { buildAffiliateUrl } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

// Generate all static paths at build time
export async function generateStaticParams() {
  return EXCHANGES.map((e) => ({ slug: e.slug }));
}

// Dynamic SEO metadata per exchange
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) return {};
  return {
    title: `${exchange.name} Review 2026 — Fees, Safety & Our Verdict`,
    description: `Is ${exchange.name} safe? Our in-depth review covers fees (${exchange.makerFee}% maker / ${exchange.takerFee}% taker), security, supported coins, and exclusive signup bonuses.`,
    openGraph: {
      title: `${exchange.name} Review 2026`,
      description: `In-depth review of ${exchange.name}. Rating: ${exchange.rating}/5.`,
    },
  };
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = (score / 5) * 100;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1.5px solid #111111",
        gap: "16px",
      }}
    >
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#111111", letterSpacing: ".02em" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, maxWidth: "260px" }}>
        <div
          style={{
            flex: 1,
            height: "10px",
            background: "#F4F4F0",
            border: "1.5px solid #111111",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: score >= 4.5 ? "#00C853" : score >= 4 ? "#FFD600" : score >= 3 ? "#FF5722" : "#D50000",
              transition: "width 1s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 700, color: "#111111", width: "40px", textAlign: "right" }}>
          {score}/5
        </span>
      </div>
    </div>
  );
}

export default function ReviewPage({ params }: Props) {
  const exchange = getExchangeBySlug(params.slug);
  if (!exchange) notFound();

  const affiliateUrl = buildAffiliateUrl(exchange.affiliateUrl, exchange.id, "review");

  const subScores = [
    { label: "Fees & pricing",   score: exchange.makerFee <= 0.1 ? 4.8 : 3.8 },
    { label: "Security",         score: exchange.usBased ? 4.5 : 4.0 },
    { label: "Ease of use",      score: exchange.id === "coinbase" ? 4.9 : 4.2 },
    { label: "Coin selection",   score: exchange.coins >= 300 ? 4.7 : 3.9 },
    { label: "Customer support", score: 3.8 },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "FinancialService",
      name: exchange.name,
      url: exchange.affiliateUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: exchange.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: { "@type": "Organization", name: "Cryptoffiliate" },
    publisher: { "@type": "Organization", name: "Cryptoffiliate" },
    datePublished: exchange.lastUpdated,
    dateModified: exchange.lastUpdated,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="brutalist-page" style={{ background: "#F4F4F0" }} data-testid={`review-page-${exchange.slug}`}>
        <div className="container" style={{ paddingTop: "48px", paddingBottom: "80px", maxWidth: "880px" }}>

          {/* Breadcrumb */}
          <nav
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#4A4A4A",
              marginBottom: "28px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              letterSpacing: ".06em",
            }}
          >
            <Link href="/" style={{ color: "#4A4A4A", textDecoration: "none" }}>HOME</Link>
            <span>/</span>
            <Link href="/reviews" style={{ color: "#4A4A4A", textDecoration: "none" }}>REVIEWS</Link>
            <span>/</span>
            <span style={{ color: "#111111", fontWeight: 700 }}>{exchange.name.toUpperCase()}</span>
          </nav>

          {/* Editorial masthead */}
          <div
            style={{
              padding: "8px 14px",
              background: "#111111",
              color: "#F4F4F0",
              marginBottom: "20px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: ".18em",
              textTransform: "uppercase",
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span>● THE REVIEW · № {exchange.id.toUpperCase()}</span>
            <span style={{ color: "#FFD600" }}>UPDATED {exchange.lastUpdated.toUpperCase()}</span>
          </div>

          {/* Header */}
          <div style={{ background: "#FFFFFF", border: "2.5px solid #111111", boxShadow: "6px 6px 0 0 #111111", padding: "28px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
              <div
                style={{
                  width: "76px",
                  height: "76px",
                  background: exchange.logoColor,
                  border: "2.5px solid #111111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#111111",
                  flexShrink: 0,
                  boxShadow: "4px 4px 0 0 #111111",
                }}
              >
                {exchange.logo}
              </div>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <h1 className="heading-lg" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
                    {exchange.name} <span className="italic-serif" style={{ color: "#002FA7", fontSize: "0.85em" }}>review</span>
                  </h1>
                  {exchange.badge && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "3px 10px",
                        background: exchange.badgeColor ?? exchange.logoColor,
                        color: "#111111",
                        border: "1.5px solid #111111",
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {exchange.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#111111", lineHeight: 1.55, marginBottom: "10px" }}>
                  {exchange.tagline}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "#4A4A4A", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  Founded {exchange.founded} · HQ {exchange.headquarters} · Updated {exchange.lastUpdated}
                </p>
              </div>
            </div>
          </div>

          {/* Affiliate disclosure */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#111111",
              background: "#FFD600",
              border: "1.5px solid #111111",
              padding: "8px 12px",
              marginBottom: "32px",
              letterSpacing: ".02em",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Affiliate disclosure ›</strong>{" "}
            We may earn a commission if you sign up through links on this page, at no cost to you.
          </p>

          {/* Top verdict CTA */}
          <div
            style={{
              background: "#111111",
              color: "#F4F4F0",
              padding: "20px 24px",
              border: "2.5px solid #111111",
              boxShadow: "6px 6px 0 0 #FF5722",
              marginBottom: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
            data-testid="review-verdict-cta"
          >
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#FFD600", letterSpacing: ".22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
                Our verdict
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "#F4F4F0", letterSpacing: "-.015em" }}>
                {exchange.name} scores{" "}
                <span style={{ color: "#FF5722", fontSize: "26px" }}>{exchange.rating}</span>
                <span style={{ color: "#9A9A9A" }}>/5</span>
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#00C853", fontWeight: 700, marginTop: 6, letterSpacing: ".04em" }}>
                ► {exchange.bonus}
              </p>
            </div>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-testid="review-top-cta"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "13px",
                padding: "14px 22px",
                background: exchange.logoColor,
                color: "#111111",
                border: "2.5px solid #F4F4F0",
                textDecoration: "none",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                boxShadow: "4px 4px 0 0 #F4F4F0",
              }}
            >
              Visit {exchange.name} →
            </a>
          </div>

          {/* Score breakdown */}
          <section style={{ marginBottom: "44px" }}>
            <span className="eyebrow">§ 01 — Score Breakdown</span>
            <h2 className="heading-md" style={{ marginBottom: "16px", fontSize: "26px" }}>
              How we <span className="italic-serif">scored</span> {exchange.name}.
            </h2>
            <div
              style={{
                background: "#FFFFFF",
                border: "2.5px solid #111111",
                boxShadow: "5px 5px 0 0 #111111",
              }}
            >
              {subScores.map((s, i) => (
                <ScoreBar key={s.label} label={s.label} score={s.score} />
              ))}
              <div style={{ padding: "12px 16px", background: "#111111", color: "#F4F4F0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 700 }}>
                  OVERALL
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 800, color: "#FF5722" }}>
                  {exchange.rating} / 5
                </span>
              </div>
            </div>
          </section>

          {/* Key stats */}
          <section style={{ marginBottom: "44px" }}>
            <span className="eyebrow">§ 02 — At A Glance</span>
            <h2 className="heading-md" style={{ marginBottom: "16px", fontSize: "26px" }}>
              The <span className="italic-serif">essentials</span>.
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0",
                border: "2.5px solid #111111",
                background: "#111111",
                boxShadow: "5px 5px 0 0 #111111",
              }}
            >
              {[
                { label: "MAKER FEE",      value: `${exchange.makerFee}%` },
                { label: "TAKER FEE",      value: `${exchange.takerFee}%` },
                { label: "COINS LISTED",   value: `${exchange.coins}+` },
                { label: "MIN. DEPOSIT",   value: exchange.minDeposit },
                { label: "WITHDRAWAL",     value: exchange.withdrawalFee },
                { label: "KYC",            value: exchange.kyc === "required" ? "Required" : "Optional" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#FFFFFF",
                    padding: "16px 14px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 900, color: "#111111", letterSpacing: "-.02em", lineHeight: 1 }}>
                    {value}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#4A4A4A", marginTop: 6, letterSpacing: ".18em", fontWeight: 700 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Pros & Cons */}
          <section style={{ marginBottom: "44px" }}>
            <span className="eyebrow">§ 03 — The Trade-Off</span>
            <h2 className="heading-md" style={{ marginBottom: "16px", fontSize: "26px" }}>
              <span className="italic-serif">Pros</span> & cons.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: "2.5px solid #111111", boxShadow: "5px 5px 0 0 #111111", background: "#111111" }}>
              <div style={{ background: "#FFFFFF", padding: "20px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#111111",
                    background: "#00C853",
                    border: "1.5px solid #111111",
                    padding: "3px 8px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                    display: "inline-block",
                  }}
                >
                  + Pros
                </p>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {exchange.best.map((b) => (
                    <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-body)", fontSize: "14px", color: "#111111", lineHeight: 1.55 }}>
                      <span style={{ color: "#00873E", fontWeight: 900, marginTop: "1px" }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ background: "#FFFFFF", padding: "20px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#F4F4F0",
                    background: "#D50000",
                    border: "1.5px solid #111111",
                    padding: "3px 8px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                    display: "inline-block",
                  }}
                >
                  − Cons
                </p>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {exchange.kyc === "required" && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-body)", fontSize: "14px", color: "#111111", lineHeight: 1.55 }}>
                      <span style={{ color: "#D50000", fontWeight: 900, marginTop: "1px" }}>✗</span>
                      Full KYC required
                    </li>
                  )}
                  {!exchange.usBased && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-body)", fontSize: "14px", color: "#111111", lineHeight: 1.55 }}>
                      <span style={{ color: "#D50000", fontWeight: 900, marginTop: "1px" }}>✗</span>
                      Not available in the US
                    </li>
                  )}
                  {exchange.takerFee > 0.2 && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-body)", fontSize: "14px", color: "#111111", lineHeight: 1.55 }}>
                      <span style={{ color: "#D50000", fontWeight: 900, marginTop: "1px" }}>✗</span>
                      Higher taker fees than competitors
                    </li>
                  )}
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "var(--font-body)", fontSize: "14px", color: "#111111", lineHeight: 1.55 }}>
                    <span style={{ color: "#D50000", fontWeight: 900, marginTop: "1px" }}>✗</span>
                    Customer support can be slow
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div
            data-testid="review-bottom-cta"
            style={{
              background: "#FFFFFF",
              border: "2.5px solid #111111",
              boxShadow: "8px 8px 0 0 #111111",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 10px",
                background: "#00C853",
                color: "#111111",
                border: "1.5px solid #111111",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              EXCLUSIVE OFFER
            </span>
            <p className="heading-md" style={{ fontSize: "26px", marginBottom: "10px" }}>
              Ready to get started with <span className="italic-serif">{exchange.name}</span>?
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#4A4A4A", marginBottom: "24px", letterSpacing: ".04em" }}>
              Use our link to claim: <strong style={{ color: "#FF5722" }}>{exchange.bonus}</strong>
            </p>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-testid="review-bottom-affiliate-btn"
              className="btn-primary"
              style={{ fontSize: "13px", padding: "14px 24px", background: exchange.logoColor }}
            >
              Open {exchange.name} account →
            </a>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#4A4A4A", marginTop: "12px", letterSpacing: ".06em" }}>
              Affiliate link · {exchange.bonus}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
