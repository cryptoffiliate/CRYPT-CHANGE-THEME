"use client";

import { useState } from "react";
import { EXCHANGES } from "@/data/exchanges";

const RESTRICTIONS: Record<string, { restricted: string[]; notes: Record<string, string> }> = {
  US: {
    restricted: ["binance", "bybit", "okx"],
    notes: {
      binance: "Binance.US is a separate entity with fewer features",
      bybit: "Not available to US residents",
      okx: "Not available to US residents",
      coinbase: "Fully licensed, FDIC-insured USD balances",
      kraken: "Licensed in multiple US states",
    },
  },
  UK: {
    restricted: [],
    notes: { binance: "FCA registration required — check current status" },
  },
  EU: {
    restricted: [],
    notes: { binance: "MiCA regulation applies from 2025" },
  },
  CA: {
    restricted: ["binance"],
    notes: { binance: "Withdrew from Canadian market in 2023" },
  },
  AU: {
    restricted: [],
    notes: {},
  },
  CN: {
    restricted: ["binance", "coinbase", "kraken", "bybit", "okx"],
    notes: { binance: "Crypto trading banned in mainland China since 2021" },
  },
  SG: {
    restricted: [],
    notes: { binance: "MAS licensing requirements apply" },
  },
};

const COUNTRIES = [
  { code: "US", name: "United States 🇺🇸" },
  { code: "UK", name: "United Kingdom 🇬🇧" },
  { code: "EU", name: "European Union 🇪🇺" },
  { code: "CA", name: "Canada 🇨🇦" },
  { code: "AU", name: "Australia 🇦🇺" },
  { code: "CN", name: "China 🇨🇳" },
  { code: "SG", name: "Singapore 🇸🇬" },
  { code: "OTHER", name: "Other / Global 🌍" },
];

export default function JurisdictionCheckerPage() {
  const [country, setCountry] = useState("");

  const rules = country ? (RESTRICTIONS[country] ?? { restricted: [], notes: {} }) : null;

  const available = rules ? EXCHANGES.filter((e) => !rules.restricted.includes(e.id)) : [];
  const blocked = rules ? EXCHANGES.filter((e) => rules.restricted.includes(e.id)) : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Regulatory intelligence</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Jurisdiction <span className="italic-serif">checker</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "500px" }}>
            Select your country to instantly see which exchanges you can legally use and any important regulatory notes.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Country selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", marginBottom: "32px" }}>
          {COUNTRIES.map(({ code, name }) => (
            <button
              key={code}
              onClick={() => setCountry(code)}
              style={{
                padding: "14px 16px", borderRadius: "var(--radius-lg)", textAlign: "left",
                border: `1px solid ${country === code ? "var(--gold)" : "var(--wire)"}`,
                background: country === code ? "var(--gold-dim)" : "var(--ink-2)",
                color: country === code ? "var(--gold)" : "var(--paper)",
                fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: country === code ? 700 : 400,
                cursor: "pointer", transition: "all .15s",
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Results */}
        {rules && country && (
          <>
            {/* Available */}
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "#22c55e", marginBottom: "12px" }}>
              ✅ Available in {COUNTRIES.find((c) => c.code === country)?.name} ({available.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {available.map((e) => (
                <div key={e.id} style={{ background: "#22c55e10", border: "1px solid #22c55e25", borderRadius: "var(--radius-lg)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "10px", fontWeight: 900, background: e.logoColor + "18", color: e.logoColor }}>
                      {e.logo}
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)", margin: "0 0 2px" }}>{e.name}</p>
                      {rules.notes[e.id] && (
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#f59e0b", margin: 0 }}>ℹ️ {rules.notes[e.id]}</p>
                      )}
                    </div>
                  </div>
                  <a href={e.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                    style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: e.logoColor, textDecoration: "none", background: e.logoColor + "15", border: `1px solid ${e.logoColor}40`, borderRadius: "8px", padding: "6px 14px", flexShrink: 0 }}>
                    {e.bonus}
                  </a>
                </div>
              ))}
            </div>

            {/* Blocked */}
            {blocked.length > 0 && (
              <>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "#ef4444", marginBottom: "12px" }}>
                  🚫 Restricted in {COUNTRIES.find((c) => c.code === country)?.name} ({blocked.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {blocked.map((e) => (
                    <div key={e.id} style={{ background: "#ef444410", border: "1px solid #ef444425", borderRadius: "var(--radius-lg)", padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "10px", fontWeight: 900, background: "rgba(255,255,255,0.05)", color: "var(--chrome)", opacity: 0.5 }}>
                          {e.logo}
                        </div>
                        <div>
                          <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--chrome)", margin: "0 0 2px", textDecoration: "line-through" }}>{e.name}</p>
                          {rules.notes[e.id] && (
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#ef4444", margin: 0 }}>{rules.notes[e.id]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.6, marginTop: "24px" }}>
              Regulatory status can change. Always verify with the exchange and consult a legal professional for your specific situation. Not legal advice.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
