"use client";

import { useState } from "react";

interface CheckItem {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  affiliateLink?: { label: string; url: string; product: string };
}

const CHECKS: CheckItem[] = [
  // Account security
  { id: "2fa-exchange", category: "Account Security", title: "2FA on every exchange account", description: "Use an authenticator app (not SMS) on every exchange. SMS 2FA can be SIM-swapped in minutes.", priority: "critical" },
  { id: "unique-passwords", category: "Account Security", title: "Unique password on every exchange", description: "Reusing passwords means one breach exposes everything. Use a password manager to generate unique 32-character passwords.", priority: "critical", affiliateLink: { label: "Get Bitwarden free →", url: "https://bitwarden.com/?ref=cryptoffiliate", product: "Bitwarden" } },
  { id: "hardware-key", category: "Account Security", title: "Hardware security key for withdrawals", description: "YubiKey or similar as a second factor specifically for withdrawal approvals. Even if your phone is compromised, withdrawals are blocked.", priority: "high" },
  { id: "email-security", category: "Account Security", title: "Secure your recovery email", description: "Your exchange is only as secure as your email. Enable 2FA on your email too — preferably a separate email only used for crypto.", priority: "critical" },
  { id: "withdrawal-whitelist", category: "Account Security", title: "Whitelist withdrawal addresses", description: "Lock withdrawals to pre-approved addresses. Any new address requires email confirmation and a 24-hour delay.", priority: "high" },

  // Private key / wallet security
  { id: "hardware-wallet", category: "Cold Storage", title: "Hardware wallet for long-term holdings", description: "Keep anything you're not actively trading in cold storage. A $79 Trezor Safe 3 protects unlimited value.", priority: "critical", affiliateLink: { label: "Get Trezor Safe 3 →", url: "https://trezor.io/affiliate?ref=CRYPTOFFILIATE", product: "Trezor" } },
  { id: "seed-backup", category: "Cold Storage", title: "Seed phrase stored offline and securely", description: "Never photograph it. Never type it into any website. Store it in at least 2 physical locations on fire-resistant material.", priority: "critical" },
  { id: "seed-test", category: "Cold Storage", title: "Test your seed phrase recovery", description: "Before storing real value, verify your seed phrase actually restores your wallet. Do a full wipe and recovery with small funds first.", priority: "high" },
  { id: "multisig", category: "Cold Storage", title: "Consider multi-signature for large holdings", description: "For holdings over $50k, consider a 2-of-3 multisig setup where no single device can sign a transaction alone.", priority: "medium" },

  // Network & privacy
  { id: "vpn", category: "Network Security", title: "VPN when accessing exchanges on public WiFi", description: "Your ISP and anyone on a public network can see which exchanges you use. A VPN encrypts this and hides your IP from blockchain analytics.", priority: "high", affiliateLink: { label: "Get NordVPN →", url: "https://nordvpn.com/?aff=cryptoffiliate", product: "NordVPN" } },
  { id: "dedicated-device", category: "Network Security", title: "Dedicated device for large transactions", description: "For anything over $10k, use a dedicated phone or laptop used only for crypto — no social media, no random apps.", priority: "medium" },
  { id: "dns-protection", category: "Network Security", title: "Use a privacy-respecting DNS resolver", description: "Cloudflare 1.1.1.1 or NextDNS blocks malicious crypto phishing domains before your browser can visit them.", priority: "medium" },

  // Monitoring & backup
  { id: "check-approvals", category: "Monitoring", title: "Regularly review API key permissions", description: "If you've ever connected a trading bot or DeFi protocol, audit which apps have access to your exchange accounts.", priority: "high" },
  { id: "address-monitoring", category: "Monitoring", title: "Monitor wallet addresses for unauthorised transactions", description: "Use a service like Etherscan's notification system to get alerted if any unexpected transaction leaves your wallet.", priority: "medium" },
  { id: "password-manager", category: "Monitoring", title: "Password manager with breach alerts", description: "Bitwarden and 1Password alert you when your credentials appear in known data breaches.", priority: "high", affiliateLink: { label: "Get 1Password →", url: "https://1password.com/ref/cryptoffiliate", product: "1Password" } },
];

const PRIORITY_CONFIG = {
  critical: { color: "#ef4444", bg: "#ef444415", label: "Critical" },
  high:     { color: "#f97316", bg: "#f9731615", label: "High" },
  medium:   { color: "#f59e0b", bg: "#f59e0b15", label: "Medium" },
  low:      { color: "#22c55e", bg: "#22c55e15", label: "Low" },
};

export default function SecurityAuditPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>("all");

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const score = Math.round((checked.size / CHECKS.length) * 100);
  const criticalDone = CHECKS.filter((c) => c.priority === "critical" && checked.has(c.id)).length;
  const criticalTotal = CHECKS.filter((c) => c.priority === "critical").length;

  const categories = [...new Set(CHECKS.map((c) => c.category))];
  const filtered = filter === "all" ? CHECKS : CHECKS.filter((c) => c.category === filter || c.priority === filter);

  const scoreColor = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel = score >= 80 ? "Well secured" : score >= 50 ? "Needs improvement" : "At risk";

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">World first · Personalised audit</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Crypto security <span className="italic-serif">audit</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "500px" }}>
            How secure is your crypto setup? Work through this checklist to find and fix your vulnerabilities before someone else does.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        {/* Score */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", alignItems: "center", background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "24px", marginBottom: "24px" }}>
          {/* Score circle */}
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            <svg viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: scoreColor }}>{score}</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: scoreColor, marginBottom: "4px" }}>{scoreLabel}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--chrome)", marginBottom: "8px" }}>
              {checked.size}/{CHECKS.length} items completed · {criticalDone}/{criticalTotal} critical items done
            </p>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "99px", overflow: "hidden", maxWidth: "300px" }}>
              <div style={{ height: "100%", width: `${score}%`, background: scoreColor, borderRadius: "99px", transition: "width .4s ease" }} />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button onClick={() => setFilter("all")}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${filter === "all" ? "var(--gold)" : "var(--wire)"}`, background: filter === "all" ? "var(--gold-dim)" : "transparent", color: filter === "all" ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
            All ({CHECKS.length})
          </button>
          <button onClick={() => setFilter("critical")}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${filter === "critical" ? "#ef4444" : "var(--wire)"}`, background: filter === "critical" ? "#ef444415" : "transparent", color: filter === "critical" ? "#ef4444" : "var(--chrome)", cursor: "pointer" }}>
            Critical first
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${filter === cat ? "var(--gold)" : "var(--wire)"}`, background: filter === cat ? "var(--gold-dim)" : "transparent", color: filter === cat ? "var(--gold)" : "var(--chrome)", cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((item) => {
            const done = checked.has(item.id);
            const pc = PRIORITY_CONFIG[item.priority];
            return (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                style={{ background: done ? "rgba(34,197,94,0.06)" : "var(--ink-2)", border: `1px solid ${done ? "#22c55e30" : "var(--wire)"}`, borderRadius: "var(--radius-lg)", padding: "16px 18px", cursor: "pointer", transition: "all .15s", display: "flex", gap: "14px", alignItems: "flex-start" }}
              >
                {/* Checkbox */}
                <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${done ? "#22c55e" : "var(--wire)"}`, background: done ? "#22c55e" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", transition: "all .15s" }}>
                  {done && <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: done ? "var(--chrome)" : "var(--paper)", textDecoration: done ? "line-through" : "none", margin: 0 }}>
                      {item.title}
                    </p>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", padding: "2px 8px", borderRadius: "99px", background: pc.bg, color: pc.color, letterSpacing: ".06em", flexShrink: 0 }}>
                      {pc.label}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--chrome)", letterSpacing: ".06em" }}>
                      {item.category}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--chrome)", lineHeight: 1.55, margin: "0 0 (item.affiliateLink ? '10px' : '0')" }}>
                    {item.description}
                  </p>
                  {item.affiliateLink && !done && (
                    <a
                      href={item.affiliateLink.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gold)", textDecoration: "none", marginTop: "8px", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "4px 10px" }}
                    >
                      {item.affiliateLink.label}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {score === 100 && (
          <div style={{ marginTop: "24px", background: "#22c55e15", border: "1px solid #22c55e40", borderRadius: "var(--radius-xl)", padding: "24px", textAlign: "center" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>🔐</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "#22c55e", marginBottom: "8px" }}>Excellent security setup</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)" }}>You've covered all the bases. Re-run this audit every 6 months to stay current.</p>
          </div>
        )}
      </div>
    </div>
  );
}
