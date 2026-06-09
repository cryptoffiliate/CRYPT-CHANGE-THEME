import Link from "next/link";
import type { Exchange } from "@/lib/types";
import { buildAffiliateUrl } from "@/lib/utils";

interface Props {
  exchange: Exchange;
}

function StarRow({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"
            fill={s <= rounded ? "#00F0FF" : "none"}
            stroke={s <= rounded ? "#00F0FF" : "#2A3554"}
            strokeWidth="1"
            style={s <= rounded ? { filter: "drop-shadow(0 0 4px #00F0FF)" } : undefined}
          />
        </svg>
      ))}
    </span>
  );
}

export function ExchangeCard({ exchange }: Props) {
  return (
    <article
      data-testid={`exchange-card-${exchange.id}`}
      className="glow-card"
      style={{
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Colored top neon line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${exchange.logoColor}, transparent)`,
          boxShadow: `0 0 14px ${exchange.logoColor}`,
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginTop: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 800,
              background: exchange.logoColor,
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "10px",
              color: "#04060B",
              flexShrink: 0,
              boxShadow: `0 0 22px ${exchange.logoColor}66`,
            }}
          >
            {exchange.logo}
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--paper)", letterSpacing: "-.01em" }}>
              {exchange.name}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 3 }}>
              {exchange.tagline}
            </p>
          </div>
        </div>
        {exchange.badge && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: "999px",
              background: `${exchange.badgeColor ?? exchange.logoColor}1A`,
              color: exchange.badgeColor ?? exchange.logoColor,
              border: `1px solid ${exchange.badgeColor ?? exchange.logoColor}`,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            {exchange.badge}
          </span>
        )}
      </div>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "14px", borderBottom: "1px solid var(--wire)" }}>
        <StarRow rating={exchange.rating} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "#00F0FF" }}>
          {exchange.rating}
          <span style={{ fontSize: "11px", color: "var(--chrome)" }}>/5</span>
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginLeft: "auto" }}>
          {(exchange.reviews / 1000).toFixed(1)}K REVIEWS
        </span>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          border: "1px solid var(--wire)",
          borderRadius: "10px",
          background: "rgba(5, 6, 10, 0.5)",
          overflow: "hidden",
        }}
      >
        {[
          { label: "MAKER", value: `${exchange.makerFee}%` },
          { label: "COINS", value: `${exchange.coins}+` },
          { label: "MIN", value: exchange.minDeposit },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              padding: "12px 6px",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid var(--wire)" : "none",
            }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--paper)", lineHeight: 1 }}>{value}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", marginTop: 5, letterSpacing: ".14em", fontWeight: 500 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Bonus */}
      <div
        style={{
          background: "rgba(0, 255, 148, 0.08)",
          border: "1px solid #00FF94",
          borderRadius: "10px",
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "#00FF94",
          fontWeight: 500,
          letterSpacing: ".02em",
          textShadow: "0 0 8px rgba(0, 255, 148, 0.35)",
        }}
      >
        ▶ {exchange.bonus}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        <a
          href={buildAffiliateUrl(exchange.affiliateUrl, exchange.id, "table")}
          target="_blank"
          rel="noopener noreferrer sponsored"
          data-testid={`exchange-card-cta-${exchange.id}`}
          className="btn-primary"
          style={{
            flex: 1,
            justifyContent: "center",
            fontSize: "12px",
            padding: "11px 14px",
          }}
        >
          Visit {exchange.name} →
        </a>
        <Link
          href={`/reviews/${exchange.slug}`}
          className="btn-ghost"
          style={{
            fontSize: "12px",
            padding: "11px 16px",
          }}
        >
          Review
        </Link>
      </div>
    </article>
  );
}
