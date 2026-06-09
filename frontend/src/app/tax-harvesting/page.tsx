"use client";

import { useState } from "react";

interface Holding {
  id: string;
  asset: string;
  amount: string;
  buyPrice: string;
  currentPrice: string;
}

interface HarvestOpportunity {
  asset: string;
  unrealisedLoss: number;
  lossPercent: number;
  taxSaving: string;
  recommendation: string;
  washSaleWarning: boolean;
}

export default function TaxHarvestingPage() {
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: "1", asset: "BTC", amount: "0.5", buyPrice: "68000", currentPrice: "107000" },
    { id: "2", asset: "ETH", amount: "2", buyPrice: "4200", currentPrice: "3841" },
    { id: "3", asset: "SOL", amount: "50", buyPrice: "220", currentPrice: "188" },
  ]);
  const [taxRate, setTaxRate] = useState(30);
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState<string>("");
  const [opportunities, setOpportunities] = useState<HarvestOpportunity[]>([]);

  const addHolding = () => {
    setHoldings((h) => [...h, { id: Date.now().toString(), asset: "", amount: "", buyPrice: "", currentPrice: "" }]);
  };

  const updateHolding = (id: string, field: keyof Holding, value: string) => {
    setHoldings((h) => h.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeHolding = (id: string) => {
    setHoldings((h) => h.filter((item) => item.id !== id));
  };

  const analyse = async () => {
    const validHoldings = holdings.filter((h) => h.asset && h.amount && h.buyPrice && h.currentPrice);
    if (!validHoldings.length) return;

    setAnalysing(true);
    setResult("");
    setOpportunities([]);

    // Calculate opportunities client-side first
    const opps: HarvestOpportunity[] = validHoldings
      .map((h) => {
        const amount = parseFloat(h.amount);
        const buyPrice = parseFloat(h.buyPrice);
        const currentPrice = parseFloat(h.currentPrice);
        const costBasis = amount * buyPrice;
        const currentValue = amount * currentPrice;
        const unrealisedLoss = currentValue - costBasis;
        const lossPercent = ((currentPrice - buyPrice) / buyPrice) * 100;
        const taxSaving = Math.abs(unrealisedLoss) * (taxRate / 100);
        return {
          asset: h.asset.toUpperCase(),
          unrealisedLoss,
          lossPercent,
          taxSaving: `$${taxSaving.toFixed(2)}`,
          recommendation: unrealisedLoss < 0
            ? `Sell ${amount} ${h.asset.toUpperCase()} to realise $${Math.abs(unrealisedLoss).toFixed(2)} loss`
            : `Hold — this position is in profit ($${unrealisedLoss.toFixed(2)})`,
          washSaleWarning: unrealisedLoss < 0,
        };
      })
      .filter((o) => o.unrealisedLoss < 0)
      .sort((a, b) => a.unrealisedLoss - b.unrealisedLoss);

    setOpportunities(opps);

    // Get AI analysis
    try {
      const totalLoss = opps.reduce((sum, o) => sum + o.unrealisedLoss, 0);
      const totalSaving = Math.abs(totalLoss) * (taxRate / 100);

      const prompt = `A crypto investor has the following holdings and wants tax-loss harvesting advice:

Holdings:
${validHoldings.map((h) => `- ${h.amount} ${h.asset}: bought at $${h.buyPrice}, current price $${h.currentPrice}`).join("\n")}

Tax rate: ${taxRate}%
Total unrealised losses available to harvest: $${Math.abs(totalLoss).toFixed(2)}
Potential tax saving: $${totalSaving.toFixed(2)}

Give 3-4 sentences of practical advice on:
1. Which positions to harvest (note: crypto has NO wash sale rule in the US unlike stocks)
2. Year-end deadline considerations
3. Whether to buy back immediately after selling
4. Which tax software to use to report this correctly

Be direct and specific.`;

      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });

      const reader = response.body?.getReader();
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
    } catch { /* fallback to calculated results */ }
    finally { setAnalysing(false); }
  };

  const totalLoss = opportunities.reduce((sum, o) => sum + o.unrealisedLoss, 0);
  const totalSaving = Math.abs(totalLoss) * (taxRate / 100);

  return (
    <div className="brutalist-page" style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">AI-powered · Year-end optimisation</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Tax-loss <span className="italic-serif">harvesting</span> scanner
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Enter your crypto holdings. We'll identify which positions to sell before year-end to offset gains and reduce your tax bill — and unlike stocks, crypto has no wash sale rule.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Tax rate */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "14px 18px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)" }}>Your estimated tax rate:</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {[15, 20, 25, 30, 37, 45].map((rate) => (
              <button key={rate} onClick={() => setTaxRate(rate)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "5px 12px", borderRadius: "99px", border: `1px solid ${taxRate === rate ? "var(--gold)" : "var(--wire)"}`, background: taxRate === rate ? "var(--gold-dim)" : "transparent", color: taxRate === rate ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Holdings table */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--wire)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".1em" }}>Your holdings</span>
            <button onClick={addHolding}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gold)", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer" }}>
              + Add asset
            </button>
          </div>
          <div style={{ padding: "10px" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "8px", padding: "6px 8px", marginBottom: "4px" }}>
              {["Asset", "Amount", "Buy price", "Current", ""].map((h) => (
                <span key={h} style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".08em" }}>{h}</span>
              ))}
            </div>
            {holdings.map((h) => {
              const buyP = parseFloat(h.buyPrice) || 0;
              const curP = parseFloat(h.currentPrice) || 0;
              const pnl = curP > 0 && buyP > 0 ? ((curP - buyP) / buyP * 100) : 0;
              const isLoss = pnl < 0;
              return (
                <div key={h.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "8px", padding: "6px 8px", borderRadius: "8px", background: isLoss && h.currentPrice ? "#ef444408" : "transparent", marginBottom: "4px" }}>
                  <input value={h.asset} onChange={(e) => updateHolding(h.id, "asset", e.target.value)} placeholder="BTC"
                    style={{ background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "8px", padding: "8px 10px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500, outline: "none" }} />
                  <input type="number" value={h.amount} onChange={(e) => updateHolding(h.id, "amount", e.target.value)} placeholder="0.5"
                    style={{ background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "8px", padding: "8px 10px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", outline: "none" }} />
                  <input type="number" value={h.buyPrice} onChange={(e) => updateHolding(h.id, "buyPrice", e.target.value)} placeholder="40000"
                    style={{ background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "8px", padding: "8px 10px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", outline: "none" }} />
                  <div style={{ position: "relative" }}>
                    <input type="number" value={h.currentPrice} onChange={(e) => updateHolding(h.id, "currentPrice", e.target.value)} placeholder="50000"
                      style={{ width: "100%", background: "var(--ink-3)", border: `1px solid ${isLoss && h.currentPrice ? "#ef444450" : "var(--wire)"}`, borderRadius: "8px", padding: "8px 10px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", outline: "none" }} />
                    {h.currentPrice && h.buyPrice && (
                      <span style={{ position: "absolute", right: "-50px", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "10px", color: isLoss ? "#ef4444" : "#22c55e", whiteSpace: "nowrap" }}>
                        {isLoss ? "" : "+"}{pnl.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <button onClick={() => removeHolding(h.id)}
                    style={{ background: "transparent", border: "none", color: "var(--chrome)", cursor: "pointer", fontSize: "16px", padding: "4px 8px" }}>×</button>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={analyse} disabled={analysing || !holdings.some((h) => h.asset && h.currentPrice)}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: !analysing ? "var(--gold)" : "var(--wire)", color: !analysing ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, cursor: !analysing ? "pointer" : "wait", marginBottom: "24px" }}>
          {analysing ? "Scanning for opportunities…" : "Find tax-loss harvesting opportunities →"}
        </button>

        {/* Results */}
        {opportunities.length > 0 && (
          <>
            {/* Summary banner */}
            <div style={{ background: "#22c55e15", border: "1px solid #22c55e40", borderRadius: "var(--radius-xl)", padding: "20px 24px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#22c55e", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Potential tax saving</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 800, color: "#22c55e", letterSpacing: "-1px" }}>${totalSaving.toFixed(2)}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>by harvesting ${Math.abs(totalLoss).toFixed(2)} in losses at {taxRate}% tax rate</p>
              </div>
              <div style={{ background: "#22c55e20", borderRadius: "12px", padding: "12px 16px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#22c55e", marginBottom: "2px" }}>No wash sale rule</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>You can buy back immediately</p>
              </div>
            </div>

            {/* Opportunities */}
            {opportunities.map((opp) => (
              <div key={opp.asset} style={{ background: "var(--ink-2)", border: "1px solid #ef444430", borderRadius: "var(--radius-lg)", padding: "16px 18px", marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--paper)", marginBottom: "2px" }}>{opp.asset}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#ef4444" }}>{opp.lossPercent.toFixed(1)}% down · ${Math.abs(opp.unrealisedLoss).toFixed(2)} loss</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "2px" }}>Tax saving</p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "#22c55e" }}>{opp.taxSaving}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--chrome)", lineHeight: 1.5 }}>{opp.recommendation}</p>
              </div>
            ))}

            {/* AI insight */}
            {result && (
              <div style={{ background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "var(--radius-lg)", padding: "18px 20px", marginTop: "16px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "10px" }}>AI tax advisor</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--paper)", lineHeight: 1.65 }}>{result}</p>
              </div>
            )}

            {/* Tax software CTA */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href="https://koinly.io/?via=CRYPTOFFILIATE" target="_blank" rel="noopener noreferrer sponsored"
                style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, background: "#4CAF50", color: "white", padding: "10px 20px", borderRadius: "99px", textDecoration: "none" }}>
                File with Koinly →
              </a>
              <a href="https://coinledger.io?via=cryptoffiliate" target="_blank" rel="noopener noreferrer sponsored"
                style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#2563EB", padding: "10px 20px", borderRadius: "99px", border: "1px solid #2563EB40", background: "#2563EB10", textDecoration: "none" }}>
                File with CoinLedger →
              </a>
            </div>
          </>
        )}

        {opportunities.length === 0 && holdings.some((h) => h.currentPrice && !analysing) && holdings.every((h) => {
          const pnl = (parseFloat(h.currentPrice) - parseFloat(h.buyPrice)) / parseFloat(h.buyPrice);
          return pnl >= 0;
        }) && (
          <div style={{ background: "#22c55e10", border: "1px solid #22c55e30", borderRadius: "var(--radius-lg)", padding: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", marginBottom: "8px" }}>🚀</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "#22c55e", marginBottom: "4px" }}>All positions in profit!</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--chrome)" }}>No loss-harvesting opportunities at current prices. Consider reviewing before year-end if prices change.</p>
          </div>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.6, marginTop: "24px" }}>
          Not tax advice. Crypto tax-loss harvesting rules vary by jurisdiction. Consult a CPA for your specific situation. In the US, there is no wash sale rule for crypto (as of 2025).
        </p>
      </div>
    </div>
  );
}
