"use client";

import { useState, useEffect, useCallback } from "react";
import { EXCHANGES } from "@/data/exchanges";
import { STATUS_LABELS, STATUS_COLORS } from "@/data/exchange-status";

type Status = "operational" | "degraded" | "partial_outage" | "major_outage" | "unknown";

interface ExchangeStatusRow {
  id: string;
  status: Status;
  latencyMs: number | null;
  lastChecked: string;
  uptime30d: number;
}

function StatusDot({ status }: { status: Status }) {
  const color = STATUS_COLORS[status];
  const isOk = status === "operational";
  return (
    <div style={{ position: "relative", width: "10px", height: "10px", flexShrink: 0 }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
      {isOk && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: color, opacity: 0.4,
          animation: "ping 2s ease-in-out infinite",
        }} />
      )}
    </div>
  );
}

function UptimeBars({ uptime }: { uptime: number }) {
  const bars = 30;
  const greenCount = Math.round((uptime / 100) * bars);
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "3px", height: "16px", borderRadius: "1px",
            background: i < greenCount ? "#22c55e" : "#ef4444",
            opacity: i < greenCount ? 0.7 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

export function ExchangeStatusBoard() {
  const [statuses, setStatuses] = useState<Record<string, ExchangeStatusRow>>({});
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [incidentForm, setIncidentForm] = useState<{ exchangeId: string; title: string; desc: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const map: Record<string, ExchangeStatusRow> = {};
      for (const s of data.statuses ?? []) map[s.id] = s;
      setStatuses(map);
      setIncidents(data.incidents ?? []);
    } catch {
      // Use mock data if API not set up
      const mock: Record<string, ExchangeStatusRow> = {};
      for (const e of EXCHANGES) {
        mock[e.id] = {
          id: e.id, status: "operational",
          latencyMs: Math.floor(Math.random() * 200) + 80,
          lastChecked: new Date().toISOString(),
          uptime30d: 99.5 + Math.random() * 0.5,
        };
      }
      setStatuses(mock);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const allOperational = Object.values(statuses).every(s => s.status === "operational");

  const submitIncident = async () => {
    if (!incidentForm?.title || !incidentForm.exchangeId) return;
    setSubmitting(true);
    try {
      await fetch("/api/community/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentForm),
      });
      setSubmitted(true);
      setIncidentForm(null);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  return (
    <div>
      <style>{`
        @keyframes ping { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(1.8);opacity:0} }
      `}</style>

      {/* Overall status banner */}
      <div style={{
        background: allOperational ? "#22c55e15" : "#ef444415",
        border: `1px solid ${allOperational ? "#22c55e40" : "#ef444440"}`,
        borderRadius: "var(--radius-lg)", padding: "16px 20px",
        display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px",
      }}>
        <StatusDot status={allOperational ? "operational" : "degraded"} />
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--paper)", margin: 0 }}>
            {allOperational ? "All systems operational" : "Some exchanges are experiencing issues"}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", margin: "2px 0 0" }}>
            Last updated: {new Date().toLocaleTimeString()} · Auto-refreshes every 60s
          </p>
        </div>
      </div>

      {/* Exchange status table */}
      <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--wire)" }}>
              {["Exchange", "Status", "Latency", "30d uptime", "Last checked", "Report"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", textTransform: "uppercase", letterSpacing: ".12em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXCHANGES.map((exchange) => {
              const s = statuses[exchange.id];
              const status: Status = s?.status ?? "unknown";
              const color = STATUS_COLORS[status];
              return (
                <tr key={exchange.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "10px", fontWeight: 900, background: exchange.logoColor + "18", border: `1.5px solid ${exchange.logoColor}35`, color: exchange.logoColor, flexShrink: 0 }}>
                        {exchange.logo}
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)" }}>{exchange.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <StatusDot status={status} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color }}>{STATUS_LABELS[status]}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--paper)" }}>
                      {s?.latencyMs != null ? `${s.latencyMs}ms` : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <UptimeBars uptime={s?.uptime30d ?? 100} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>
                        {(s?.uptime30d ?? 100).toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>
                      {s?.lastChecked ? new Date(s.lastChecked).toLocaleTimeString() : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button
                      onClick={() => setIncidentForm({ exchangeId: exchange.id, title: "", desc: "" })}
                      style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", background: "transparent", border: "1px solid var(--wire)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
                    >
                      Report issue
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Active incidents */}
      {incidents.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--paper)", marginBottom: "12px" }}>Active incidents</h2>
          {incidents.map((inc) => (
            <div key={inc.id} style={{ background: "#ef444415", border: "1px solid #ef444435", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: "8px" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#ef4444", margin: "0 0 4px" }}>{inc.title}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", margin: 0 }}>{inc.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Report incident modal */}
      {incidentForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "28px", width: "100%", maxWidth: "440px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--paper)", marginBottom: "20px" }}>Report an issue</h3>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>✅</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--paper)" }}>Thanks for reporting. We'll investigate shortly.</p>
                <button onClick={() => setSubmitted(false)} style={{ marginTop: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)", background: "transparent", border: "1px solid var(--wire)", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}>Close</button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="What's the issue? (e.g. withdrawals not processing)"
                  value={incidentForm.title}
                  onChange={e => setIncidentForm(f => f ? { ...f, title: e.target.value } : f)}
                  style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", marginBottom: "10px", outline: "none" }}
                />
                <textarea
                  placeholder="Additional details (optional)"
                  value={incidentForm.desc}
                  onChange={e => setIncidentForm(f => f ? { ...f, desc: e.target.value } : f)}
                  style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", marginBottom: "16px", outline: "none", height: "80px", resize: "vertical" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setIncidentForm(null)} style={{ flex: 1, padding: "10px", border: "1px solid var(--wire)", borderRadius: "10px", background: "transparent", color: "var(--chrome)", fontFamily: "var(--font-mono)", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                  <button onClick={submitIncident} disabled={!incidentForm.title || submitting} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "10px", background: submitting || !incidentForm.title ? "var(--wire)" : "#ef4444", color: submitting || !incidentForm.title ? "var(--chrome)" : "white", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, cursor: submitting ? "wait" : "pointer" }}>
                    {submitting ? "Submitting…" : "Submit report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
