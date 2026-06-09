"use client";

import { useState } from "react";

export default function PortfolioHealthPage() {
  const [holdings, setHoldings] = useState("");
  const [exchanges, setExchanges] = useState("");
  const [coldStorage, setColdStorage] = useState("");
  const [country, setCountry] = useState("US");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const analyse = async () => {
    if (!holdings.trim()) return;
    setLoading(true);
    setResult("");

    const prompt = `Perform a crypto portfolio health check for this investor:

Holdings: ${holdings}
Exchange accounts: ${exchanges || "Not specified"}
Cold storage: ${coldStorage || "Not specified"}
Country: ${country}

Analyse and score (1-10) each area:
1. Exchange concentration risk (too much on one exchange?)
2. Custody risk (how much on exchanges vs cold storage?)
3. Tax exposure estimate (rough capital gains situation)
4. Security setup (based on what they've told me)
5. Diversification (over-concentrated in one asset?)

For each area: give a score, a 1-sentence finding, and one specific action to improve it.
End with the single most important thing they should do TODAY.

Format your response clearly with the 5 areas and a final recommendation. Be direct.`;

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
                  setResult(text);
                }
              } catch { /* */ }
            }
          }
        }
      }
    } catch {
      setResult("Unable to connect to AI service. Please ensure your ANTHROPIC_API_KEY is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">AI-powered · Holistic assessment</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Portfolio <span className="italic-serif">health check</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Get an AI assessment of your exchange risk, custody risk, tax exposure, security, and diversification — with specific actions to fix each one.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: "8px" }}>
                Your holdings (be as specific as you like)
              </label>
              <textarea value={holdings} onChange={(e) => setHoldings(e.target.value)}
                placeholder="e.g. 1.5 BTC, 10 ETH, 5000 USDC, some SOL and LINK..."
                style={{ width: "100%", height: "80px", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "12px 14px", color: "var(--paper)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", resize: "vertical" }} />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: "8px" }}>
                Which exchanges do you use?
              </label>
              <input type="text" value={exchanges} onChange={(e) => setExchanges(e.target.value)}
                placeholder="e.g. Coinbase (most), some on Binance, small amount on Kraken"
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "12px 14px", color: "var(--paper)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }} />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: "8px" }}>
                Cold storage setup (if any)
              </label>
              <input type="text" value={coldStorage} onChange={(e) => setColdStorage(e.target.value)}
                placeholder="e.g. Ledger Nano X with about 30% of my BTC"
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "12px 14px", color: "var(--paper)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }} />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: "8px" }}>
                Your country
              </label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "12px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                {["US", "UK", "EU", "Canada", "Australia", "Other"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={analyse} disabled={!holdings.trim() || loading}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: holdings.trim() && !loading ? "var(--gold)" : "var(--wire)", color: holdings.trim() && !loading ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, cursor: holdings.trim() && !loading ? "pointer" : "not-allowed", marginBottom: "24px" }}>
          {loading ? "AI is assessing your portfolio…" : "Run health check →"}
        </button>

        {/* Streaming result */}
        {(result || loading) && (
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "24px" }}>
            {loading && !result && (
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*.2}s` }} />)}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)", marginLeft: "8px" }}>Analysing your portfolio…</span>
              </div>
            )}
            {result && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div className="pulse-dot" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase" }}>Portfolio health report</span>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--paper)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{result}</div>
              </>
            )}
          </div>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.6, marginTop: "20px" }}>
          Your data stays private — we don't store or log portfolio information. Not financial or tax advice.
        </p>
      </div>
    </div>
  );
}
