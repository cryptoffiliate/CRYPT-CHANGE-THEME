"use client";

import Link from "next/link";
import type { Exchange } from "@/lib/types";

export function HomeExchangeTable({ exchanges }: { exchanges: Exchange[] }) {
  return (
    <div
      data-testid="home-exchange-table"
      style={{
        background: "linear-gradient(180deg, rgba(11, 14, 24, 0.85), rgba(5, 6, 10, 0.85))",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid var(--wire)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 0 0 1px rgba(0, 240, 255, 0.12), 0 18px 48px rgba(0, 0, 0, 0.5), 0 0 36px rgba(0, 240, 255, 0.1)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table className="dark-table" style={{ minWidth: "760px" }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: "22px" }}>Exchange</th>
              <th>Rating</th>
              <th>Maker</th>
              <th>Taker</th>
              <th>Coins</th>
              <th>KYC</th>
              <th>Commission</th>
              <th style={{ paddingRight: "22px", textAlign: "right" }}>Trade</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange, i) => (
              <ExchangeRow key={exchange.id} exchange={exchange} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "14px 22px",
          background: "rgba(0, 0, 0, 0.4)",
          color: "var(--chrome)",
          borderTop: "1px solid var(--wire)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: ".15em",
            textTransform: "uppercase",
            color: "var(--chrome)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#00FF94", boxShadow: "0 0 8px #00FF94" }} />
          Standard tier · Affiliate disclosure applies
        </span>
        <Link
          href="/tools/fee-breakdown"
          data-testid="see-hidden-fees-link"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#00F0FF",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            textShadow: "0 0 8px rgba(0, 240, 255, 0.45)",
          }}
        >
          See hidden fees →
        </Link>
      </div>
    </div>
  );
}

function ExchangeRow({ exchange, index }: { exchange: Exchange; index: number }) {
  const kycIsRequired = exchange.kyc === "required";

  return (
    <tr style={{ animationDelay: `${index * 0.06}s` }} data-testid={`exchange-row-${exchange.id}`}>
      {/* Name */}
      <td style={{ paddingLeft: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 800,
              background: exchange.logoColor,
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#04060B",
              flexShrink: 0,
              boxShadow: `0 0 18px ${exchange.logoColor}55`,
            }}
          >
            {exchange.logo}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 600, color: "var(--paper)", letterSpacing: "-.01em" }}>
              {exchange.name}
            </div>
            {exchange.badge && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 600,
                  color: exchange.badgeColor ?? exchange.logoColor,
                  background: `${exchange.badgeColor ?? exchange.logoColor}1A`,
                  padding: "2px 8px",
                  border: `1px solid ${exchange.badgeColor ?? exchange.logoColor}`,
                  borderRadius: "999px",
                  letterSpacing: ".1em",
                  marginTop: "4px",
                  display: "inline-block",
                  textTransform: "uppercase",
                }}
              >
                {exchange.badge}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Rating */}
      <td>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "#00F0FF" }}>
          {exchange.rating}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginLeft: "2px" }}>
          /5
        </span>
      </td>

      {/* Maker */}
      <td>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--paper)" }}>
          {exchange.makerFee}%
        </span>
      </td>

      {/* Taker */}
      <td>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--paper)" }}>
          {exchange.takerFee}%
        </span>
      </td>

      {/* Coins */}
      <td>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--paper)" }}>
          {exchange.coins}+
        </span>
      </td>

      {/* KYC */}
      <td>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "999px",
            border: `1px solid ${kycIsRequired ? "#FFC93C" : "#00FF94"}`,
            color: kycIsRequired ? "#FFC93C" : "#00FF94",
            background: kycIsRequired ? "rgba(255, 201, 60, 0.10)" : "rgba(0, 255, 148, 0.10)",
            textTransform: "uppercase",
            letterSpacing: ".12em",
          }}
        >
          {kycIsRequired ? "KYC REQ." : "KYC OPT."}
        </span>
      </td>

      {/* Commission */}
      <td>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "#B026FF", textShadow: "0 0 8px rgba(176, 38, 255, 0.45)" }}>
          {exchange.commission}
        </span>
      </td>

      {/* CTA */}
      <td style={{ paddingRight: "22px", textAlign: "right" }}>
        <AffBtn exchange={exchange} />
      </td>
    </tr>
  );
}

function AffBtn({ exchange }: { exchange: Exchange }) {
  return (
    <a
      href={exchange.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="aff-btn"
      data-testid={`affiliate-cta-${exchange.id}`}
    >
      Trade →
    </a>
  );
}
