"use client";

import { useState } from "react";
import type { Exchange } from "@/lib/types";
import { buildAffiliateUrl } from "@/lib/utils";

interface Props {
  exchanges: Exchange[];
}

export function FeeCalculator({ exchanges }: Props) {
  const [tradeSize, setTradeSize] = useState(1000);
  const [orderType, setOrderType] = useState<"maker" | "taker">("taker");

  const results = exchanges
    .map((e) => {
      const feeRate = orderType === "maker" ? e.makerFee : e.takerFee;
      const fee = (tradeSize * feeRate) / 100;
      return { exchange: e, feeRate, fee };
    })
    .sort((a, b) => a.fee - b.fee);

  const cheapest = results[0];
  const mostExpensive = results[results.length - 1];
  const savings = mostExpensive.fee - cheapest.fee;

  return (
    <div data-testid="fee-calculator">
      {/* Inputs panel */}
      <div
        style={{
          background: "#FFFFFF",
          border: "2.5px solid #111111",
          boxShadow: "6px 6px 0 0 #111111",
          padding: 0,
          marginBottom: "32px",
        }}
      >
        {/* Diagonal stripe header */}
        <div
          style={{
            height: 12,
            background:
              "repeating-linear-gradient(-45deg, #FFD600 0 12px, #111111 12px 24px)",
            borderBottom: "2px solid #111111",
          }}
        />

        <div style={{ padding: "24px" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#FF5722",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            ● Calculator · Live
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "-.02em",
              color: "#111111",
              marginBottom: 20,
            }}
          >
            What will <span style={{ fontStyle: "italic" }}>this</span> trade cost?
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {/* Trade size */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#4A4A4A",
                  marginBottom: 8,
                }}
              >
                Trade size (USD)
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#FF5722",
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  value={tradeSize}
                  onChange={(e) => setTradeSize(Number(e.target.value))}
                  min={1}
                  step={100}
                  data-testid="fee-calc-tradesize-input"
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 32px",
                    border: "2px solid #111111",
                    background: "#FFFFFF",
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#111111",
                    outline: "none",
                    borderRadius: 0,
                  }}
                />
              </div>
              {/* Quick picks */}
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {[100, 1000, 5000, 10000].map((v) => {
                  const active = tradeSize === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setTradeSize(v)}
                      data-testid={`fee-calc-quickpick-${v}`}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "6px 12px",
                        background: active ? "#111111" : "#FFFFFF",
                        color: active ? "#F4F4F0" : "#111111",
                        border: "1.5px solid #111111",
                        cursor: "pointer",
                        letterSpacing: ".04em",
                      }}
                    >
                      ${v.toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order type */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#4A4A4A",
                  marginBottom: 8,
                }}
              >
                Order type
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["maker", "taker"] as const).map((type) => {
                  const active = orderType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      data-testid={`fee-calc-ordertype-${type}`}
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        fontFamily: "var(--font-display)",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: ".04em",
                        textTransform: "uppercase",
                        background: active ? "#FF5722" : "#FFFFFF",
                        color: "#111111",
                        border: "2px solid #111111",
                        cursor: "pointer",
                        boxShadow: active ? "3px 3px 0 0 #111111" : "none",
                        transition: "transform .12s ease, box-shadow .12s ease",
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "#4A4A4A",
                  marginTop: 8,
                  lineHeight: 1.55,
                  letterSpacing: ".02em",
                }}
              >
                {orderType === "maker"
                  ? "MAKER · limit order that adds liquidity — usually cheaper."
                  : "TAKER · market order that removes liquidity — usually pricier."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Savings callout */}
      {savings > 0 && (
        <div
          data-testid="fee-calc-savings"
          style={{
            background: "#00C853",
            border: "2.5px solid #111111",
            boxShadow: "4px 4px 0 0 #111111",
            padding: "14px 18px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              padding: "4px 10px",
              background: "#111111",
              color: "#00C853",
              flexShrink: 0,
            }}
          >
            ▲ SAVE
          </span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "#111111",
              margin: 0,
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            Use{" "}
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>
              {cheapest.exchange.name}
            </strong>{" "}
            instead of{" "}
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>
              {mostExpensive.exchange.name}
            </strong>{" "}
            and keep{" "}
            <strong
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18,
                background: "#111111",
                color: "#00C853",
                padding: "2px 8px",
              }}
            >
              ${savings.toFixed(2)}
            </strong>
            {" "}of every ${tradeSize.toLocaleString()} trade.
          </p>
        </div>
      )}

      {/* Ranked results table */}
      <div
        style={{
          background: "#FFFFFF",
          border: "2.5px solid #111111",
          boxShadow: "6px 6px 0 0 #111111",
        }}
      >
        {/* Header row */}
        <div
          style={{
            background: "#111111",
            color: "#F4F4F0",
            padding: "10px 18px",
            display: "grid",
            gridTemplateColumns: "40px minmax(140px,1.4fr) 1fr 90px 90px",
            gap: 14,
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            borderBottom: "2px solid #111111",
          }}
        >
          <span>#</span>
          <span>Exchange</span>
          <span style={{ display: "none" }} className="hide-mobile">
            Relative cost
          </span>
          <span style={{ textAlign: "right" }}>Fee</span>
          <span style={{ textAlign: "right" }}>Trade</span>
        </div>

        {results.map(({ exchange, feeRate, fee }, i) => {
          const isCheapest = i === 0;
          const isWorst = i === results.length - 1;
          const barWidth = `${(fee / (mostExpensive.fee || 1)) * 100}%`;
          const affiliateUrl = buildAffiliateUrl(
            exchange.affiliateUrl,
            exchange.id,
            "calculator"
          );
          return (
            <div
              key={exchange.id}
              data-testid={`fee-calc-row-${exchange.id}`}
              style={{
                padding: "14px 18px",
                display: "grid",
                gridTemplateColumns: "40px minmax(140px,1.4fr) 1fr 90px 90px",
                gap: 14,
                alignItems: "center",
                background: isCheapest
                  ? "#FFFCE0"
                  : i % 2 === 0
                  ? "#FFFFFF"
                  : "#F4F4F0",
                borderBottom:
                  i === results.length - 1 ? "none" : "1.5px solid #111111",
              }}
            >
              {/* Rank */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: isCheapest
                    ? "#00C853"
                    : isWorst
                    ? "#D50000"
                    : "#FFFFFF",
                  color: isWorst ? "#FFFFFF" : "#111111",
                  border: "2px solid #111111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  fontWeight: 900,
                }}
              >
                {i + 1}
              </div>

              {/* Exchange */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: exchange.logoColor,
                    border: "2px solid #111111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 14,
                    fontWeight: 900,
                    color: "#111111",
                    flexShrink: 0,
                  }}
                >
                  {exchange.logo}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#111111",
                      margin: 0,
                      letterSpacing: "-.01em",
                    }}
                  >
                    {exchange.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "#4A4A4A",
                      margin: 0,
                      letterSpacing: ".02em",
                    }}
                  >
                    {feeRate}% {orderType}
                  </p>
                </div>
                {isCheapest && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      background: "#00C853",
                      color: "#111111",
                      border: "1.5px solid #111111",
                      flexShrink: 0,
                    }}
                  >
                    Cheapest
                  </span>
                )}
              </div>

              {/* Bar */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "100%",
                    height: 14,
                    background: "#FFFFFF",
                    border: "2px solid #111111",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: barWidth,
                      height: "100%",
                      background: isCheapest
                        ? "#00C853"
                        : isWorst
                        ? "#D50000"
                        : "#FF5722",
                      transition: "width .2s ease-out",
                    }}
                  />
                </div>
              </div>

              {/* Fee */}
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#111111",
                  margin: 0,
                  textAlign: "right",
                  letterSpacing: "-.02em",
                }}
              >
                ${fee.toFixed(2)}
              </p>

              {/* CTA */}
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                data-testid={`fee-calc-cta-${exchange.id}`}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  color: "#111111",
                  background: isCheapest ? "#FFD600" : "#FFFFFF",
                  border: "2px solid #111111",
                  padding: "8px 12px",
                  textAlign: "center",
                  textDecoration: "none",
                  boxShadow: "2px 2px 0 0 #111111",
                }}
              >
                Trade →
              </a>
            </div>
          );
        })}
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: ".06em",
          color: "#4A4A4A",
          marginTop: 16,
          lineHeight: 1.6,
        }}
      >
        ► Standard-tier fees · synced nightly · affiliate links disclosed in every link.
      </p>
    </div>
  );
}
