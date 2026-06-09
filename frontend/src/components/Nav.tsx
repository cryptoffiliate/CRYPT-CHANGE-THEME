"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS = [
  {
    label: "Exchanges",
    href: "/compare",
    color: "#00F0FF",
    items: [
      { href: "/compare",              label: "Compare exchanges",     desc: "Side-by-side fees & features" },
      { href: "/reviews",              label: "Exchange reviews",       desc: "In-depth reviews of every exchange" },
      { href: "/bonuses",              label: "Signup bonuses",         desc: "Verified promo codes & offers" },
      { href: "/bonuses/bonus-tracker",label: "Bonus tracker",          desc: "Live countdown timers on all offers" },
      { href: "/community/fee-reports",label: "Community fee reports",  desc: "Real fees paid by real traders" },
      { href: "/community/reviews",    label: "User reviews",           desc: "Community exchange ratings" },
      { href: "/quiz",                 label: "Find my exchange",        desc: "5-question personalised match", highlight: true },
    ],
  },
  {
    label: "Wallets",
    href: "/hardware-wallets",
    color: "#00FF94",
    items: [
      { href: "/hardware-wallets",                  label: "All hardware wallets",  desc: "Ledger, Trezor, CoolWallet" },
      { href: "/hardware-wallets/ledger",           label: "Ledger review",         desc: "Nano X, Flex, Stax — all models" },
      { href: "/hardware-wallets/trezor",           label: "Trezor review",         desc: "Safe 3, Safe 5, Safe 7" },
      { href: "/hardware-wallets/ledger-vs-trezor", label: "Ledger vs Trezor",      desc: "Definitive head-to-head", highlight: true },
    ],
  },
  {
    label: "Tools",
    href: "/tools/fee-breakdown",
    color: "#FF8A3D",
    items: [
      { href: "/tools/fee-breakdown",        label: "Hidden fee calculator",   desc: "See what you're really paying" },
      { href: "/tools/fee-analyst",          label: "AI fee analyst",          desc: "Upload CSV → find what you overpaid" },
      { href: "/tools/migration-planner",    label: "Migration planner",       desc: "Step-by-step exchange switch" },
      { href: "/tools/profit-calculator",    label: "Profit calculator",        desc: "P&L including fees" },
      { href: "/tools/fee-trends",           label: "Fee trends",               desc: "90-day historical fee charts" },
      { href: "/tools/portfolio-health",     label: "Portfolio health check",   desc: "AI risk assessment", highlight: true },
      { href: "/tools/dca-planner",          label: "DCA planner",              desc: "AI-optimised buy schedule" },
      { href: "/tools/jurisdiction-checker", label: "Jurisdiction checker",     desc: "Which exchanges work in your country" },
    ],
  },
  {
    label: "Tax & Security",
    href: "/tax-software",
    color: "#B026FF",
    items: [
      { href: "/tax-software",               label: "Crypto tax software",     desc: "Koinly, CoinLedger, ZenLedger" },
      { href: "/tax-harvesting",             label: "Tax-loss harvesting",     desc: "Year-end savings scanner" },
      { href: "/security",                   label: "Security overview",        desc: "The essential crypto stack" },
      { href: "/security-audit",             label: "Security audit",          desc: "Interactive personal checklist" },
      { href: "/security/vpn",               label: "Best VPNs",               desc: "NordVPN, Proton, ExpressVPN" },
      { href: "/security/password-managers", label: "Password managers",       desc: "Bitwarden vs 1Password" },
    ],
  },
  {
    label: "Discover",
    href: "/ai-advisor",
    color: "#C4FF00",
    items: [
      { href: "/ai-advisor",             label: "AI advisor",              desc: "Ask anything about crypto", highlight: true },
      { href: "/scam-detector",          label: "Scam detector",           desc: "Check any URL with AI" },
      { href: "/whitepaper",             label: "Whitepaper analyser",     desc: "AI summary of any whitepaper" },
      { href: "/status",                 label: "Exchange status",          desc: "Live uptime monitoring" },
      { href: "/proof-of-reserves",      label: "Proof of reserves",        desc: "Who has audits" },
      { href: "/volume",                 label: "Volume league table",      desc: "24h trading rankings" },
      { href: "/regulatory-monitor",     label: "Regulatory monitor",       desc: "SEC/FCA/MiCA updates" },
      { href: "/trading-bots",           label: "Trading bots",             desc: "WunderTrading, 3Commas, TradingView" },
      { href: "/cloud-mining",           label: "Cloud mining",             desc: "NiceHash, ECOS, BitFuFu" },
    ],
  },
];

function Dropdown({ group, isOpen, onClose }: { group: typeof NAV_GROUPS[0]; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div
      onMouseLeave={onClose}
      data-testid={`nav-dropdown-${group.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: 0,
        width: "320px",
        background: "rgba(11, 14, 24, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--wire)",
        borderRadius: "14px",
        overflow: "hidden",
        zIndex: 50,
        boxShadow: `0 0 0 1px ${group.color}30, 0 18px 48px rgba(0, 0, 0, 0.6), 0 0 28px ${group.color}28`,
      }}
    >
      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${group.color}, transparent)`, boxShadow: `0 0 14px ${group.color}` }} />
      <div style={{ padding: "10px", maxHeight: "440px", overflowY: "auto" }}>
        {group.items.map(({ href, label, desc, highlight }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            data-testid={`nav-link-${href.split("/").filter(Boolean).join("-")}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              padding: "10px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              background: highlight ? `${group.color}14` : "transparent",
              borderLeft: highlight ? `2px solid ${group.color}` : "2px solid transparent",
              marginBottom: "2px",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = `${group.color}1F`;
              el.style.borderLeftColor = group.color;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = highlight ? `${group.color}14` : "transparent";
              el.style.borderLeftColor = highlight ? group.color : "transparent";
            }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 600, color: "var(--paper)" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", color: "var(--chrome)", letterSpacing: ".02em" }}>{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(5, 6, 10, 0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} onClick={onClose} />
      <div
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "340px",
          maxWidth: "95vw",
          height: "100%",
          background: "#0B0E18",
          borderLeft: "1px solid var(--wire)",
          boxShadow: "-30px 0 60px rgba(0, 0, 0, 0.6), -1px 0 28px rgba(0, 240, 255, 0.18)",
          display: "flex",
          flexDirection: "column",
        }}
        data-testid="mobile-menu"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", height: "64px", borderBottom: "1px solid var(--wire)", background: "#05060A" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "20px", letterSpacing: "-.02em", color: "var(--paper)" }}>
            CRYPTO<span className="holo-text">/F</span>FILIATE
          </span>
          <button
            onClick={onClose}
            data-testid="mobile-menu-close"
            style={{ width: "34px", height: "34px", background: "rgba(0, 240, 255, 0.1)", border: "1px solid #00F0FF", borderRadius: "999px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F0FF" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {NAV_GROUPS.map((g) => (
            <div key={g.href} style={{ marginBottom: "12px", border: "1px solid var(--wire)", borderRadius: "12px", background: "rgba(19, 23, 38, 0.7)", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "10px", color: g.color, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600, borderBottom: "1px solid var(--wire)", background: `linear-gradient(90deg, ${g.color}1A, transparent)` }}>
                {g.label}
              </div>
              {g.items.map(({ href, label, highlight }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  style={{ display: "block", padding: "10px 14px", textDecoration: "none", fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 500, color: "var(--paper)", background: highlight ? `${g.color}10` : "transparent", borderBottom: "1px solid var(--wire-soft)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px", borderTop: "1px solid var(--wire)", display: "flex", flexDirection: "column", gap: "10px", background: "#05060A" }}>
          <Link href="/alerts" onClick={onClose} className="btn-ghost" style={{ justifyContent: "center" }}>
            Bonus alerts
          </Link>
          <Link href="/ai-advisor" onClick={onClose} className="btn-primary" style={{ justifyContent: "center" }}>
            Ask the AI →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenGroup(null); }, [pathname]);

  return (
    <>
      <header
        className="nav-dark"
        data-testid="main-nav"
      >
        <div className="container" style={{ height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <Link
            href="/"
            data-testid="logo-link"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "22px",
              color: "var(--paper)",
              textDecoration: "none",
              letterSpacing: "-.03em",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #00F0FF, #B026FF)",
                color: "#04060B",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                letterSpacing: ".12em",
                boxShadow: "0 0 14px rgba(0, 240, 255, 0.45)",
              }}
            >
              CF
            </span>
            CRYPTO<span className="holo-text">/</span>FFILIATE
          </Link>

          <nav ref={navRef} style={{ display: "flex", alignItems: "center", gap: "2px", position: "relative" }} className="hidden md:flex">
            {NAV_GROUPS.map((g) => {
              const isActive = pathname?.startsWith(g.href);
              const isOpen = openGroup === g.href;
              return (
                <div key={g.href} style={{ position: "relative" }}>
                  <button
                    onMouseEnter={() => setOpenGroup(g.href)}
                    onClick={() => setOpenGroup(isOpen ? null : g.href)}
                    data-testid={`nav-group-${g.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      border: `1px solid ${isActive || isOpen ? g.color : "transparent"}`,
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      background: isActive || isOpen ? `${g.color}14` : "transparent",
                      color: isActive || isOpen ? g.color : "var(--paper)",
                      transition: "all .18s",
                      boxShadow: isActive || isOpen ? `0 0 18px ${g.color}55` : "none",
                    }}
                  >
                    {g.label}
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <Dropdown group={g} isOpen={isOpen} onClose={() => setOpenGroup(null)} />
                </div>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <Link
              href="/alerts"
              className="hidden md:inline-flex"
              data-testid="nav-alerts"
              style={{
                padding: "8px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                color: "#C4FF00",
                textDecoration: "none",
                border: "1px solid #C4FF00",
                borderRadius: "999px",
                background: "rgba(196, 255, 0, 0.08)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                boxShadow: "0 0 14px rgba(196, 255, 0, 0.25)",
              }}
            >
              ▲ Alerts
            </Link>
            <Link
              href="/ai-advisor"
              className="hidden md:inline-flex btn-primary"
              data-testid="nav-cta-ai"
              style={{ fontSize: "11px", padding: "9px 16px" }}
            >
              Ask AI →
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              data-testid="mobile-menu-toggle"
              className="md:hidden"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid #00F0FF",
                background: "rgba(0, 240, 255, 0.1)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00F0FF",
                boxShadow: "0 0 16px rgba(0, 240, 255, 0.25)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
