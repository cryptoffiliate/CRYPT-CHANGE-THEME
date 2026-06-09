"use client";

import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "Exchanges",
    color: "#00F0FF",
    links: [
      { href: "/compare",              label: "Compare exchanges" },
      { href: "/reviews",              label: "All reviews" },
      { href: "/bonuses",              label: "Signup bonuses" },
      { href: "/tools/fee-breakdown",  label: "Hidden fee calculator" },
      { href: "/quiz",                 label: "Find my exchange" },
    ],
  },
  {
    title: "Wallets & Security",
    color: "#00FF94",
    links: [
      { href: "/hardware-wallets",                 label: "Hardware wallets" },
      { href: "/hardware-wallets/ledger-vs-trezor", label: "Ledger vs Trezor" },
      { href: "/security",                          label: "Security overview" },
      { href: "/security/vpn",                      label: "Best VPNs" },
      { href: "/security/password-managers",        label: "Password managers" },
    ],
  },
  {
    title: "Tax & Tools",
    color: "#B026FF",
    links: [
      { href: "/tax-software",  label: "Crypto tax software" },
      { href: "/trading-bots",  label: "Trading bots" },
      { href: "/cloud-mining",  label: "Cloud mining" },
      { href: "/alerts",        label: "Bonus alerts" },
      { href: "/ai-advisor",    label: "AI advisor" },
    ],
  },
  {
    title: "Site",
    color: "#C4FF00",
    links: [
      { href: "/about",      label: "About" },
      { href: "/disclosure", label: "Affiliate disclosure" },
      { href: "/privacy",    label: "Privacy policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #05060A 0%, #0B0E18 100%)",
        color: "var(--paper)",
        borderTop: "1px solid var(--wire)",
        marginTop: "80px",
        position: "relative",
      }}
      data-testid="site-footer"
    >
      {/* Neon top accent */}
      <div className="stripe" />

      <div className="container" style={{ paddingTop: "64px", paddingBottom: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "40px", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "26px", color: "var(--paper)", letterSpacing: "-0.03em", marginBottom: "14px" }}>
              CRYPTO<span className="holo-text">/</span>FFILIATE
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)", lineHeight: 1.6, maxWidth: "300px", marginBottom: "22px" }}>
              AI-powered crypto intelligence. Live fee data, unbiased reviews, and a real advisor built in — no paid placements.
            </p>
            <Link
              href="/ai-advisor"
              data-testid="footer-cta-ai"
              className="btn-primary"
              style={{ fontSize: "11px", padding: "10px 18px" }}
            >
              Ask the AI →
            </Link>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: ".25em",
                  textTransform: "uppercase",
                  color: col.color,
                  marginBottom: "18px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textShadow: `0 0 10px ${col.color}55`,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: col.color, boxShadow: `0 0 8px ${col.color}` }} />
                {col.title}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", padding: 0 }}>
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13.5px",
                        color: "var(--chrome)",
                        textDecoration: "none",
                        transition: "color .15s",
                      }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = col.color; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--chrome)"; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--wire)", marginTop: "48px", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", maxWidth: "640px", lineHeight: 1.6 }}>
            <strong style={{ color: "#C4FF00", textShadow: "0 0 8px rgba(196, 255, 0, 0.4)" }}>AFFILIATE DISCLOSURE:</strong> Cryptoffiliate.com earns commissions via links at no cost to you. Ratings are independent. Not financial advice.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5C6890" }}>
            © {new Date().getFullYear()} CRYPTOFFILIATE
          </p>
        </div>
      </div>
    </footer>
  );
}
