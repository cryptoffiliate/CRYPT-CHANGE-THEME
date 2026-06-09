import type { Metadata } from "next";
import Link from "next/link";
import { EXCHANGES } from "@/data/exchanges";
import { AIChat } from "@/components/AIChat";
import { HomeExchangeTable } from "@/components/HomeExchangeTable";

export const metadata: Metadata = {
  title: "Cryptoffiliate — AI-Powered Crypto Intelligence",
  description:
    "Live fee data, AI-powered exchange recommendations, and unbiased crypto reviews. The only crypto comparison platform with a real AI advisor built in.",
};

const AI_FEATURES = [
  { num: "01", title: "AI EXCHANGE ADVISOR", desc: "Ask anything in plain English. Get a direct, personalised recommendation — not a list.", tag: "LIVE",  color: "#00FF94" },
  { num: "02", title: "AI FEE ANALYST",       desc: "Upload your trade history. Claude tells you exactly how much you overpaid and where to move.", tag: "BETA", color: "#C4FF00" },
  { num: "03", title: "PORTFOLIO HEALTH",     desc: "Get an AI assessment of your exchange risk, custody risk, and tax exposure in seconds.", tag: "BETA", color: "#C4FF00" },
  { num: "04", title: "SMART BONUS ALERTS",   desc: "AI-monitored exchange announcements. You get alerted only on genuine new offers.", tag: "LIVE",  color: "#00FF94" },
  { num: "05", title: "TAX STRATEGIST",       desc: "Tell Claude your holdings. It recommends the right tax software and year-end strategy for you.", tag: "SOON", color: "#B026FF" },
  { num: "06", title: "BOT STRATEGY BUILDER", desc: "Describe your goals in plain English. Claude builds a WunderTrading or 3Commas config for you.", tag: "SOON", color: "#B026FF" },
];

const STATS = [
  { num: "40+",      label: "AFFILIATE PROGRAMS", color: "#00F0FF" },
  { num: "06",       label: "VERTICALS COVERED",  color: "#B026FF" },
  { num: "NIGHTLY",  label: "FEE DATA SYNC",      color: "#C4FF00" },
  { num: "FREE",     label: "AI ADVISOR",         color: "#00FF94" },
];

const VERTICALS = [
  { href: "/compare",          num: "I.",   title: "EXCHANGES",        desc: "5 exchanges compared with live fees", color: "#00F0FF" },
  { href: "/hardware-wallets", num: "II.",  title: "HARDWARE WALLETS", desc: "Ledger, Trezor, CoolWallet",          color: "#00FF94" },
  { href: "/tax-software",     num: "III.", title: "TAX SOFTWARE",     desc: "Koinly, CoinLedger, ZenLedger +2",    color: "#C4FF00" },
  { href: "/security",         num: "IV.",  title: "SECURITY TOOLS",   desc: "VPNs + password managers",            color: "#B026FF" },
  { href: "/trading-bots",     num: "V.",   title: "TRADING BOTS",     desc: "WunderTrading, 3Commas, TradingView", color: "#FF8A3D" },
  { href: "/cloud-mining",     num: "VI.",  title: "CLOUD MINING",     desc: "NiceHash, ECOS, BitFuFu",             color: "#FF3D71" },
];

export default function HomePage() {
  return (
    <div data-testid="home-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--wire)",
        }}
        data-testid="hero-section"
      >
        {/* Hero radial glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-180px",
            left: "20%",
            width: "640px",
            height: "640px",
            background: "radial-gradient(circle, rgba(0, 240, 255, 0.32), transparent 60%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-180px",
            right: "10%",
            width: "560px",
            height: "560px",
            background: "radial-gradient(circle, rgba(176, 38, 255, 0.28), transparent 60%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Top status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 24px",
            borderBottom: "1px solid var(--wire)",
            background: "rgba(5, 6, 10, 0.6)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--chrome)",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            fontWeight: 500,
            position: "relative",
            zIndex: 2,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#00FF94", boxShadow: "0 0 8px #00FF94" }} />
            <span style={{ color: "#00F0FF" }}>ISSUE 27</span> · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}
          </span>
          <span className="hidden md:inline-flex" style={{ gap: 18, color: "var(--chrome)" }}>
            <span style={{ color: "#B026FF" }}>∎</span> EDITORIAL INDEPENDENCE · NO PAID PLACEMENT
          </span>
          <span style={{ color: "#C4FF00" }}>EST. 2024</span>
        </div>

        <div className="container" style={{ paddingTop: "64px", paddingBottom: "72px", position: "relative", zIndex: 1 }}>
          <div className="grid-hero">
            {/* Left — headline */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <span className="eyebrow" style={{ marginBottom: 0 }}>
                  INDEPENDENT INTELLIGENCE
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", letterSpacing: ".2em", textTransform: "uppercase" }}>
                  · VOL. 1
                </span>
              </div>

              <h1
                className="heading-xl animate-fade-up delay-100"
                style={{ marginBottom: "22px" }}
                data-testid="hero-headline"
              >
                Find the<br />
                <span className="italic-serif">right</span> exchange.<br />
                <span
                  style={{
                    background: "linear-gradient(135deg, rgba(196, 255, 0, 0.16), rgba(0, 240, 255, 0.16))",
                    padding: "2px 14px",
                    border: "1px solid #C4FF00",
                    borderRadius: "8px",
                    display: "inline-block",
                    boxShadow: "0 0 28px rgba(196, 255, 0, 0.35)",
                    color: "#C4FF00",
                    textShadow: "0 0 14px rgba(196, 255, 0, 0.5)",
                  }}
                >
                  Skip the sales pitch.
                </span>
              </h1>

              <p className="body-lg animate-fade-up delay-200" style={{ marginBottom: "36px", maxWidth: "540px", fontSize: "18px" }}>
                Live fee data, unbiased reviews, and an <strong style={{ color: "#00F0FF", textShadow: "0 0 10px rgba(0, 240, 255, 0.45)" }}>AI advisor</strong> that tells you the truth — not whoever pays the highest commission.
              </p>

              <div className="animate-fade-up delay-300" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
                <Link href="/ai-advisor" className="btn-primary" data-testid="hero-cta-ai">
                  Ask the AI advisor →
                </Link>
                <Link href="/compare" className="btn-ghost" data-testid="hero-cta-compare">
                  Compare exchanges
                </Link>
              </div>

              {/* Stats — neon grid */}
              <div
                className="animate-fade-up delay-400"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  border: "1px solid var(--wire)",
                  borderRadius: "14px",
                  background: "rgba(11, 14, 24, 0.7)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  overflow: "hidden",
                  boxShadow: "0 0 0 1px rgba(0, 240, 255, 0.1), 0 18px 48px rgba(0, 0, 0, 0.45)",
                }}
              >
                {STATS.map(({ num, label, color }, i) => (
                  <div
                    key={label}
                    style={{
                      padding: "18px 14px",
                      borderRight: i < STATS.length - 1 ? "1px solid var(--wire)" : "none",
                      position: "relative",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "30px",
                        fontWeight: 700,
                        color: color,
                        marginBottom: "4px",
                        letterSpacing: "-.03em",
                        lineHeight: 1,
                        textShadow: `0 0 14px ${color}55`,
                      }}
                    >
                      {num}
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", letterSpacing: ".18em", fontWeight: 500 }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — AI Chat */}
            <div className="animate-fade-up delay-200" style={{ display: "flex" }}>
              <div style={{ width: "100%", display: "flex" }}>
                <div style={{ width: "100%" }}>
                  <AIChat compact placeholder="Ask anything — which exchange, wallet, or tax tool?" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom neon stripe */}
        <div className="stripe" />
      </section>

      {/* ── Live exchange table ───────────────────────────────── */}
      <section
        style={{ borderBottom: "1px solid var(--wire)", position: "relative" }}
        data-testid="exchange-comparison-section"
      >
        <div className="container" style={{ paddingTop: "80px", paddingBottom: "80px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="eyebrow">§ 01 · Live Data — Synced Nightly</span>
              <h2 className="heading-lg">
                Exchange <span className="italic-serif">comparison</span>
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <div className="pulse-dot" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--paper)", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" }}>
                  Fees synced tonight
                </span>
              </span>
              <Link href="/compare" className="btn-ghost" data-testid="full-comparison-link" style={{ fontSize: "11px", padding: "10px 16px" }}>
                Full report →
              </Link>
            </div>
          </div>

          <HomeExchangeTable exchanges={EXCHANGES} />
        </div>
      </section>

      {/* ── AI Features grid ──────────────────────────────────── */}
      <section
        style={{ borderBottom: "1px solid var(--wire)", position: "relative" }}
        data-testid="ai-features-section"
      >
        <div className="container" style={{ paddingTop: "88px", paddingBottom: "88px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "44px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ maxWidth: "640px" }}>
              <span className="eyebrow eyebrow-accent">§ 02 · Powered By Claude Sonnet</span>
              <h2 className="heading-lg">
                AI features <span className="italic-serif">no competitor</span><br />has built.
              </h2>
            </div>
            <Link href="/ai-advisor" className="btn-klein" data-testid="ai-features-cta" style={{ fontSize: "12px" }}>
              Try AI advisor →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            {AI_FEATURES.map(({ num, title, desc, tag, color }) => (
              <div
                key={title}
                data-testid={`ai-feature-card-${num}`}
                className="glow-card"
                style={{
                  padding: "26px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minHeight: "230px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* glow corner */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "140px",
                    height: "140px",
                    background: `radial-gradient(circle, ${color}30, transparent 60%)`,
                    filter: "blur(20px)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "32px",
                      fontWeight: 300,
                      color: color,
                      lineHeight: 1,
                      letterSpacing: "-.04em",
                      textShadow: `0 0 14px ${color}66`,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      padding: "3px 10px",
                      background: `${color}1A`,
                      color: color,
                      border: `1px solid ${color}`,
                      borderRadius: "999px",
                      fontWeight: 600,
                      letterSpacing: ".15em",
                      textShadow: `0 0 8px ${color}66`,
                    }}
                  >
                    {tag}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 600, color: "var(--paper)", marginTop: "14px", letterSpacing: "-.01em", position: "relative", zIndex: 1 }}>
                  {title}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "13.5px", color: "var(--chrome)", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verticals grid ────────────────────────────────────── */}
      <section
        style={{ borderBottom: "1px solid var(--wire)", position: "relative" }}
        data-testid="verticals-section"
      >
        <div className="container" style={{ paddingTop: "88px", paddingBottom: "88px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "40px" }}>
            <span className="eyebrow eyebrow-klein">§ 03 · Everything Crypto</span>
            <h2 className="heading-lg">
              Six verticals.<br />
              <span className="italic-serif">Forty+</span> programs.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            {VERTICALS.map(({ href, num, title, desc, color }) => (
              <Link
                key={href}
                href={href}
                data-testid={`vertical-card-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="glow-card"
                style={{
                  padding: "28px 24px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minHeight: "220px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* corner glow */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    bottom: "-80px",
                    right: "-60px",
                    width: "200px",
                    height: "200px",
                    background: `radial-gradient(circle, ${color}24, transparent 70%)`,
                    filter: "blur(20px)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: color,
                      letterSpacing: ".14em",
                      fontWeight: 500,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      background: color,
                      borderRadius: "6px",
                      display: "inline-block",
                      boxShadow: `0 0 16px ${color}, inset 0 0 8px rgba(255,255,255,0.3)`,
                    }}
                  />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--paper)",
                    letterSpacing: "-.02em",
                    marginTop: "10px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {title}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)", lineHeight: 1.55, flex: 1, position: "relative", zIndex: 1 }}>
                  {desc}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: color, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", marginTop: "auto", textShadow: `0 0 8px ${color}55`, position: "relative", zIndex: 1 }}>
                  Explore §{num} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial pull-quote ──────────────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--wire)", position: "relative" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 70% 30%, rgba(0, 240, 255, 0.16), transparent 50%), radial-gradient(circle at 25% 80%, rgba(176, 38, 255, 0.16), transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ paddingTop: "88px", paddingBottom: "88px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "920px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".25em", color: "#C4FF00", textTransform: "uppercase", marginBottom: "22px", fontWeight: 600, textShadow: "0 0 10px rgba(196, 255, 0, 0.45)" }}>
              § 04 — Editor&apos;s Note
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(30px, 4.4vw, 50px)",
                lineHeight: 1.18,
                letterSpacing: "-.02em",
                color: "var(--paper)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              &ldquo;Most &lsquo;best exchange&rsquo; sites rank by who pays the most commission. We rank by who&rsquo;s <span style={{ color: "#00F0FF", textShadow: "0 0 12px rgba(0, 240, 255, 0.5)" }}>actually</span> right for{" "}
              <span
                style={{
                  color: "#C4FF00",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontStyle: "normal",
                  padding: "0 10px",
                  border: "1px solid #C4FF00",
                  borderRadius: "6px",
                  boxShadow: "0 0 24px rgba(196, 255, 0, 0.45)",
                  textShadow: "0 0 12px rgba(196, 255, 0, 0.5)",
                }}
              >
                YOU.
              </span>
              &rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".15em", color: "var(--chrome)", textTransform: "uppercase", marginTop: "30px", fontWeight: 500 }}>
              — The Cryptoffiliate Editorial Standard
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section data-testid="bottom-cta-section" style={{ position: "relative" }}>
        <div className="container" style={{ paddingTop: "96px", paddingBottom: "96px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", marginBottom: "28px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: ".25em",
                textTransform: "uppercase",
                padding: "6px 14px",
                background: "rgba(0, 255, 148, 0.10)",
                color: "#00FF94",
                border: "1px solid #00FF94",
                borderRadius: "999px",
                fontWeight: 600,
                boxShadow: "0 0 20px rgba(0, 255, 148, 0.3)",
                textShadow: "0 0 8px rgba(0, 255, 148, 0.5)",
              }}
            >
              FREE · NO SIGN-UP · INSTANT
            </span>
          </div>
          <h2 className="heading-lg" style={{ marginBottom: "22px", maxWidth: "820px", marginLeft: "auto", marginRight: "auto" }}>
            Ready to find your <span className="italic-serif">perfect</span> exchange?
          </h2>
          <p className="body-lg" style={{ marginBottom: "40px", maxWidth: "580px", margin: "0 auto 40px" }}>
            Ask the AI, compare the table, or take the quiz. All free, all unbiased.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/ai-advisor" className="btn-primary" data-testid="footer-cta-advisor">
              Ask the AI advisor →
            </Link>
            <Link href="/compare" className="btn-ghost" data-testid="footer-cta-compare">
              Compare exchanges
            </Link>
            <Link href="/quiz" className="btn-klein" data-testid="footer-cta-quiz">
              Take the quiz
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
