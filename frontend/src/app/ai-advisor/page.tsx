import type { Metadata } from "next";
import { AIChat } from "@/components/AIChat";

export const metadata: Metadata = {
  title: "AI Crypto Advisor — Ask Anything About Exchanges, Wallets & Fees",
  description:
    "The only crypto comparison site with a real AI advisor you can have a conversation with. Ask about fees, exchanges, hardware wallets, tax software — get direct, expert answers instantly.",
};

const AI_FEATURES = [
  { icon: "💬", title: "Natural conversations", desc: "Ask follow-up questions. The AI remembers context across your whole session." },
  { icon: "📊", title: "Live fee data", desc: "Knows exact current fees for all 5 major exchanges — Binance, OKX, Kraken, Coinbase, Bybit." },
  { icon: "🌍", title: "Location-aware", desc: "Tell it where you are. It knows which exchanges are and aren't available in your region." },
  { icon: "🔗", title: "Affiliate-honest", desc: "We disclose every commission. The AI recommends based on fit, not payout rates." },
  { icon: "⚡", title: "Streaming responses", desc: "Answers appear word by word — no waiting for a full response to load." },
  { icon: "🧠", title: "Powered by Claude", desc: "Built on Anthropic's Claude Sonnet — one of the most capable AI models available." },
];

export default function AIAdvisorPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>

      {/* Hero */}
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "64px 0 48px" }}>
        <div className="container">
          <div style={{ maxWidth: "640px" }}>
            <div className="eyebrow">Powered by Claude Sonnet</div>
            <h1 className="heading-xl" style={{ marginBottom: "20px" }}>
              Ask the <span className="italic-serif">AI advisor</span>
            </h1>
            <p className="body-lg" style={{ marginBottom: "32px" }}>
              The only crypto site with a real AI you can have a conversation with.
              Not a quiz. Not a filter. An actual expert — available 24/7, with live fee data baked in.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "32px" }}>
              {["Which exchange for US traders?", "Ledger vs Trezor?", "How to reduce crypto taxes?"].map((q) => (
                <span
                  key={q}
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)",
                    padding: "6px 14px", borderRadius: "99px", border: "1px solid var(--wire)",
                  }}
                >
                  "{q}"
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }}>

          {/* Chat */}
          <AIChat placeholder="Ask me about exchanges, wallets, tax software, VPNs, trading bots…" />

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="glow-card" style={{ padding: "20px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "16px" }}>
                What it knows
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { cat: "Exchanges", items: "Binance, OKX, Kraken, Coinbase, Bybit — live fee data" },
                  { cat: "Wallets", items: "Ledger, Trezor, CoolWallet — all models & prices" },
                  { cat: "Tax software", items: "Koinly, CoinLedger, ZenLedger, CoinTracker, TaxBit" },
                  { cat: "Security", items: "NordVPN, Proton, Bitwarden, 1Password" },
                  { cat: "Trading bots", items: "WunderTrading, 3Commas, TradingView, Pionex" },
                  { cat: "Cloud mining", items: "NiceHash, ECOS, BitFuFu" },
                ].map(({ cat, items }) => (
                  <div key={cat} style={{ padding: "10px 0", borderBottom: "1px solid var(--wire)" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: "var(--paper)", marginBottom: "3px" }}>{cat}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", lineHeight: 1.5 }}>{items}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glow-card" style={{ padding: "20px", background: "var(--gold-dim)", borderColor: "rgba(201,168,76,0.2)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "10px" }}>
                Affiliate disclosure
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--chrome)", lineHeight: 1.6 }}>
                When the AI recommends a product, we may earn a commission if you sign up. This never affects the recommendation — we tell the AI to recommend based on fit, not commission rate.
              </p>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ marginTop: "64px" }}>
          <div className="eyebrow" style={{ marginBottom: "32px" }}>Why it's different</div>
          <div className="grid-3">
            {AI_FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="glow-card" style={{ padding: "24px" }}>
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{icon}</div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--paper)", marginBottom: "8px" }}>{title}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
