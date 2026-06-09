"use client";

import { useState } from "react";

export default function WhitepaperPage() {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState<"url" | "text">("url");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [streamText, setStreamText] = useState("");

  const analyse = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    setStreamText("");

    const prompt = `Analyse this crypto project whitepaper or documentation and provide:

1. **30-word summary**: What does this project actually do in plain English?
2. **The real use case**: Is there a genuine problem being solved, or is this a solution looking for a problem?
3. **Token necessity**: Does this project actually need a blockchain/token, or could it run on regular software?
4. **Red flags** (if any): List specific concerning language, vague claims, or missing technical detail
5. **Green flags** (if any): Concrete technical approach, named team, audits, working product
6. **Verdict**: One of: "Legitimate project", "Needs more research", "Speculative", or "Likely scam" — with a one-sentence reason

Input: ${input}

Be direct and critical. Don't hedge. If it looks like a scam, say so.`;

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
                  setStreamText(text);
                }
              } catch { /* */ }
            }
          }
        }
      }
      setResult(text);
    } catch {
      setResult("Unable to connect to AI. Please ensure your ANTHROPIC_API_KEY is configured.");
    } finally {
      setLoading(false);
      setStreamText("");
    }
  };

  const examples = [
    { label: "Bitcoin whitepaper", url: "https://bitcoin.org/bitcoin.pdf" },
    { label: "Ethereum whitepaper", url: "https://ethereum.org/en/whitepaper/" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">AI-powered · World first · Free</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            AI whitepaper <span className="italic-serif">analyser</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Paste a whitepaper URL or text. Get a plain-English summary, red flag analysis, and a direct verdict in seconds. No more wading through 40 pages of technical jargon.
          </p>
        </div>
      </div>

      <div className="container-sm" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        {/* Input type toggle */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
          {(["url", "text"] as const).map((t) => (
            <button key={t} onClick={() => setInputType(t)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 16px", borderRadius: "99px", border: `1px solid ${inputType === t ? "var(--gold)" : "var(--wire)"}`, background: inputType === t ? "var(--gold-dim)" : "transparent", color: inputType === t ? "var(--gold)" : "var(--chrome)", cursor: "pointer", textTransform: "capitalize" }}>
              {t === "url" ? "Paste URL" : "Paste text"}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "20px", marginBottom: "14px" }}>
          {inputType === "url" ? (
            <input type="url" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyse()}
              placeholder="https://example.com/whitepaper.pdf or whitepaper URL"
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--paper)" }} />
          ) : (
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Paste whitepaper text here (up to 5,000 characters for best results)..."
              style={{ width: "100%", height: "160px", background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--paper)", resize: "vertical", lineHeight: 1.6 }} />
          )}
        </div>

        {/* Example links */}
        {inputType === "url" && (
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>Examples:</span>
            {examples.map(({ label, url }) => (
              <button key={label} onClick={() => setInput(url)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--gold)", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "3px 10px", cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>
        )}

        <button onClick={analyse} disabled={!input.trim() || loading}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: input.trim() && !loading ? "var(--gold)" : "var(--wire)", color: input.trim() && !loading ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, cursor: input.trim() && !loading ? "pointer" : "not-allowed", marginBottom: "24px" }}>
          {loading ? "AI is reading the whitepaper…" : "Analyse whitepaper →"}
        </button>

        {/* Streaming */}
        {(streamText || loading) && (
          <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "24px", marginBottom: "20px" }}>
            {loading && !streamText && (
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * .2}s` }} />)}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)", marginLeft: "8px" }}>Reading whitepaper…</span>
              </div>
            )}
            {streamText && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div className="pulse-dot" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase" }}>AI analysis</span>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--paper)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                  {streamText}
                  {loading && <span style={{ display: "inline-block", width: "2px", height: "16px", background: "var(--gold)", marginLeft: "2px", verticalAlign: "middle", animation: "blink 1s ease infinite" }} />}
                </div>
              </>
            )}
          </div>
        )}

        {/* How it works */}
        {!result && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { icon: "📄", title: "Plain-English summary", desc: "30-word explanation of what the project actually does" },
              { icon: "🚩", title: "Red flag detection", desc: "Vague claims, missing tech detail, concerning language" },
              { icon: "✅", title: "Legitimacy signals", desc: "Named team, audits, working product, concrete roadmap" },
              { icon: "⚖️", title: "Direct verdict", desc: "Legitimate / Speculative / Needs research / Likely scam" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
                <p style={{ fontSize: "22px", marginBottom: "8px" }}>{icon}</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)", marginBottom: "4px" }}>{title}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--chrome)", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.6, marginTop: "24px" }}>
          Not financial advice. AI analysis is for informational purposes only. Always do your own research before investing.
        </p>
      </div>
    </div>
  );
}
