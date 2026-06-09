"use client";

import { useState } from "react";
import { EXCHANGES } from "@/data/exchanges";

const ASSETS = ["BTC", "ETH", "SOL", "BNB", "XRP", "USDC", "Other"];
const GOALS = ["Long-term hold (5+ years)", "Medium-term (1–3 years)", "Active trading", "Passive income/staking"];
const RISK_LEVELS = ["Conservative", "Moderate", "Aggressive"];

export default function DCAplannerPage() {
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [asset, setAsset] = useState("BTC");
  const [goal, setGoal] = useState("Long-term hold (5+ years)");
  const [risk, setRisk] = useState("Moderate");
  const [exchange, setExchange] = useState("binance");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const generate = async () => {
    setLoading(true);
    setPlan("");

    const ex = EXCHANGES.find((e) => e.id === exchange);
    const annualFees = (monthlyAmount * 12) * (ex?.takerFee ?? 0.1) / 100;

    const prompt = `Create a personalised DCA (Dollar Cost Averaging) strategy for this crypto investor:

Monthly budget: $${monthlyAmount}
Target asset: ${asset}
Investment goal: ${goal}
Risk tolerance: ${risk}
Chosen exchange: ${ex?.name} (taker fee: ${ex?.takerFee}%)
Annual fee cost at this volume: $${annualFees.toFixed(2)}

Provide:
1. Optimal DCA frequency (daily/weekly/monthly) and why
2. Specific schedule recommendation (e.g. "every Monday at 9am UTC when volatility is lower")
3. Whether to use market orders or limit orders on ${ex?.name} and why
4. One alternative exchange to consider if fees are a concern
5. Target allocation if they want to diversify beyond ${asset}

Be specific with numbers. Max 5 concise points.`;

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
                  setPlan(text);
                }
              } catch { /* */ }
            }
          }
        }
      }
    } catch {
      setPlan("Unable to connect to AI. Please ensure ANTHROPIC_API_KEY is configured.");
    } finally {
      setLoading(false);
    }
  };

  const ex = EXCHANGES.find((e) => e.id === exchange);
  const annualFees = (monthlyAmount * 12) * (ex?.takerFee ?? 0.1) / 100;
  const annualInvested = monthlyAmount * 12;

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">AI-powered · Personalised</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            DCA <span className="italic-serif">planner</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Dollar cost averaging beats timing the market 85% of the time. Get a personalised DCA schedule, optimal exchange, and fee optimisation — powered by AI.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Inputs */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Monthly budget</p>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--chrome)" }}>$</span>
                <input type="number" value={monthlyAmount} onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 12px 10px 28px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                {[100, 250, 500, 1000].map((a) => (
                  <button key={a} onClick={() => setMonthlyAmount(a)}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "3px 8px", borderRadius: "6px", border: `1px solid ${monthlyAmount === a ? "var(--gold)" : "var(--wire)"}`, background: monthlyAmount === a ? "var(--gold-dim)" : "transparent", color: monthlyAmount === a ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
                    ${a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Target asset</p>
              <select value={asset} onChange={(e) => setAsset(e.target.value)}
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                {ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Investment goal</p>
              <select value={goal} onChange={(e) => setGoal(e.target.value)}
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-body)", fontSize: "13px", outline: "none" }}>
                {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Risk tolerance</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {RISK_LEVELS.map((r) => (
                  <button key={r} onClick={() => setRisk(r)}
                    style={{ flex: 1, padding: "10px 4px", borderRadius: "10px", border: `1px solid ${risk === r ? "var(--gold)" : "var(--wire)"}`, background: risk === r ? "var(--gold-dim)" : "var(--ink-3)", color: risk === r ? "var(--gold)" : "var(--chrome)", fontFamily: "var(--font-mono)", fontSize: "10px", cursor: "pointer", textAlign: "center" }}>
                    {r.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Exchange</p>
              <select value={exchange} onChange={(e) => setExchange(e.target.value)}
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                {EXCHANGES.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.takerFee}% taker fee</option>)}
              </select>
            </div>
          </div>

          {/* Fee preview */}
          <div style={{ marginTop: "14px", padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid var(--wire)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            {[
              { label: "Annual investment", value: `$${annualInvested.toLocaleString()}` },
              { label: "Annual fees", value: `$${annualFees.toFixed(2)}` },
              { label: "Fee as % of investment", value: `${((annualFees / annualInvested) * 100).toFixed(3)}%` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", marginBottom: "2px" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--paper)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={loading}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: !loading ? "var(--gold)" : "var(--wire)", color: !loading ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, cursor: !loading ? "pointer" : "wait", marginBottom: "24px" }}>
          {loading ? "Generating your DCA plan…" : "Generate DCA plan →"}
        </button>

        {/* AI plan */}
        {plan && (
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "24px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div className="pulse-dot" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase" }}>Your personalised DCA plan</span>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--paper)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{plan}</div>

            {ex && (
              <div style={{ marginTop: "20px", padding: "14px 16px", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)", marginBottom: "2px" }}>Start DCA on {ex.name}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>{ex.bonus}</p>
                </div>
                <a href={ex.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                  style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, background: "var(--gold)", color: "var(--ink)", padding: "10px 20px", borderRadius: "99px", textDecoration: "none" }}>
                  Open {ex.name} →
                </a>
              </div>
            )}
          </div>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.6 }}>
          Not financial advice. DCA does not guarantee profit. Past performance is not indicative of future results. Affiliate disclosure: we earn commissions through exchange links.
        </p>
      </div>
    </div>
  );
}
