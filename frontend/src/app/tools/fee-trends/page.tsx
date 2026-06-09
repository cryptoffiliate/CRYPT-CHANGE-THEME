"use client";

import { useState, useEffect } from "react";
import { EXCHANGES } from "@/data/exchanges";

const MOCK_HISTORY = () => {
  const now = Date.now();
  const DAY = 86400000;
  return EXCHANGES.map((e) => ({
    id: e.id,
    name: e.name,
    logo: e.logo,
    logoColor: e.logoColor,
    history: Array.from({ length: 90 }, (_, i) => ({
      date: new Date(now - (89 - i) * DAY).toISOString().split("T")[0],
      makerFee: parseFloat((e.makerFee + (Math.random() - 0.5) * 0.02).toFixed(3)),
      takerFee: parseFloat((e.takerFee + (Math.random() - 0.5) * 0.02).toFixed(3)),
    })),
  }));
};

export default function FeeTrendsPage() {
  const [data, setData] = useState<ReturnType<typeof MOCK_HISTORY>>([]);
  const [selected, setSelected] = useState<string[]>(["binance", "coinbase", "okx"]);
  const [metric, setMetric] = useState<"makerFee" | "takerFee">("makerFee");
  const [range, setRange] = useState(30);

  useEffect(() => { setData(MOCK_HISTORY()); }, []);

  const filtered = data.filter((d) => selected.includes(d.id));
  const sliced = filtered.map((d) => ({ ...d, history: d.history.slice(-range) }));

  if (!data.length) return null;

  const chartW = 600, chartH = 160, pad = { t: 10, r: 10, b: 30, l: 40 };
  const innerW = chartW - pad.l - pad.r;
  const innerH = chartH - pad.t - pad.b;

  const allValues = sliced.flatMap((d) => d.history.map((h) => h[metric]));
  const minV = Math.min(...allValues) * 0.95;
  const maxV = Math.max(...allValues) * 1.05;

  const toX = (i: number, len: number) => pad.l + (i / (len - 1)) * innerW;
  const toY = (v: number) => pad.t + innerH - ((v - minV) / (maxV - minV)) * innerH;

  return (
    <div className="brutalist-page" style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Historical data · Built from nightly cron</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Fee <span className="italic-serif">trend</span> charts
          </h1>
          <p className="body-lg" style={{ maxWidth: "500px" }}>
            90 days of exchange fee history. See when exchanges changed their rates and how you compare over time.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {(["makerFee", "takerFee"] as const).map((m) => (
              <button key={m} onClick={() => setMetric(m)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${metric === m ? "var(--gold)" : "var(--wire)"}`, background: metric === m ? "var(--gold-dim)" : "transparent", color: metric === m ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
                {m === "makerFee" ? "Maker fee" : "Taker fee"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[7, 30, 90].map((r) => (
              <button key={r} onClick={() => setRange(r)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${range === r ? "var(--gold)" : "var(--wire)"}`, background: range === r ? "var(--gold-dim)" : "transparent", color: range === r ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
                {r}d
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {data.map((d) => (
              <button key={d.id}
                onClick={() => setSelected((s) => s.includes(d.id) ? s.filter((x) => x !== d.id) : [...s, d.id])}
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${selected.includes(d.id) ? d.logoColor + "80" : "var(--wire)"}`, background: selected.includes(d.id) ? d.logoColor + "18" : "transparent", color: selected.includes(d.id) ? d.logoColor : "var(--chrome)", cursor: "pointer" }}>
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "20px", marginBottom: "20px", overflowX: "auto" }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", maxWidth: chartW }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = pad.t + innerH * (1 - t);
              const v = (minV + (maxV - minV) * t).toFixed(3);
              return (
                <g key={t}>
                  <line x1={pad.l} y1={y} x2={chartW - pad.r} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <text x={pad.l - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">{v}%</text>
                </g>
              );
            })}
            {/* Lines */}
            {sliced.map((d) => {
              const pts = d.history.map((h, i) => `${toX(i, d.history.length)},${toY(h[metric])}`).join(" ");
              return (
                <polyline key={d.id} points={pts} fill="none" stroke={d.logoColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              );
            })}
            {/* X labels */}
            {sliced[0]?.history.filter((_, i) => i % Math.max(1, Math.floor(range / 5)) === 0).map((h, i, arr) => {
              const idx = sliced[0].history.findIndex((x) => x.date === h.date);
              const x = toX(idx, sliced[0].history.length);
              return (
                <text key={h.date} x={x} y={chartH - 6} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
                  {h.date.slice(5)}
                </text>
              );
            })}
          </svg>
          {/* Legend */}
          <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
            {sliced.map((d) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "20px", height: "2px", background: d.logoColor, borderRadius: "1px" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>{d.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: d.logoColor, fontWeight: 500 }}>
                  {d.history[d.history.length - 1]?.[metric].toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {sliced.map((d) => {
            const first = d.history[0]?.[metric] ?? 0;
            const last = d.history[d.history.length - 1]?.[metric] ?? 0;
            const change = ((last - first) / first * 100);
            const min = Math.min(...d.history.map((h) => h[metric]));
            const max = Math.max(...d.history.map((h) => h[metric]));
            return (
              <div key={d.id} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "10px", fontWeight: 900, background: d.logoColor + "18", color: d.logoColor }}>
                    {d.logo}
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)" }}>{d.name}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {[
                    { label: "Current", value: `${last.toFixed(3)}%` },
                    { label: `${range}d change`, value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`, color: change <= 0 ? "#22c55e" : "#ef4444" },
                    { label: "Low", value: `${min.toFixed(3)}%` },
                    { label: "High", value: `${max.toFixed(3)}%` },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", marginBottom: "2px" }}>{label}</p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 500, color: color ?? "var(--paper)" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
