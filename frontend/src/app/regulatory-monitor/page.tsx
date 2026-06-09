"use client";

import { useState } from "react";
import { EXCHANGES } from "@/data/exchanges";

const MOCK_UPDATES = [
  {
    id: "1", date: "2025-06-01", source: "SEC", region: "US",
    title: "SEC clarifies digital asset broker reporting requirements",
    summary: "The SEC issued guidance on Form 1099-DA implementation timeline. Crypto brokers must begin reporting for tax year 2026. Affects all US-registered exchanges.",
    impact: "high", affects: ["coinbase", "kraken"], category: "Tax reporting",
    actionRequired: "Users on Coinbase and Kraken will receive Form 1099-DA starting in 2026. Ensure your tax software supports this.",
  },
  {
    id: "2", date: "2025-05-20", source: "FCA", region: "UK",
    title: "FCA updates crypto asset registration requirements",
    summary: "The FCA has issued updated guidance for crypto asset businesses. Exchanges must complete enhanced KYC procedures by Q3 2025.",
    impact: "medium", affects: ["binance", "kraken"], category: "KYC / AML",
    actionRequired: "UK users may be asked to re-verify identity on affected exchanges.",
  },
  {
    id: "3", date: "2025-05-10", source: "MiCA", region: "EU",
    title: "MiCA full implementation enters phase 2",
    summary: "The EU's Markets in Crypto-Assets regulation enters its second implementation phase. Stablecoin issuers must hold 100% reserves with licensed custodians.",
    impact: "medium", affects: ["binance", "okx"], category: "MiCA / Stablecoins",
    actionRequired: "EU users should verify their exchange holds MiCA compliance certification.",
  },
  {
    id: "4", date: "2025-04-28", source: "CFTC", region: "US",
    title: "CFTC guidance on DeFi protocol classification",
    summary: "CFTC released new guidance on how automated market makers and DeFi protocols are classified under existing commodity laws.",
    impact: "low", affects: [], category: "DeFi regulation",
    actionRequired: "No immediate action required for retail users. Monitor for further developments.",
  },
];

const IMPACT_CONFIG = {
  high:   { color: "#ef4444", bg: "#ef444415", label: "High impact" },
  medium: { color: "#f59e0b", bg: "#f59e0b15", label: "Medium" },
  low:    { color: "#22c55e", bg: "#22c55e15", label: "Low" },
};

export default function RegulatoryMonitorPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");

  const filtered = regionFilter === "all" ? MOCK_UPDATES : MOCK_UPDATES.filter((u) => u.region.toLowerCase() === regionFilter.toLowerCase());

  const askRegulatory = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    const prompt = `A crypto investor asks this regulatory question: "${question}"

Answer based on current crypto regulations as of 2025. Be specific about:
- Which jurisdictions this affects
- What exchanges are impacted
- What action the user should take (if any)
- Timeline if relevant

Keep response to 3-4 sentences. Be direct and practical.`;

    try {
      const res = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value).split("\n")) {
            if (line.startsWith("data: ")) {
              try {
                const d = JSON.parse(line.slice(6));
                if (d.type === "content_block_delta" && d.delta?.text) {
                  text += d.delta.text;
                  setAnswer(text);
                }
              } catch { /* */ }
            }
          }
        }
      }
    } catch {
      setAnswer("Unable to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brutalist-page" style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">AI-monitored · Weekly updates</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Regulatory <span className="italic-serif">monitor</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "540px" }}>
            AI tracks SEC, FCA, CFTC, and MiCA updates weekly and summarises what matters for crypto investors. Ask any regulatory question in plain English.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>
          {/* Main feed */}
          <div>
            {/* Region filter */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
              {["all", "US", "UK", "EU"].map((r) => (
                <button key={r} onClick={() => setRegionFilter(r)}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 16px", borderRadius: "99px", border: `1px solid ${regionFilter === r ? "var(--gold)" : "var(--wire)"}`, background: regionFilter === r ? "var(--gold-dim)" : "transparent", color: regionFilter === r ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
                  {r === "all" ? "All regions" : r}
                </button>
              ))}
            </div>

            {/* Updates */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.map((update) => {
                const ic = IMPACT_CONFIG[update.impact as keyof typeof IMPACT_CONFIG];
                const affectedExchanges = EXCHANGES.filter((e) => update.affects.includes(e.id));
                return (
                  <div key={update.id} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "20px 22px" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "3px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", color: "var(--chrome)", border: "1px solid var(--wire)" }}>
                        {update.source}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "3px 8px", borderRadius: "99px", background: ic.bg, color: ic.color, border: `1px solid ${ic.color}30` }}>
                        {ic.label}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "3px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.05)", color: "var(--chrome)" }}>
                        {update.category}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginLeft: "auto" }}>{update.date}</span>
                    </div>

                    <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--paper)", marginBottom: "6px" }}>{update.title}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)", lineHeight: 1.6, marginBottom: "10px" }}>{update.summary}</p>

                    {/* Affected exchanges */}
                    {affectedExchanges.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>Affects:</span>
                        {affectedExchanges.map((e) => (
                          <span key={e.id} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: e.logoColor + "15", color: e.logoColor, border: `1px solid ${e.logoColor}30` }}>
                            {e.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action required */}
                    <div style={{ background: update.impact === "high" ? "#ef444410" : "rgba(255,255,255,0.04)", border: `1px solid ${update.impact === "high" ? "#ef444425" : "var(--wire)"}`, borderRadius: "8px", padding: "10px 14px" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: update.impact === "high" ? "#ef4444" : "var(--chrome)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "3px" }}>Action required</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--paper)", lineHeight: 1.5 }}>{update.actionRequired}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Q&A sidebar */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
              <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
              <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--wire)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="pulse-dot" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gold)", letterSpacing: ".1em", textTransform: "uppercase" }}>Ask a regulatory question</span>
              </div>
              <div style={{ padding: "16px" }}>
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askRegulatory()}
                  placeholder="e.g. Is Binance legal in the US?"
                  style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", outline: "none", marginBottom: "10px" }} />
                <button onClick={askRegulatory} disabled={!question.trim() || loading}
                  style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: question.trim() && !loading ? "var(--gold)" : "var(--wire)", color: question.trim() && !loading ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                  {loading ? "Checking…" : "Ask →"}
                </button>

                {answer && (
                  <div style={{ marginTop: "14px", padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--wire)" }}>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--paper)", lineHeight: 1.65 }}>{answer}</p>
                  </div>
                )}

                {/* Quick questions */}
                <div style={{ marginTop: "14px" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>Quick questions</p>
                  {["Is Binance available in the US?", "What is MiCA regulation?", "Do I need to report crypto on taxes?", "What is Form 1099-DA?"].map((q) => (
                    <button key={q} onClick={() => { setQuestion(q); }}
                      style={{ display: "block", width: "100%", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", background: "transparent", border: "none", cursor: "pointer", padding: "5px 0", lineHeight: 1.4, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", marginTop: "28px", lineHeight: 1.6 }}>
          Not legal advice. Regulatory information is for informational purposes only. Consult a qualified attorney for your specific situation. Updates sourced from official regulatory bodies.
        </p>
      </div>
    </div>
  );
}
