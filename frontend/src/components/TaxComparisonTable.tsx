"use client";

import { useState, useMemo, Fragment } from "react";
import Link from "next/link";
import type { TaxSoftware } from "@/data/tax-software";

type SortKey = "rating" | "pricingStart" | "commissionPct" | "exchanges";

const INK = "#111111";
const PAPER = "#F4F4F0";
const VERMILION = "#FF5722";
const KLEIN = "#002FA7";
const CANARY = "#FFD600";
const MINT = "#00C853";
const DANGER = "#D50000";

function Check({ val }: { val: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 22,
        height: 22,
        background: val ? MINT : DANGER,
        color: val ? INK : "#FFFFFF",
        border: `1.5px solid ${INK}`,
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {val ? "✓" : "✕"}
    </span>
  );
}

function ExpandedRow({ platform }: { platform: TaxSoftware }) {
  const cellBase: React.CSSProperties = {
    flex: "1 1 220px",
    background: "#FFFFFF",
    border: `2px solid ${INK}`,
    padding: 14,
  };
  const label: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: ".22em",
    textTransform: "uppercase",
    color: "#4A4A4A",
    marginBottom: 10,
    fontWeight: 700,
  };
  return (
    <tr style={{ background: PAPER }}>
      <td colSpan={8} style={{ padding: "0 14px 18px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* Best for */}
          <div style={cellBase}>
            <p style={label}>Best for</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {platform.bestFor.map((b) => (
                <span
                  key={b}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 9px",
                    background: platform.logoColor,
                    color: INK,
                    border: `1.5px solid ${INK}`,
                    letterSpacing: ".02em",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          {/* Affiliate */}
          <div style={cellBase}>
            <p style={label}>Affiliate program</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 900,
                color: INK,
                margin: 0,
              }}
            >
              {platform.commissionPct}% first sale
              {platform.recurringPct > 0 && (
                <span
                  style={{ color: MINT, marginLeft: 6 }}
                >
                  · {platform.recurringPct}% recur.
                </span>
              )}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#4A4A4A",
                margin: "4px 0 8px",
              }}
            >
              Cookie:{" "}
              {platform.cookieDays === "lifetime"
                ? "Lifetime"
                : `${platform.cookieDays} days`}{" "}
              · Min payout: ${platform.minPayout}
            </p>
            <a
              href={platform.affiliateSignupUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 800,
                color: KLEIN,
                textDecoration: "underline",
                letterSpacing: ".04em",
              }}
            >
              Join program →
            </a>
          </div>
          {/* Tax forms */}
          <div style={cellBase}>
            <p style={label}>Tax forms</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {platform.forms.map((f) => (
                <span
                  key={f}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: INK,
                    background: PAPER,
                    border: `1.5px solid ${INK}`,
                    padding: "3px 7px",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function TaxComparisonTable({
  platforms,
}: {
  platforms: TaxSoftware[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [usOnly, setUsOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(key === "pricingStart");
    }
  };

  const sorted = useMemo(() => {
    let list = [...platforms];
    if (usOnly)
      list = list.filter(
        (p) => p.id === "coinledger" || p.id === "taxbit" || p.id === "zenledger"
      );
    if (freeOnly) list = list.filter((p) => p.freeTier);
    list.sort((a, b) => {
      const va = a[sortKey] as number;
      const vb = b[sortKey] as number;
      return sortAsc ? va - vb : vb - va;
    });
    return list;
  }, [platforms, sortKey, sortAsc, usOnly, freeOnly]);

  // ---- pills ----
  const Pill = ({
    label,
    active,
    onClick,
    testid,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    testid: string;
  }) => (
    <button
      onClick={onClick}
      data-testid={testid}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        padding: "6px 12px",
        background: active ? INK : "#FFFFFF",
        color: active ? PAPER : INK,
        border: `2px solid ${INK}`,
        cursor: "pointer",
        boxShadow: active ? "2px 2px 0 0 #111111" : "none",
      }}
    >
      {active ? "● " : "○ "}
      {label}
    </button>
  );

  const SortPill = ({ k, label }: { k: SortKey; label: string }) => {
    const active = sortKey === k;
    return (
      <button
        onClick={() => handleSort(k)}
        data-testid={`tax-sort-${k}`}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: ".06em",
          textTransform: "uppercase",
          padding: "6px 12px",
          background: active ? VERMILION : "#FFFFFF",
          color: INK,
          border: `2px solid ${INK}`,
          cursor: "pointer",
          boxShadow: active ? "2px 2px 0 0 #111111" : "none",
        }}
      >
        {label}
        {active ? (sortAsc ? " ↑" : " ↓") : ""}
      </button>
    );
  };

  return (
    <div data-testid="tax-comparison-table">
      {/* Filter / sort bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          padding: "12px 14px",
          background: PAPER,
          border: `2px solid ${INK}`,
          borderBottom: "none",
          boxShadow: "4px 0 0 0 #111111",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "#4A4A4A",
          }}
        >
          Filter ›
        </span>
        <Pill
          label="Free tier"
          active={freeOnly}
          onClick={() => setFreeOnly((v) => !v)}
          testid="tax-filter-free"
        />
        <Pill
          label="US focus"
          active={usOnly}
          onClick={() => setUsOnly((v) => !v)}
          testid="tax-filter-us"
        />

        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "#4A4A4A",
            marginLeft: 8,
          }}
        >
          Sort ›
        </span>
        <SortPill k="rating" label="Rating" />
        <SortPill k="pricingStart" label="Price" />
        <SortPill k="commissionPct" label="Commission" />
        <SortPill k="exchanges" label="Exchanges" />
      </div>

      {/* Table */}
      <div
        style={{
          border: `3px solid ${INK}`,
          background: "#FFFFFF",
          boxShadow: "6px 6px 0 0 #111111",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 760,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: INK,
                  color: PAPER,
                }}
              >
                {[
                  ["Platform", "left"],
                  ["Rating", "center"],
                  ["From", "center"],
                  ["Commission", "center"],
                  ["Exchanges", "center"],
                  ["DeFi", "center"],
                  ["Free", "center"],
                  ["Try", "right"],
                ].map(([label, align]) => (
                  <th
                    key={label}
                    style={{
                      textAlign: align as "left" | "center" | "right",
                      padding: "12px 14px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, idx) => {
                const isExp = expandedId === p.id;
                return (
                  <Fragment key={p.id}>
                    <tr
                      onClick={() => setExpandedId(isExp ? null : p.id)}
                      data-testid={`tax-row-${p.id}`}
                      style={{
                        background: isExp
                          ? "#FFFCE0"
                          : idx % 2 === 0
                          ? "#FFFFFF"
                          : PAPER,
                        cursor: "pointer",
                        borderBottom: `1.5px solid ${INK}`,
                      }}
                    >
                      {/* Platform */}
                      <td style={{ padding: "12px 14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              background: p.logoColor,
                              color: INK,
                              border: `2px solid ${INK}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-mono)",
                              fontSize: 13,
                              fontWeight: 900,
                              flexShrink: 0,
                            }}
                          >
                            {p.logo}
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontSize: 15,
                                  fontWeight: 800,
                                  color: INK,
                                  letterSpacing: "-.01em",
                                }}
                              >
                                {p.name}
                              </span>
                              {p.badge && (
                                <span
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    letterSpacing: ".15em",
                                    textTransform: "uppercase",
                                    padding: "2px 6px",
                                    background: p.badgeColor || CANARY,
                                    color: INK,
                                    border: `1.5px solid ${INK}`,
                                  }}
                                >
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <p
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: "#4A4A4A",
                                margin: 0,
                                letterSpacing: ".02em",
                              }}
                            >
                              {p.countries === 1
                                ? "US only"
                                : `${p.countries}+ countries`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td
                        style={{ textAlign: "center", padding: "12px 14px" }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 18,
                            fontWeight: 900,
                            color: INK,
                            margin: 0,
                          }}
                        >
                          {p.rating}
                          <span
                            style={{
                              fontSize: 11,
                              color: "#4A4A4A",
                              fontWeight: 600,
                            }}
                          >
                            /5
                          </span>
                        </p>
                      </td>

                      {/* From */}
                      <td
                        style={{ textAlign: "center", padding: "12px 14px" }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 16,
                            fontWeight: 900,
                            color: INK,
                            margin: 0,
                          }}
                        >
                          ${p.pricingStart}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "#4A4A4A",
                            margin: 0,
                            letterSpacing: ".06em",
                            textTransform: "uppercase",
                          }}
                        >
                          /yr
                        </p>
                      </td>

                      {/* Commission */}
                      <td
                        style={{ textAlign: "center", padding: "12px 14px" }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            background: MINT,
                            color: INK,
                            border: `1.5px solid ${INK}`,
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          {p.commissionPct}%
                        </span>
                        {p.recurringPct > 0 && (
                          <p
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 9,
                              color: "#4A4A4A",
                              margin: "3px 0 0",
                              letterSpacing: ".08em",
                              textTransform: "uppercase",
                            }}
                          >
                            +{p.recurringPct}% recur
                          </p>
                        )}
                      </td>

                      {/* Exchanges */}
                      <td
                        style={{ textAlign: "center", padding: "12px 14px" }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 14,
                            fontWeight: 800,
                            color: INK,
                            margin: 0,
                          }}
                        >
                          {p.exchanges}+
                        </p>
                      </td>

                      {/* DeFi */}
                      <td
                        style={{ textAlign: "center", padding: "12px 14px" }}
                      >
                        <Check val={p.defiSupport} />
                      </td>

                      {/* Free */}
                      <td
                        style={{ textAlign: "center", padding: "12px 14px" }}
                      >
                        <Check val={p.freeTier} />
                      </td>

                      {/* Try */}
                      <td
                        style={{ textAlign: "right", padding: "12px 14px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={p.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          data-testid={`tax-cta-${p.id}`}
                          style={{
                            display: "inline-block",
                            fontFamily: "var(--font-display)",
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: ".06em",
                            textTransform: "uppercase",
                            background: VERMILION,
                            color: INK,
                            border: `2px solid ${INK}`,
                            padding: "6px 12px",
                            textDecoration: "none",
                            boxShadow: "2px 2px 0 0 #111111",
                          }}
                        >
                          Try →
                        </a>
                      </td>
                    </tr>
                    {isExp && <ExpandedRow platform={p} />}
                  </Fragment>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "40px 14px",
                      textAlign: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "#4A4A4A",
                    }}
                  >
                    No platforms match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            background: INK,
            color: PAPER,
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            borderTop: `2px solid ${INK}`,
          }}
        >
          <span>
            ► Click any row to expand · Synced from official program pages
          </span>
          <Link
            href="/disclosure"
            style={{
              color: CANARY,
              textDecoration: "underline",
              textDecorationThickness: 2,
              textUnderlineOffset: 3,
            }}
          >
            Affiliate disclosure
          </Link>
        </div>
      </div>
    </div>
  );
}
