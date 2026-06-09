"use client";

import { useState } from "react";

const KNOWN_LEGIT = ["binance.com","coinbase.com","kraken.com","bybit.com","okx.com","ledger.com","trezor.io","koinly.io","coinledger.io","tradingview.com","nordvpn.com","bitwarden.com","nicehash.com"];
const RED_FLAG_PATTERNS = ["withdrawal fee upfront","guaranteed profit","100% return","double your","airdrop claim","connect wallet to receive","urgent","limited time offer","celebrity endorsed"];

interface AnalysisResult {
  verdict: "safe" | "suspicious" | "scam" | "unknown";
  confidence: number;
  summary: string;
  redFlags: string[];
  greenFlags: string[];
  recommendation: string;
  affiliateAlternative?: { name: string; url: string };
}

const VERDICT_CONFIG = {
  safe:       { color: "#22c55e", bg: "#22c55e15", border: "#22c55e40", icon: "✅", label: "Looks legitimate" },
  suspicious: { color: "#f59e0b", bg: "#f59e0b15", border: "#f59e0b40", icon: "⚠️", label: "Proceed with caution" },
  scam:       { color: "#ef4444", bg: "#ef444415", border: "#ef444440", icon: "🚨", label: "Likely scam" },
  unknown:    { color: "#71717a", bg: "#71717a15", border: "#71717a40", icon: "❓", label: "Unable to verify" },
};

export function ScamDetector() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setStreamText("");
    setResult(null);
    setError("");

    try {
      // Check if it's a known legit domain first
      const domain = url.replace(/https?:\/\//, "").split("/")[0].toLowerCase();
      const isKnownLegit = KNOWN_LEGIT.some(k => domain.includes(k));

      const system = `You are a crypto security expert at cryptoffiliate.com. A user wants to check if a crypto exchange/wallet/platform is legitimate.

Analyse the URL/domain provided. Consider:
- Is this a known legitimate exchange (Binance, Coinbase, Kraken, OKX, Bybit etc.)?
- Is this a copycat/phishing domain (binance-app.com, coinbase-pro-login.net etc.)?
- Domain age signals (very new domains are suspicious)
- Red flag patterns in the URL itself
- Known scam indicators

Respond ONLY with valid JSON in this exact format:
{
  "verdict": "safe|suspicious|scam|unknown",
  "confidence": 0-100,
  "summary": "2-3 sentence plain English summary",
  "redFlags": ["flag1", "flag2"],
  "greenFlags": ["flag1", "flag2"],
  "recommendation": "What should the user do?"
}`;

      const response = await fetch("/api/ai-advisor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Check this crypto URL for legitimacy: ${url}\n\nRespond with JSON only.`,
          context: system,
          mode: "general",
        }),
      });

      if (!response.ok) throw new Error("API error");

      const json = await response.json();
      const fullText: string = json.response || "";
      setStreamText(fullText);

      // Parse the JSON response (strip code-fences if any)
      const clean = fullText.replace(/```json|```/g, "").trim();
      // Extract JSON object even if surrounded by prose
      const match = clean.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : clean) as AnalysisResult;

      // Add affiliate alternative for known scams targeting legit exchanges
      if (parsed.verdict === "scam" || parsed.verdict === "suspicious") {
        if (domain.includes("binance")) parsed.affiliateAlternative = { name: "Real Binance", url: "https://www.binance.com/en/register?ref=CRYPTOFFILIATE" };
        else if (domain.includes("coinbase")) parsed.affiliateAlternative = { name: "Real Coinbase", url: "https://coinbase.com/join/CRYPTOFFILIATE" };
      }

      setResult(parsed);
    } catch (err) {
      // Fallback for JSON parse errors or API issues
      const domain = url.replace(/https?:\/\//, "").split("/")[0].toLowerCase();
      const isKnownLegit = KNOWN_LEGIT.some(k => domain.includes(k));
      const hasRedFlags = RED_FLAG_PATTERNS.some(p => url.toLowerCase().includes(p));

      setResult({
        verdict: isKnownLegit ? "safe" : hasRedFlags ? "scam" : "unknown",
        confidence: isKnownLegit ? 98 : hasRedFlags ? 85 : 50,
        summary: isKnownLegit
          ? `${domain} is a verified, well-established crypto platform with a strong track record.`
          : "We couldn't fully analyse this URL. Proceed with extreme caution.",
        redFlags: hasRedFlags ? ["URL contains suspicious phrases"] : [],
        greenFlags: isKnownLegit ? ["Known legitimate domain", "Established platform"] : [],
        recommendation: isKnownLegit
          ? "This appears legitimate. Always verify you're on the exact official domain."
          : "Do not deposit funds until you've thoroughly verified this platform through multiple independent sources.",
      });
    } finally {
      setLoading(false);
      setStreamText("");
    }
  };

  const config = result ? VERDICT_CONFIG[result.verdict] : null;

  const examples = [
    "binance.com", "binance-airdrop-claim.com", "coinbase.com",
    "coinbase-pro-withdrawal.net", "kraken.com",
  ];

  return (
    <div>
      {/* Input */}
      <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "20px" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "12px" }}>
          Enter URL or domain to check
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="https://example-exchange.com or just the domain name"
            style={{
              flex: 1, background: "var(--ink-3)", border: "1px solid var(--wire)",
              borderRadius: "12px", padding: "12px 16px", color: "var(--paper)",
              fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none",
            }}
          />
          <button
            onClick={analyze}
            disabled={!url.trim() || loading}
            style={{
              padding: "12px 24px", borderRadius: "12px", border: "none",
              background: url.trim() && !loading ? "var(--gold)" : "var(--wire)",
              color: url.trim() && !loading ? "var(--ink)" : "var(--chrome)",
              fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700,
              cursor: url.trim() && !loading ? "pointer" : "not-allowed", whiteSpace: "nowrap",
            }}
          >
            {loading ? "Analysing…" : "Check now"}
          </button>
        </div>

        {/* Examples */}
        <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setUrl(ex)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)",
                background: "transparent", border: "1px solid var(--wire)", borderRadius: "6px",
                padding: "3px 8px", cursor: "pointer",
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Loading stream */}
      {loading && (
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "20px", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", marginLeft: "6px" }}>
              AI is analysing…
            </span>
          </div>
          {streamText && (
            <pre style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", whiteSpace: "pre-wrap", margin: 0 }}>
              {streamText}
            </pre>
          )}
        </div>
      )}

      {/* Result */}
      {result && config && (
        <div style={{ background: config.bg, border: `1px solid ${config.border}`, borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: "20px" }}>
          {/* Verdict header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>{config.icon}</span>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: config.color, margin: "0 0 2px" }}>
                  {config.label}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", margin: 0 }}>
                  {result.confidence}% confidence · {url}
                </p>
              </div>
            </div>
            {/* Confidence bar */}
            <div style={{ textAlign: "right" }}>
              <div style={{ width: "100px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${result.confidence}%`, background: config.color, borderRadius: "99px" }} />
              </div>
            </div>
          </div>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--paper)", lineHeight: 1.6, marginBottom: "16px" }}>
            {result.summary}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {/* Red flags */}
            {result.redFlags.length > 0 && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 14px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#ef4444", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>Red flags</p>
                {result.redFlags.map((f, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--paper)", display: "flex", gap: "6px", margin: "0 0 4px" }}>
                    <span>🚩</span>{f}
                  </p>
                ))}
              </div>
            )}
            {/* Green flags */}
            {result.greenFlags.length > 0 && (
              <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "12px 14px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#22c55e", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "8px" }}>Green flags</p>
                {result.greenFlags.map((f, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--paper)", display: "flex", gap: "6px", margin: "0 0 4px" }}>
                    <span>✅</span>{f}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "14px 16px", marginBottom: result.affiliateAlternative ? "12px" : "0" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "6px" }}>Our recommendation</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--paper)", margin: 0, lineHeight: 1.6 }}>{result.recommendation}</p>
          </div>

          {/* Affiliate alternative */}
          {result.affiliateAlternative && (
            <div style={{ marginTop: "12px", padding: "12px 16px", background: "#22c55e15", border: "1px solid #22c55e30", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--paper)", margin: 0 }}>
                Use the official, verified platform instead:
              </p>
              <a href={result.affiliateAlternative.url} target="_blank" rel="noopener noreferrer sponsored"
                style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: "#22c55e", textDecoration: "none", background: "#22c55e15", border: "1px solid #22c55e40", borderRadius: "8px", padding: "6px 14px" }}>
                Go to {result.affiliateAlternative.name} →
              </a>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      {!result && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {[
            { icon: "🔍", title: "Domain analysis", desc: "Checks for typosquatting, suspicious TLDs, and copycat patterns" },
            { icon: "📋", title: "Pattern matching", desc: "Compares against known scam patterns and red flag phrases" },
            { icon: "🧠", title: "AI assessment", desc: "Claude evaluates context, legitimacy signals, and risk indicators" },
            { icon: "🔗", title: "Safe alternative", desc: "If it's a scam mimicking a real exchange, we link to the real one" },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
              <p style={{ fontSize: "20px", marginBottom: "8px" }}>{icon}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)", marginBottom: "4px" }}>{title}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--chrome)", lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
