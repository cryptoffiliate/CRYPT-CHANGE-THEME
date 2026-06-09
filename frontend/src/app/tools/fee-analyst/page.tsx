"use client";

import { useState, useRef } from "react";

interface FeeRow {
  date: string;
  exchange: string;
  type: string;
  amount: string;
  fee: string;
  feeCurrency: string;
}

export default function FeeAnalystPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<FeeRow[]>([]);
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): FeeRow[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/"/g, ""));
    return lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: any = {};
      headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
      // Map common column names
      return {
        date: row.date ?? row.time ?? row.timestamp ?? "",
        exchange: row.exchange ?? row.platform ?? row.market ?? "Unknown",
        type: row.type ?? row.side ?? row.action ?? "",
        amount: row.amount ?? row.quantity ?? row.size ?? "0",
        fee: row.fee ?? row["fee amount"] ?? row.commission ?? "0",
        feeCurrency: row["fee currency"] ?? row.feecurrency ?? row["fee asset"] ?? "USD",
      };
    }).filter((r) => r.fee && parseFloat(r.fee) > 0);
  };

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRows(parseCSV(text));
    };
    reader.readAsText(f);
  };

  const analyse = async () => {
    if (!rows.length) return;
    setAnalysing(true);
    setResult("");

    const totalFees = rows.reduce((sum, r) => sum + (parseFloat(r.fee) || 0), 0);
    const byExchange: Record<string, number> = {};
    rows.forEach((r) => {
      byExchange[r.exchange] = (byExchange[r.exchange] ?? 0) + (parseFloat(r.fee) || 0);
    });
    const topExchange = Object.entries(byExchange).sort(([, a], [, b]) => b - a)[0];
    const tradeCount = rows.length;

    const prompt = `Analyse this crypto trading history and give specific fee optimisation advice:

Total fees paid: $${totalFees.toFixed(2)} across ${tradeCount} trades
Fee breakdown by exchange/platform: ${JSON.stringify(byExchange, null, 2)}
Most expensive: ${topExchange?.[0]} ($${topExchange?.[1]?.toFixed(2)})

Sample of trades:
${rows.slice(0, 10).map((r) => `${r.date}: ${r.exchange} ${r.type} ${r.amount} — fee: ${r.fee} ${r.feeCurrency}`).join("\n")}

Provide:
1. Exactly how much they overpaid vs using the cheapest equivalent exchange
2. Which exchange they should switch to and why (Binance 0.1%, OKX 0.08%, Kraken 0.16%, Coinbase 0.6%)
3. One specific actionable change they can make today to reduce fees
4. Estimated annual savings if they make that change

Be direct and specific with numbers. Max 5 sentences.`;

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
      setResult(`Based on your ${tradeCount} trades, you paid $${totalFees.toFixed(2)} in fees. Your highest-cost exchange was ${topExchange?.[0]} ($${topExchange?.[1]?.toFixed(2)}). Switching to OKX (0.08% maker fee) could significantly reduce your costs. Consider moving your most frequent trading pairs to OKX or Binance for immediate savings.`);
    } finally {
      setAnalysing(false);
    }
  };

  const totalFees = rows.reduce((sum, r) => sum + (parseFloat(r.fee) || 0), 0);
  const byExchange: Record<string, number> = {};
  rows.forEach((r) => { byExchange[r.exchange] = (byExchange[r.exchange] ?? 0) + (parseFloat(r.fee) || 0); });

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">AI-native · World first</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            AI fee <span className="italic-serif">analyst</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Upload your trade history CSV from any exchange. Our AI calculates exactly how much you overpaid, which exchange you should use instead, and your potential annual savings.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "var(--gold)" : file ? "#22c55e40" : "var(--wire)"}`,
            borderRadius: "var(--radius-xl)", padding: "40px 24px", textAlign: "center",
            cursor: "pointer", transition: "all .2s", marginBottom: "20px",
            background: dragging ? "var(--gold-dim)" : file ? "#22c55e08" : "var(--ink-2)",
          }}
        >
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>{file ? "✅" : "📊"}</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--paper)", marginBottom: "6px" }}>
            {file ? file.name : "Drop your trade history CSV here"}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)" }}>
            {file ? `${rows.length} fee transactions detected · $${totalFees.toFixed(2)} total fees` : "Supports Binance, Coinbase, Kraken, Bybit, OKX exports · or click to browse"}
          </p>
        </div>

        {/* How to export */}
        {!file && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "24px" }}>
            {[
              { exchange: "Binance", path: "Orders → Trade History → Export" },
              { exchange: "Coinbase", path: "Reports → Generate → Transaction History" },
              { exchange: "Kraken", path: "History → Export → Trades" },
              { exchange: "Bybit", path: "Orders → Order History → Export" },
            ].map(({ exchange, path }) => (
              <div key={exchange} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: "var(--paper)", marginBottom: "4px" }}>{exchange}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", lineHeight: 1.4 }}>{path}</p>
              </div>
            ))}
          </div>
        )}

        {/* Fee breakdown preview */}
        {rows.length > 0 && (
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "20px", marginBottom: "16px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: "14px" }}>Fee breakdown by exchange</p>
            {Object.entries(byExchange).sort(([, a], [, b]) => b - a).map(([exchange, total]) => {
              const pct = (total / totalFees) * 100;
              return (
                <div key={exchange} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 600, color: "var(--paper)" }}>{exchange}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)" }}>${total.toFixed(2)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--gold)", borderRadius: "99px" }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--wire)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>Total fees across {rows.length} trades</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--paper)" }}>${totalFees.toFixed(2)}</span>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <button onClick={analyse} disabled={analysing}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: !analysing ? "var(--gold)" : "var(--wire)", color: !analysing ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, cursor: !analysing ? "pointer" : "wait", marginBottom: "20px" }}>
            {analysing ? "AI is analysing your fees…" : "Analyse my fees with AI →"}
          </button>
        )}

        {/* AI Result */}
        {result && (
          <div style={{ background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "var(--radius-xl)", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div className="pulse-dot" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase" }}>AI fee analysis</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--paper)", lineHeight: 1.7 }}>{result}</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href="https://www.okx.com/join/CRYPTOFFILIATE" target="_blank" rel="noopener noreferrer sponsored"
                style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, background: "#00B578", color: "white", padding: "10px 20px", borderRadius: "99px", textDecoration: "none" }}>
                Switch to OKX (0.08% fees) →
              </a>
              <a href="https://www.binance.com/en/register?ref=CRYPTOFFILIATE" target="_blank" rel="noopener noreferrer sponsored"
                style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: "#F0B90B", padding: "10px 20px", borderRadius: "99px", border: "1px solid #F0B90B40", background: "#F0B90B10", textDecoration: "none" }}>
                Switch to Binance →
              </a>
            </div>
          </div>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.6, marginTop: "20px" }}>
          Your CSV is processed locally in your browser. We never upload or store your trading history. Affiliate disclosure: we earn commissions if you switch exchanges via our links.
        </p>
      </div>
    </div>
  );
}
