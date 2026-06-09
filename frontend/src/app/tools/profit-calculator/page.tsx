"use client";

import { useState } from "react";

export default function ProfitCalculatorPage() {
  const [buyPrice, setBuyPrice] = useState(40000);
  const [sellPrice, setSellPrice] = useState(50000);
  const [amount, setAmount] = useState(0.5);
  const [buyFee, setBuyFee] = useState(0.1);
  const [sellFee, setSellFee] = useState(0.1);
  const [currency, setCurrency] = useState("USD");

  const invested = buyPrice * amount;
  const buyFeeAmt = invested * (buyFee / 100);
  const proceeds = sellPrice * amount;
  const sellFeeAmt = proceeds * (sellFee / 100);
  const netProfit = proceeds - sellFeeAmt - invested - buyFeeAmt;
  const totalFees = buyFeeAmt + sellFeeAmt;
  const roi = ((netProfit / (invested + buyFeeAmt)) * 100);
  const breakEven = buyPrice * (1 + buyFee / 100) / (1 - sellFee / 100);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const isProfit = netProfit >= 0;

  return (
    <div className="brutalist-page" style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Free tool · Including fees</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Crypto profit <span className="italic-serif">calculator</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "500px" }}>
            Calculate your exact profit or loss including trading fees, with break-even analysis.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr", marginBottom: "20px" }}>
          {/* Inputs */}
          {[
            { label: "Buy price", value: buyPrice, set: setBuyPrice, prefix: "$" },
            { label: "Sell price", value: sellPrice, set: setSellPrice, prefix: "$" },
            { label: "Amount (BTC)", value: amount, set: setAmount, step: 0.001 },
            { label: "Buy fee %", value: buyFee, set: setBuyFee, step: 0.01, suffix: "%" },
            { label: "Sell fee %", value: sellFee, set: setSellFee, step: 0.01, suffix: "%" },
          ].map(({ label, value, set, prefix, suffix, step = 1 }) => (
            <div key={label} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</p>
              <div style={{ position: "relative" }}>
                {prefix && <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--chrome)" }}>{prefix}</span>}
                <input
                  type="number"
                  value={value}
                  step={step}
                  onChange={(e) => set(Number(e.target.value))}
                  style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: `10px 12px 10px ${prefix ? "28px" : "12px"}`, color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, outline: "none" }}
                />
                {suffix && <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--chrome)" }}>{suffix}</span>}
              </div>
            </div>
          ))}

          {/* Quick fee presets */}
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "8px" }}>Quick exchange</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { name: "OKX", fee: 0.08 },
                { name: "Binance", fee: 0.1 },
                { name: "Kraken", fee: 0.16 },
                { name: "Coinbase", fee: 0.6 },
              ].map(({ name, fee }) => (
                <button key={name}
                  onClick={() => { setBuyFee(fee); setSellFee(fee); }}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--wire)", background: "transparent", color: "var(--chrome)", cursor: "pointer" }}>
                  {name} ({fee}%)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ background: isProfit ? "#22c55e15" : "#ef444415", border: `1px solid ${isProfit ? "#22c55e40" : "#ef444440"}`, borderRadius: "var(--radius-xl)", padding: "28px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: isProfit ? "#22c55e" : "#ef4444", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "8px" }}>
            {isProfit ? "Profit" : "Loss"}
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 800, color: isProfit ? "#22c55e" : "#ef4444", margin: "0 0 4px", letterSpacing: "-2px" }}>
            {isProfit ? "+" : ""}{fmt(netProfit)} {currency}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--chrome)", margin: 0 }}>
            ROI: {isProfit ? "+" : ""}{roi.toFixed(2)}%
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "20px" }}>
          {[
            { label: "Total invested",  value: `$${fmt(invested + buyFeeAmt)}` },
            { label: "Total proceeds",  value: `$${fmt(proceeds - sellFeeAmt)}` },
            { label: "Total fees paid", value: `$${fmt(totalFees)}`, note: "both sides" },
            { label: "Break-even price", value: `$${fmt(breakEven)}` },
            { label: "Gain before fees", value: `$${fmt(proceeds - invested)}` },
            { label: "Fee drag",         value: `-${((totalFees / invested) * 100).toFixed(3)}%` },
          ].map(({ label, value, note }) => (
            <div key={label} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-md)", padding: "14px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: 500, color: "var(--paper)", margin: 0 }}>{value}</p>
              {note && <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", margin: "2px 0 0" }}>{note}</p>}
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.5 }}>
          Not financial advice. Does not account for tax. For tax calculation, see our{" "}
          <a href="/tax-software" style={{ color: "var(--gold)" }}>crypto tax software guide →</a>
        </p>
      </div>
    </div>
  );
}
