"use client";

import { useState } from "react";
import { EXCHANGES } from "@/data/exchanges";

interface MigrationPlan {
  fromExchange: string;
  toExchange: string;
  steps: Array<{ step: number; title: string; detail: string; warning?: string }>;
  estimatedCost: string;
  estimatedTime: string;
  savingsPerMonth: string;
}

export default function MigrationPlannerPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [monthlyVolume, setMonthlyVolume] = useState(5000);
  const [assets, setAssets] = useState("BTC, ETH");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MigrationPlan | null>(null);
  const [streamText, setStreamText] = useState("");

  const generate = async () => {
    if (!from || !to) return;
    setLoading(true);
    setPlan(null);
    setStreamText("");

    const fromEx = EXCHANGES.find((e) => e.id === from);
    const toEx = EXCHANGES.find((e) => e.id === to);
    if (!fromEx || !toEx) return;

    const prompt = `Create a step-by-step migration plan for moving from ${fromEx.name} to ${toEx.name}.

Context:
- Current exchange: ${fromEx.name} (maker fee: ${fromEx.makerFee}%, taker fee: ${fromEx.takerFee}%)
- Target exchange: ${toEx.name} (maker fee: ${toEx.makerFee}%, taker fee: ${toEx.takerFee}%)
- Monthly trading volume: $${monthlyVolume}
- Assets to migrate: ${assets}
- US available: ${toEx.usBased ? "Yes" : "No"}
- KYC on target: ${toEx.kyc}

Respond ONLY with valid JSON:
{
  "fromExchange": "${fromEx.name}",
  "toExchange": "${toEx.name}",
  "steps": [
    { "step": 1, "title": "Step title", "detail": "Detailed instructions", "warning": "Optional warning" }
  ],
  "estimatedCost": "e.g. $5-15 in withdrawal fees",
  "estimatedTime": "e.g. 2-4 hours",
  "savingsPerMonth": "e.g. $45/month at your volume"
}

Include 5-7 practical steps covering: account setup on target, KYC verification if needed, enabling 2FA, withdrawal from source, deposit verification, and what to watch out for.`;

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              try {
                const d = JSON.parse(line.slice(6));
                if (d.type === "content_block_delta" && d.delta?.text) {
                  fullText += d.delta.text;
                  setStreamText(fullText);
                }
              } catch { /* */ }
            }
          }
        }
      }

      const clean = fullText.replace(/```json|```/g, "").trim();
      setPlan(JSON.parse(clean));
    } catch {
      // Fallback plan
      const fromEx2 = EXCHANGES.find((e) => e.id === from)!;
      const toEx2 = EXCHANGES.find((e) => e.id === to)!;
      const monthlySavings = monthlyVolume * (fromEx2.takerFee - toEx2.takerFee) / 100;
      setPlan({
        fromExchange: fromEx2.name,
        toExchange: toEx2.name,
        estimatedCost: "$5–20 in network fees",
        estimatedTime: "2–4 hours",
        savingsPerMonth: `$${Math.abs(monthlySavings).toFixed(0)}/month`,
        steps: [
          { step: 1, title: `Create your ${toEx2.name} account`, detail: `Go to ${toEx2.name}'s official website and sign up with your email. Use our affiliate link to get ${toEx2.bonus}.` },
          { step: 2, title: "Complete identity verification", detail: `${toEx2.name} requires ${toEx2.kyc === "required" ? "full KYC — have your ID and a selfie ready. Takes 10–30 minutes." : "optional KYC — you can start trading with limits without it."}` },
          { step: 3, title: "Enable two-factor authentication", detail: "Set up Google Authenticator or a hardware key before depositing anything. This is non-negotiable.", warning: "Never skip 2FA setup — it's your primary security layer." },
          { step: 4, title: `Withdraw from ${fromEx2.name}`, detail: `Start with a small test withdrawal to verify your ${toEx2.name} address is correct. Wait for confirmation before withdrawing everything.`, warning: "Always do a small test withdrawal first — verify the address before sending your full balance." },
          { step: 5, title: "Verify deposit on target", detail: `Check your ${toEx2.name} balance. BTC confirmations: 2–6. ETH: near instant. USDT on TRC20: 1 confirmation.` },
          { step: 6, title: "Close or keep source account", detail: `You don't have to close your ${fromEx2.name} account. Keep it as a backup. Withdraw remaining fiat to your bank first.` },
        ],
      });
    } finally {
      setLoading(false);
      setStreamText("");
    }
  };

  const fromEx = EXCHANGES.find((e) => e.id === from);
  const toEx = EXCHANGES.find((e) => e.id === to);

  return (
    <div className="brutalist-page" style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">AI-powered · World first</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Exchange migration <span className="italic-serif">planner</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "500px" }}>
            Moving exchanges? Get a personalised step-by-step plan, cost estimate, and monthly savings calculation.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Inputs */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "12px", alignItems: "end", marginBottom: "16px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Moving from</p>
              <select value={from} onChange={(e) => setFrom(e.target.value)}
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: from ? "var(--paper)" : "var(--chrome)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                <option value="">Select exchange</option>
                {EXCHANGES.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.takerFee}% taker)</option>)}
              </select>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--chrome)", paddingBottom: "8px" }}>→</div>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Moving to</p>
              <select value={to} onChange={(e) => setTo(e.target.value)}
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: to ? "var(--paper)" : "var(--chrome)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                <option value="">Select exchange</option>
                {EXCHANGES.filter((e) => e.id !== from).map((e) => <option key={e.id} value={e.id}>{e.name} ({e.takerFee}% taker)</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Monthly trading volume</p>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--chrome)" }}>$</span>
                <input type="number" value={monthlyVolume} onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 12px 10px 28px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }} />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Assets to migrate</p>
              <input type="text" value={assets} onChange={(e) => setAssets(e.target.value)} placeholder="BTC, ETH, USDT…"
                style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }} />
            </div>
          </div>

          {/* Fee comparison preview */}
          {from && to && fromEx && toEx && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              {[fromEx, toEx].map((ex, i) => (
                <div key={ex.id} style={{ background: i === 1 ? "#22c55e10" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 1 ? "#22c55e30" : "var(--wire)"}`, borderRadius: "10px", padding: "12px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: i === 1 ? "#22c55e" : "var(--chrome)", marginBottom: "6px" }}>
                    {i === 0 ? "Current" : "Target"}: {ex.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--paper)" }}>
                    Taker: {ex.takerFee}% · Monthly cost: ${(monthlyVolume * ex.takerFee / 100).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button onClick={generate} disabled={!from || !to || loading}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: from && to && !loading ? "var(--gold)" : "var(--wire)", color: from && to && !loading ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, cursor: from && to && !loading ? "pointer" : "not-allowed" }}>
            {loading ? "Generating your migration plan…" : "Generate migration plan →"}
          </button>
        </div>

        {/* Streaming */}
        {loading && streamText && (
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "20px", marginBottom: "20px" }}>
            <pre style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", whiteSpace: "pre-wrap", margin: 0 }}>{streamText}</pre>
          </div>
        )}

        {/* Plan */}
        {plan && !loading && (
          <div>
            {/* Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "20px" }}>
              {[
                { label: "Estimated cost", value: plan.estimatedCost, icon: "💰" },
                { label: "Estimated time", value: plan.estimatedTime, icon: "⏱" },
                { label: "Monthly savings", value: plan.savingsPerMonth, icon: "📈" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "20px", marginBottom: "6px" }}>{icon}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--paper)", marginBottom: "2px" }}>{value}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {plan.steps.map((step) => (
                <div key={step.step} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 800, color: "var(--gold)", flexShrink: 0 }}>
                      {step.step}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--paper)", marginBottom: "6px" }}>{step.title}</p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)", lineHeight: 1.6, margin: "0 0 (step.warning ? '10px' : '0')" }}>{step.detail}</p>
                      {step.warning && (
                        <div style={{ background: "#f59e0b10", border: "1px solid #f59e0b30", borderRadius: "8px", padding: "8px 12px", marginTop: "10px" }}>
                          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#f59e0b", margin: 0 }}>⚠️ {step.warning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA to target exchange */}
            {toEx && (
              <div style={{ background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "var(--radius-lg)", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--paper)", marginBottom: "4px" }}>
                    Ready to start your migration?
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", margin: 0 }}>
                    Use our link to claim: {toEx.bonus}
                  </p>
                </div>
                <a href={toEx.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                  style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, background: "var(--gold)", color: "var(--ink)", padding: "12px 24px", borderRadius: "99px", textDecoration: "none", whiteSpace: "nowrap" }}>
                  Open {toEx.name} account →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
