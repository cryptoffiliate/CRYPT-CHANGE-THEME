"use client";

import { useEffect, useState } from "react";

interface TickerItem {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

interface TickerResponse {
  items: TickerItem[];
  updated_at: string;
  source: string;
}

const FALLBACK: TickerItem[] = [
  { label: "BTC/USD",        value: "$107,240", change: "+2.4%", up: true  },
  { label: "ETH/USD",        value: "$3,841",   change: "+1.8%", up: true  },
  { label: "SOL/USD",        value: "$188",     change: "+3.1%", up: true  },
  { label: "BINANCE MAKER",  value: "0.10%",    change: "",      up: true  },
  { label: "OKX MAKER",      value: "0.08%",    change: "",      up: true  },
  { label: "KRAKEN MAKER",   value: "0.16%",    change: "",      up: true  },
  { label: "COINBASE TAKER", value: "0.60%",    change: "",      up: false },
];

export function Ticker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const load = async () => {
      try {
        const res = await fetch("/api/ticker", { cache: "no-store" });
        if (!res.ok) return;
        const data: TickerResponse = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          setLive(data.source !== "fallback");
        }
      } catch {
        /* keep fallback */
      }
    };

    load();
    timer = setInterval(load, 60_000); // refresh every minute
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  // Duplicate items for seamless scroll
  const all = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden flex items-center"
      style={{
        background: "linear-gradient(180deg, #05060A 0%, #0B0E18 100%)",
        borderBottom: "1px solid var(--wire)",
        height: "32px",
        position: "relative",
      }}
      data-testid="market-ticker"
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(90deg, #05060A, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(-90deg, #05060A, transparent)", zIndex: 2, pointerEvents: "none" }} />

      {/* LIVE indicator pill */}
      <div
        data-testid="ticker-live-pill"
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: ".18em",
          padding: "2px 7px",
          borderRadius: 999,
          color: live ? "#00FF94" : "#FFC93C",
          background: live ? "rgba(0,255,148,0.10)" : "rgba(255,201,60,0.10)",
          border: `1px solid ${live ? "#00FF94" : "#FFC93C"}`,
          textShadow: live ? "0 0 8px rgba(0,255,148,0.45)" : "none",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 999, background: live ? "#00FF94" : "#FFC93C", boxShadow: `0 0 8px ${live ? "#00FF94" : "#FFC93C"}` }} />
        {live ? "LIVE" : "CACHED"}
      </div>

      <div className="flex gap-0 whitespace-nowrap ticker-track" style={{ willChange: "transform", paddingLeft: 80 }}>
        {all.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--chrome)",
              letterSpacing: ".1em",
              padding: "0 22px",
              borderRight: "1px solid var(--wire-soft)",
              gap: "10px",
            }}
            data-testid={`ticker-item-${item.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
          >
            <span style={{ color: "#5C6890", textTransform: "uppercase", fontSize: 10 }}>{item.label}</span>
            <span style={{ fontWeight: 600, color: "var(--paper)" }}>{item.value}</span>
            {item.change && (
              <span
                style={{
                  color: item.up ? "#00FF94" : "#FF3D71",
                  background: item.up ? "rgba(0,255,148,0.10)" : "rgba(255,61,113,0.10)",
                  border: `1px solid ${item.up ? "rgba(0,255,148,0.45)" : "rgba(255,61,113,0.45)"}`,
                  padding: "1px 7px",
                  fontWeight: 600,
                  fontSize: "10px",
                  borderRadius: "999px",
                  textShadow: item.up ? "0 0 8px rgba(0,255,148,0.45)" : "0 0 8px rgba(255,61,113,0.45)",
                }}
              >
                {item.change}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
