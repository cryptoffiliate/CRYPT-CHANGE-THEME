"use client";

import { useState, useEffect } from "react";
import { EXCHANGES } from "@/data/exchanges";

interface VolumeData {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  volume24h: number;
  volumeChange: number;
  marketShare: number;
  trades24h: number;
  avgTradeSize: number;
  affiliateUrl: string;
  commission: string;
  rank: number;
}

// Mock realistic volume data based on known market positions
const BASE_VOLUMES: Record<string, number> = {
  binance:  28500000000,
  okx:       3800000000,
  bybit:     4200000000,
  coinbase:  2100000000,
  kraken:     980000000,
};

function generateVolumes(): VolumeData[] {
  const total = Object.values(BASE_VOLUMES).reduce((s, v) => s + v, 0);
  return EXCHANGES
    .map((e) => {
      const base = BASE_VOLUMES[e.id] ?? 500000000;
      const variation = 1 + (Math.random() - 0.5) * 0.1;
      const volume = base * variation;
      const change = (Math.random() - 0.45) * 20;
      return {
        id: e.id, name: e.name, logo: e.logo, logoColor: e.logoColor,
        volume24h: volume,
        volumeChange: change,
        marketShare: (volume / total) * 100,
        trades24h: Math.floor(volume / (500 + Math.random() * 2000)),
        avgTradeSize: 500 + Math.random() * 2000,
        affiliateUrl: e.affiliateUrl,
        commission: e.commission,
        rank: 0,
      };
    })
    .sort((a, b) => b.volume24h - a.volume24h)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${(n / 1e3).toFixed(0)}K`;
}

export default function VolumePage() {
  const [data, setData] = useState<VolumeData[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [animating, setAnimating] = useState(false);

  const refresh = () => {
    setAnimating(true);
    setTimeout(() => {
      setData(generateVolumes());
      setLastUpdate(new Date().toLocaleTimeString());
      setAnimating(false);
    }, 600);
  };

  useEffect(() => {
    setData(generateVolumes());
    setLastUpdate(new Date().toLocaleTimeString());
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  const maxVol = data[0]?.volume24h ?? 1;
  const totalVol = data.reduce((s, d) => s + d.volume24h, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Updated every 30 seconds</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Volume <span className="italic-serif">league table</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            24-hour trading volume rankings across all major exchanges. Market share tells you where the liquidity — and the arbitrage opportunities — really are.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        {/* Total market */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "28px" }}>
          {[
            { label: "Total 24h volume", value: fmt(totalVol), icon: "📊" },
            { label: "Exchanges tracked", value: `${data.length}`, icon: "🏦" },
            { label: "Largest share", value: `${data[0]?.marketShare.toFixed(1)}%`, icon: "👑" },
            { label: "Last updated", value: lastUpdate, icon: "🔄" },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
              <p style={{ fontSize: "18px", marginBottom: "6px" }}>{icon}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--paper)", marginBottom: "2px" }}>{value}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Refresh button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
          <button onClick={refresh} disabled={animating}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gold)", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "99px", padding: "6px 16px", cursor: "pointer" }}>
            {animating ? "Refreshing…" : "↻ Refresh"}
          </button>
        </div>

        {/* League table */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--wire)" }}>
                {["#", "Exchange", "24h Volume", "Share", "Change", "Trades", "Avg size", "Commission", "Trade"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" ? "center" : "left", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".1em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: animating ? 0.5 : 1, transition: "opacity .3s" }}>
                  {/* Rank */}
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: row.rank <= 3 ? "16px" : "13px", fontWeight: 700, color: row.rank === 1 ? "#F0B90B" : row.rank === 2 ? "#C0C0C0" : row.rank === 3 ? "#CD7F32" : "var(--chrome)" }}>
                      {row.rank <= 3 ? ["🥇","🥈","🥉"][row.rank-1] : row.rank}
                    </span>
                  </td>

                  {/* Exchange */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "10px", fontWeight: 900, background: row.logoColor + "18", color: row.logoColor, flexShrink: 0 }}>
                        {row.logo}
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)" }}>{row.name}</span>
                    </div>
                  </td>

                  {/* Volume */}
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--paper)", marginBottom: "4px" }}>{fmt(row.volume24h)}</p>
                    <div style={{ height: "3px", width: `${Math.max(4, (row.volume24h / maxVol) * 100)}%`, maxWidth: "120px", background: row.logoColor, borderRadius: "99px", opacity: 0.7 }} />
                  </td>

                  {/* Market share */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--paper)" }}>{row.marketShare.toFixed(1)}%</span>
                  </td>

                  {/* Change */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: row.volumeChange >= 0 ? "#22c55e" : "#ef4444" }}>
                      {row.volumeChange >= 0 ? "+" : ""}{row.volumeChange.toFixed(1)}%
                    </span>
                  </td>

                  {/* Trades */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)" }}>{row.trades24h.toLocaleString()}</span>
                  </td>

                  {/* Avg size */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)" }}>${row.avgTradeSize.toFixed(0)}</span>
                  </td>

                  {/* Commission */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "#22c55e" }}>{row.commission}</span>
                  </td>

                  {/* CTA */}
                  <td style={{ padding: "14px 16px" }}>
                    <a href={row.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                      style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, color: row.logoColor, background: row.logoColor + "10", border: `1px solid ${row.logoColor}40`, borderRadius: "8px", padding: "6px 12px", textDecoration: "none", whiteSpace: "nowrap" }}>
                      Trade →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid var(--wire)", fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>
            Volume data is estimated and for informational purposes only. Affiliate disclosure: we earn commissions through Trade links.
          </div>
        </div>
      </div>
    </div>
  );
}
