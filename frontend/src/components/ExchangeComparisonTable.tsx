"use client";

import { useState, useMemo } from "react";
import type { Exchange, SortKey, TableFilters } from "@/lib/types";
import { buildAffiliateUrl, formatCount } from "@/lib/utils";

// ─── Sub-components ──────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span style={{ display: "inline-flex", gap: 1.5, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="10" height="10" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"
            fill={s <= rounded ? "#111111" : "none"}
            stroke="#111111"
            strokeWidth="1"
          />
        </svg>
      ))}
    </span>
  );
}

function KycPill({ kyc }: { kyc: Exchange["kyc"] }) {
  const isReq = kyc === "required";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        fontWeight: 800,
        padding: "3px 8px",
        background: isReq ? "#FFD600" : "#00C853",
        color: "#111111",
        border: "1.5px solid #111111",
        letterSpacing: ".1em",
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      {isReq ? "KYC REQ." : "KYC OPT."}
    </span>
  );
}

function Check({ value }: { value: boolean }) {
  return value ? (
    <span style={{ color: "#00873E", fontWeight: 800, fontSize: "16px" }}>✓</span>
  ) : (
    <span style={{ color: "#D50000", fontWeight: 800, fontSize: "14px" }}>✗</span>
  );
}

// ─── Expanded row detail ─────────────────────────────────────────────────────

function ExpandedRow({ exchange }: { exchange: Exchange }) {
  return (
    <tr style={{ background: "#F4F4F0" }}>
      <td colSpan={9} style={{ padding: "0 0 16px 0", borderBottom: "2px solid #111111" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0, border: "2px solid #111111", margin: "0 16px" }}>
          {/* Best for */}
          <div style={{ background: "#FFFFFF", padding: "14px 16px", borderRight: "1.5px solid #111111" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#111111",
                marginBottom: "10px",
                paddingBottom: "6px",
                borderBottom: "1.5px solid #111111",
              }}
            >
              Best for
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {exchange.best.map((b) => (
                <span
                  key={b}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "3px 7px",
                    background: exchange.logoColor,
                    color: "#111111",
                    border: "1.5px solid #111111",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Affiliate commission */}
          <div style={{ background: "#FFFFFF", padding: "14px 16px", borderRight: "1.5px solid #111111" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#111111",
                marginBottom: "10px",
                paddingBottom: "6px",
                borderBottom: "1.5px solid #111111",
              }}
            >
              Affiliate commission
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "#002FA7", marginBottom: "6px" }}>
              {exchange.commission}
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#4A4A4A", lineHeight: 1.5 }}>
              Min: {exchange.minDeposit}<br />
              Withdraw: {exchange.withdrawalFee}
            </p>
          </div>

          {/* Features */}
          <div style={{ background: "#FFFFFF", padding: "14px 16px" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "#111111",
                marginBottom: "10px",
                paddingBottom: "6px",
                borderBottom: "1.5px solid #111111",
              }}
            >
              Features
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#111111" }}>
              {([
                ["Staking", exchange.staking],
                ["Futures", exchange.futures],
                ["Fiat on-ramp", exchange.fiatOnRamp],
                ["US available", exchange.usBased],
              ] as const).map(([label, val]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Check value={val} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main row ────────────────────────────────────────────────────────────────

function ExchangeRow({
  exchange,
  isExpanded,
  onToggle,
}: {
  exchange: Exchange;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const affiliateUrl = buildAffiliateUrl(exchange.affiliateUrl, exchange.id, "table");

  return (
    <>
      <tr
        onClick={onToggle}
        data-testid={`exchange-row-${exchange.id}`}
        style={{
          cursor: "pointer",
          borderBottom: "1.5px solid #111111",
          background: isExpanded ? "#FFD600" : "#FFFFFF",
          transition: "background .12s",
        }}
      >
        {/* Name */}
        <td style={{ padding: "14px 16px", minWidth: "200px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 800,
                background: exchange.logoColor,
                border: "2px solid #111111",
                color: "#111111",
                flexShrink: 0,
              }}
            >
              {exchange.logo}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: "#111111", letterSpacing: "-.01em" }}>
                  {exchange.name}
                </span>
                {exchange.badge && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      fontWeight: 800,
                      padding: "2px 6px",
                      background: exchange.badgeColor ?? exchange.logoColor,
                      color: "#111111",
                      border: "1.5px solid #111111",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {exchange.badge}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#4A4A4A", marginTop: 3, letterSpacing: ".04em" }}>
                {exchange.tagline}
              </p>
            </div>
          </div>
        </td>

        {/* Rating */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <Stars rating={exchange.rating} />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#111111", marginTop: 3, fontWeight: 600 }}>
            {exchange.rating} ({formatCount(exchange.reviews)})
          </p>
        </td>

        {/* Maker fee */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "#111111" }}>
            {exchange.makerFee}%
          </p>
        </td>

        {/* Taker fee */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "#111111" }}>
            {exchange.takerFee}%
          </p>
        </td>

        {/* Coins */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 700, color: "#111111" }}>
            {exchange.coins}+
          </p>
        </td>

        {/* KYC */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <KycPill kyc={exchange.kyc} />
        </td>

        {/* Fiat */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <Check value={exchange.fiatOnRamp} />
        </td>

        {/* Futures */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <Check value={exchange.futures} />
        </td>

        {/* CTA */}
        <td style={{ padding: "14px 16px", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            data-testid={`affiliate-cta-${exchange.id}`}
            className="aff-btn"
            style={{
              background: exchange.logoColor,
              color: "#111111",
              borderColor: "#111111",
            }}
          >
            Trade →
          </a>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#00873E", fontWeight: 700, marginTop: 5, letterSpacing: ".02em" }}>
            ► {exchange.bonus}
          </p>
        </td>
      </tr>

      {isExpanded && <ExpandedRow exchange={exchange} />}
    </>
  );
}

// ─── Filter / sort bar ───────────────────────────────────────────────────────

const FILTER_OPTIONS: { key: keyof TableFilters; label: string }[] = [
  { key: "usBased",    label: "US available" },
  { key: "fiatOnRamp", label: "Fiat on-ramp" },
  { key: "futures",    label: "Futures" },
  { key: "staking",    label: "Staking" },
  { key: "kycOptional", label: "No KYC" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "rating",   label: "Rating" },
  { key: "makerFee", label: "Maker fee" },
  { key: "takerFee", label: "Taker fee" },
  { key: "coins",    label: "Coins" },
];

function PillButton({
  active,
  children,
  onClick,
  testId,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 700,
        padding: "6px 12px",
        background: active ? "#111111" : "#FFFFFF",
        color: active ? "#F4F4F0" : "#111111",
        border: "2px solid #111111",
        cursor: "pointer",
        letterSpacing: ".06em",
        textTransform: "uppercase",
        transition: "all .12s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function ExchangeComparisonTable({ exchanges }: { exchanges: Exchange[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortAsc, setSortAsc] = useState(false);
  const [filters, setFilters] = useState<TableFilters>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFilter = (key: keyof TableFilters) =>
    setFilters((f) => ({ ...f, [key]: !f[key] }));

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(key === "makerFee" || key === "takerFee");
    }
  };

  const filtered = useMemo(() => {
    let list = [...exchanges];
    if (filters.usBased)     list = list.filter((e) => e.usBased);
    if (filters.fiatOnRamp)  list = list.filter((e) => e.fiatOnRamp);
    if (filters.futures)     list = list.filter((e) => e.futures);
    if (filters.staking)     list = list.filter((e) => e.staking);
    if (filters.kycOptional) list = list.filter((e) => e.kyc !== "required");

    list.sort((a, b) => {
      const va = a[sortKey] as number;
      const vb = b[sortKey] as number;
      return sortAsc ? va - vb : vb - va;
    });

    return list;
  }, [exchanges, filters, sortKey, sortAsc]);

  return (
    <div data-testid="exchange-comparison-table">
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <span className="eyebrow">§ LIVE COMPARISON — UPDATED NIGHTLY</span>
        <h1 className="heading-lg" style={{ marginBottom: 8 }}>
          Crypto exchange <span className="italic-serif">comparison</span>
        </h1>
        <p className="body-sm" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#4A4A4A", letterSpacing: ".06em" }}>
          {exchanges.length} EXCHANGES · AFFILIATE LINKS DISCLOSED · NOT FINANCIAL ADVICE
        </p>
      </div>

      {/* Filter / sort bar */}
      <div
        style={{
          border: "2px solid #111111",
          background: "#FFFFFF",
          padding: "12px 14px",
          marginBottom: "14px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, color: "#111111", letterSpacing: ".18em", textTransform: "uppercase", marginRight: "4px" }}>
          Filter ›
        </span>
        {FILTER_OPTIONS.map(({ key, label }) => (
          <PillButton
            key={key}
            active={!!filters[key]}
            onClick={() => toggleFilter(key)}
            testId={`filter-${key}`}
          >
            {filters[key] ? "● " : "○ "}
            {label}
          </PillButton>
        ))}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, color: "#111111", letterSpacing: ".18em", textTransform: "uppercase", marginLeft: "8px", marginRight: "4px" }}>
          Sort ›
        </span>
        {SORT_OPTIONS.map(({ key, label }) => (
          <PillButton
            key={key}
            active={sortKey === key}
            onClick={() => handleSort(key)}
            testId={`sort-${key}`}
          >
            {label}
            {sortKey === key && (sortAsc ? " ↑" : " ↓")}
          </PillButton>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          border: "3px solid #111111",
          background: "#FFFFFF",
          overflow: "hidden",
          boxShadow: "6px 6px 0 0 #111111",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table className="dark-table" style={{ minWidth: "920px" }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: "16px", textAlign: "left" }}>Exchange</th>
                {SORT_OPTIONS.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                      background: sortKey === key ? "#FF5722" : "#111111",
                      color: sortKey === key ? "#111111" : "#F4F4F0",
                      transition: "background .12s",
                    }}
                  >
                    {label}
                    {sortKey === key && (sortAsc ? " ↑" : " ↓")}
                  </th>
                ))}
                <th style={{ textAlign: "center" }}>KYC</th>
                <th style={{ textAlign: "center" }}>Fiat</th>
                <th style={{ textAlign: "center" }}>Futures</th>
                <th style={{ paddingRight: "16px", textAlign: "right" }}>Trade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exchange) => (
                <ExchangeRow
                  key={exchange.id}
                  exchange={exchange}
                  isExpanded={expandedId === exchange.id}
                  onToggle={() =>
                    setExpandedId(expandedId === exchange.id ? null : exchange.id)
                  }
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "#4A4A4A",
                      letterSpacing: ".06em",
                    }}
                  >
                    ▢ No exchanges match the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "10px 16px",
            background: "#111111",
            color: "#F4F4F0",
            borderTop: "2px solid #111111",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#9A9A9A" }}>
            ● Click any row to expand · Standard tier fees
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#FFD600", fontWeight: 700 }}>
            Last updated: TONIGHT
          </span>
        </div>
      </div>
    </div>
  );
}
