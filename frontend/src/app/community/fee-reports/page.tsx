"use client";

import { useState, useEffect } from "react";
import { EXCHANGES } from "@/data/exchanges";

interface FeeReport {
  id: string;
  exchangeId: string;
  exchangeName: string;
  reportedFee: number;
  advertisedFee: number;
  tradeSize: number;
  tradeType: string;
  note: string;
  createdAt: string;
  upvotes: number;
}

const MOCK_REPORTS: FeeReport[] = [
  { id: "1", exchangeId: "coinbase", exchangeName: "Coinbase", reportedFee: 1.49, advertisedFee: 0.6, tradeSize: 200, tradeType: "market", note: "Used the simple buy interface — hidden spread makes it way more than advertised", createdAt: "2025-06-01", upvotes: 47 },
  { id: "2", exchangeId: "binance", exchangeName: "Binance", reportedFee: 0.1, advertisedFee: 0.1, tradeSize: 5000, tradeType: "market", note: "Spot on. Advanced trading interface, market order, matches advertised rate exactly.", createdAt: "2025-05-28", upvotes: 23 },
  { id: "3", exchangeId: "okx", exchangeName: "OKX", reportedFee: 0.08, advertisedFee: 0.08, tradeSize: 3000, tradeType: "limit", note: "Limit order, maker fee as advertised. OKX is consistently accurate.", createdAt: "2025-05-25", upvotes: 18 },
  { id: "4", exchangeId: "kraken", exchangeName: "Kraken", reportedFee: 0.26, advertisedFee: 0.26, tradeSize: 1000, tradeType: "market", note: "Taker fee correct. Good transparency.", createdAt: "2025-05-20", upvotes: 12 },
  { id: "5", exchangeId: "coinbase", exchangeName: "Coinbase", reportedFee: 2.1, advertisedFee: 0.6, tradeSize: 50, tradeType: "market", note: "Small trade with debit card — the fee is brutal on small amounts. Nearly 4%!", createdAt: "2025-05-18", upvotes: 61 },
];

export default function CommunityFeeReportsPage() {
  const [reports, setReports] = useState<FeeReport[]>(MOCK_REPORTS);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ exchangeId: "", reportedFee: "", tradeSize: "", tradeType: "market", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = filter === "all" ? reports : reports.filter((r) => r.exchangeId === filter);

  const submit = async () => {
    if (!form.exchangeId || !form.reportedFee) return;
    setSubmitting(true);
    const exchange = EXCHANGES.find((e) => e.id === form.exchangeId);
    await new Promise((r) => setTimeout(r, 800));
    const newReport: FeeReport = {
      id: Date.now().toString(),
      exchangeId: form.exchangeId,
      exchangeName: exchange?.name ?? form.exchangeId,
      reportedFee: parseFloat(form.reportedFee),
      advertisedFee: form.tradeType === "market" ? (exchange?.takerFee ?? 0) : (exchange?.makerFee ?? 0),
      tradeSize: parseFloat(form.tradeSize) || 0,
      tradeType: form.tradeType,
      note: form.note,
      createdAt: new Date().toISOString().split("T")[0],
      upvotes: 0,
    };
    setReports((prev) => [newReport, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setForm({ exchangeId: "", reportedFee: "", tradeSize: "", tradeType: "market", note: "" });
    setSubmitting(false);
  };

  const upvote = (id: string) => {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  const avgGap = (exId: string) => {
    const ex = reports.filter((r) => r.exchangeId === exId);
    if (!ex.length) return null;
    const gap = ex.reduce((sum, r) => sum + (r.reportedFee - r.advertisedFee), 0) / ex.length;
    return gap;
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Community data · World first</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Community fee <span className="italic-serif">reports</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Real fees paid by real traders — not what exchanges advertise. Submit your own to help the community and see if others are being charged more.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        {/* Exchange gap summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "28px" }}>
          {EXCHANGES.map((e) => {
            const gap = avgGap(e.id);
            const hasData = gap !== null;
            return (
              <div key={e.id} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "9px", fontWeight: 900, background: e.logoColor + "18", color: e.logoColor }}>
                    {e.logo}
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: "var(--paper)" }}>{e.name}</span>
                </div>
                {hasData ? (
                  <>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "2px" }}>Avg fee gap</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: gap > 0.1 ? "#ef4444" : gap > 0 ? "#f59e0b" : "#22c55e" }}>
                      {gap > 0 ? "+" : ""}{gap.toFixed(2)}%
                    </p>
                  </>
                ) : (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>No reports yet</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Filter + submit */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "6px", flex: 1, flexWrap: "wrap" }}>
            <button onClick={() => setFilter("all")}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${filter === "all" ? "var(--gold)" : "var(--wire)"}`, background: filter === "all" ? "var(--gold-dim)" : "transparent", color: filter === "all" ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
              All exchanges
            </button>
            {EXCHANGES.map((e) => (
              <button key={e.id} onClick={() => setFilter(e.id)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${filter === e.id ? e.logoColor : "var(--wire)"}`, background: filter === e.id ? e.logoColor + "15" : "transparent", color: filter === e.id ? e.logoColor : "var(--chrome)", cursor: "pointer" }}>
                {e.name}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}
            style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, background: "var(--gold)", color: "var(--ink)", padding: "8px 20px", borderRadius: "99px", border: "none", cursor: "pointer", flexShrink: 0 }}>
            + Submit report
          </button>
        </div>

        {submitted && (
          <div style={{ background: "#22c55e10", border: "1px solid #22c55e30", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#22c55e" }}>✓ Report submitted — thanks for helping the community!</p>
          </div>
        )}

        {/* Reports */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((report) => {
            const exchange = EXCHANGES.find((e) => e.id === report.exchangeId);
            const gap = report.reportedFee - report.advertisedFee;
            const isHigher = gap > 0.05;
            return (
              <div key={report.id} style={{ background: "var(--ink-2)", border: `1px solid ${isHigher ? "#ef444425" : "var(--wire)"}`, borderRadius: "var(--radius-lg)", padding: "16px 18px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                {/* Exchange chip */}
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "10px", fontWeight: 900, background: exchange?.logoColor + "18", color: exchange?.logoColor, flexShrink: 0 }}>
                  {exchange?.logo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)" }}>{report.exchangeName}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: "#22c55e10", color: "#22c55e", border: "1px solid #22c55e25" }}>
                      Advertised: {report.advertisedFee}%
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: isHigher ? "#ef444410" : "#22c55e10", color: isHigher ? "#ef4444" : "#22c55e", border: `1px solid ${isHigher ? "#ef444425" : "#22c55e25"}` }}>
                      Actual: {report.reportedFee}%
                    </span>
                    {isHigher && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#ef4444" }}>
                        +{gap.toFixed(2)}% hidden
                      </span>
                    )}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>{report.tradeType} · ${report.tradeSize}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--chrome)", lineHeight: 1.5, margin: "0 0 8px" }}>{report.note}</p>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button onClick={() => upvote(report.id)}
                      style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", background: "transparent", border: "1px solid var(--wire)", borderRadius: "6px", padding: "3px 10px", cursor: "pointer" }}>
                      ↑ {report.upvotes}
                    </button>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>{report.createdAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit form modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "28px", width: "100%", maxWidth: "480px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--paper)", marginBottom: "20px" }}>Submit a fee report</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <select value={form.exchangeId} onChange={(e) => setForm((f) => ({ ...f, exchangeId: e.target.value }))}
                  style={{ background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: form.exchangeId ? "var(--paper)" : "var(--chrome)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                  <option value="">Select exchange</option>
                  {EXCHANGES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px" }}>Actual fee you paid (%)</p>
                    <input type="number" step="0.01" value={form.reportedFee} onChange={(e) => setForm((f) => ({ ...f, reportedFee: e.target.value }))}
                      placeholder="0.60" style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px" }}>Trade size (USD)</p>
                    <input type="number" value={form.tradeSize} onChange={(e) => setForm((f) => ({ ...f, tradeSize: e.target.value }))}
                      placeholder="500" style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }} />
                  </div>
                </div>
                <select value={form.tradeType} onChange={(e) => setForm((f) => ({ ...f, tradeType: e.target.value }))}
                  style={{ background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                  <option value="market">Market order</option>
                  <option value="limit">Limit order</option>
                  <option value="simple">Simple buy interface</option>
                  <option value="debit">Debit card purchase</option>
                </select>
                <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="What happened? Any context about your account tier or interface used?"
                  style={{ background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", height: "80px", resize: "vertical" }} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", border: "1px solid var(--wire)", borderRadius: "10px", background: "transparent", color: "var(--chrome)", fontFamily: "var(--font-mono)", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                  <button onClick={submit} disabled={!form.exchangeId || !form.reportedFee || submitting}
                    style={{ flex: 2, padding: "12px", border: "none", borderRadius: "10px", background: form.exchangeId && form.reportedFee ? "var(--gold)" : "var(--wire)", color: form.exchangeId && form.reportedFee ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                    {submitting ? "Submitting…" : "Submit report"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
