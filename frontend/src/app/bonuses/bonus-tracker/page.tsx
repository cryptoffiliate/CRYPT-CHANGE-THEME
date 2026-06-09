"use client";

import { useState, useEffect } from "react";
import { EXCHANGES } from "@/data/exchanges";

interface BonusDeal {
  id: string;
  exchangeId: string;
  exchangeName: string;
  logoColor: string;
  logo: string;
  title: string;
  description: string;
  promoCode?: string;
  expiresAt: Date | null;
  isLimited: boolean;
  affiliateUrl: string;
  commission: string;
  category: "welcome" | "referral" | "promo" | "ongoing";
}

const BONUS_DEALS: BonusDeal[] = [
  { id: "1", exchangeId: "binance",  exchangeName: "Binance",  logoColor: "#F0B90B", logo: "B",   title: "20% fee discount for life",          description: "New users get a permanent 20% discount on all trading fees using our exclusive referral link.", expiresAt: null, isLimited: false, affiliateUrl: "https://www.binance.com/en/register?ref=CRYPTOFFILIATE", commission: "50% revenue share", category: "referral" },
  { id: "2", exchangeId: "coinbase", exchangeName: "Coinbase", logoColor: "#0052FF", logo: "C",   title: "$10 in free Bitcoin",                description: "Sign up with our link and earn $10 in BTC after your first $100 trade. Paid within 3 days.", expiresAt: null, isLimited: false, affiliateUrl: "https://coinbase.com/join/CRYPTOFFILIATE", commission: "$10 CPA", category: "welcome" },
  { id: "3", exchangeId: "kraken",   exchangeName: "Kraken",   logoColor: "#5741D9", logo: "K",   title: "0% maker fee for 30 days",           description: "New users get zero maker fees on all spot trades for 30 days. Valid on Advanced trading interface.", expiresAt: new Date(Date.now() + 14 * 86400000), isLimited: true, affiliateUrl: "https://www.kraken.com/sign-up?ref=CRYPTOFFILIATE", commission: "20% revenue share", category: "promo" },
  { id: "4", exchangeId: "bybit",    exchangeName: "Bybit",    logoColor: "#F7A600", logo: "BY",  title: "Up to $30,000 in welcome bonuses",   description: "Complete tasks in Bybit's rewards hub to earn up to $30,000 in trading bonuses. Limited time campaign.", expiresAt: new Date(Date.now() + 7 * 86400000), isLimited: true, affiliateUrl: "https://www.bybit.com/register?affiliate_id=CRYPTOFFILIATE", commission: "30% revenue share", category: "welcome" },
  { id: "5", exchangeId: "okx",      exchangeName: "OKX",      logoColor: "#00B578", logo: "OKX", title: "Mystery box up to $10,000",           description: "New users receive a mystery box worth up to $10,000 in crypto on first deposit. Value revealed after opening.", expiresAt: new Date(Date.now() + 21 * 86400000), isLimited: true, affiliateUrl: "https://www.okx.com/join/CRYPTOFFILIATE", commission: "50% revenue share", category: "welcome" },
];

function Countdown({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = expiresAt.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isUrgent = expiresAt.getTime() - Date.now() < 3 * 86400000;
  const color = isUrgent ? "#ef4444" : "#f59e0b";

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>Expires in:</span>
      {[
        { value: timeLeft.d, label: "d" },
        { value: timeLeft.h, label: "h" },
        { value: timeLeft.m, label: "m" },
        { value: timeLeft.s, label: "s" },
      ].map(({ value, label }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: color + "15", border: `1px solid ${color}40`, borderRadius: "6px", padding: "3px 7px", minWidth: "32px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color, lineHeight: 1 }}>
            {value.toString().padStart(2, "0")}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color, opacity: 0.7 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function BonusTrackerPage() {
  const [filter, setFilter] = useState("all");
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const filtered = filter === "all" ? BONUS_DEALS : BONUS_DEALS.filter((b) => b.category === filter || b.exchangeId === filter);
  const expiring = BONUS_DEALS.filter((b) => b.expiresAt && b.expiresAt.getTime() - Date.now() < 7 * 86400000);

  const toggleNotify = (id: string) => {
    setNotified((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Live countdowns · Updated daily</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Bonus <span className="italic-serif">tracker</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Every active exchange bonus with live expiry countdowns. Never miss a limited-time offer again.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        {/* Expiring soon alert */}
        {expiring.length > 0 && (
          <div style={{ background: "#ef444410", border: "1px solid #ef444430", borderRadius: "var(--radius-lg)", padding: "14px 18px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>⏰</span>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "#ef4444", marginBottom: "2px" }}>
                {expiring.length} bonus{expiring.length > 1 ? "es" : ""} expiring within 7 days
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>
                {expiring.map((b) => b.exchangeName).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
          {["all", "welcome", "referral", "promo", "ongoing"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${filter === f ? "var(--gold)" : "var(--wire)"}`, background: filter === f ? "var(--gold-dim)" : "transparent", color: filter === f ? "var(--gold)" : "var(--chrome)", cursor: "pointer", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
          {EXCHANGES.map((e) => (
            <button key={e.id} onClick={() => setFilter(e.id)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${filter === e.id ? e.logoColor : "var(--wire)"}`, background: filter === e.id ? e.logoColor + "15" : "transparent", color: filter === e.id ? e.logoColor : "var(--chrome)", cursor: "pointer" }}>
              {e.name}
            </button>
          ))}
        </div>

        {/* Bonus cards */}
        <div style={{ display: "grid", gap: "12px" }}>
          {filtered.map((bonus) => {
            const isExpiring = bonus.expiresAt && bonus.expiresAt.getTime() - Date.now() < 3 * 86400000;
            return (
              <div key={bonus.id} style={{ background: "var(--ink-2)", border: `1px solid ${isExpiring ? "#ef444430" : "var(--wire)"}`, borderRadius: "var(--radius-xl)", padding: "20px 22px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Exchange chip */}
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "11px", fontWeight: 900, background: bonus.logoColor + "18", border: `1.5px solid ${bonus.logoColor}40`, color: bonus.logoColor, flexShrink: 0 }}>
                    {bonus.logo}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--paper)" }}>{bonus.exchangeName}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", padding: "2px 8px", borderRadius: "99px", background: bonus.logoColor + "15", color: bonus.logoColor, border: `1px solid ${bonus.logoColor}30`, textTransform: "capitalize" }}>
                        {bonus.category}
                      </span>
                      {!bonus.expiresAt && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", padding: "2px 8px", borderRadius: "99px", background: "#22c55e10", color: "#22c55e", border: "1px solid #22c55e25" }}>
                          Ongoing
                        </span>
                      )}
                    </div>

                    <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--paper)", marginBottom: "4px" }}>{bonus.title}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--chrome)", lineHeight: 1.5, marginBottom: "12px" }}>{bonus.description}</p>

                    {bonus.expiresAt && (
                      <div style={{ marginBottom: "12px" }}>
                        <Countdown expiresAt={bonus.expiresAt} />
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                      <a href={bonus.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                        style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, background: bonus.logoColor, color: "white", padding: "9px 20px", borderRadius: "99px", textDecoration: "none", whiteSpace: "nowrap" }}>
                        Claim bonus →
                      </a>
                      <button onClick={() => toggleNotify(bonus.id)}
                        style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: notified.has(bonus.id) ? "var(--gold)" : "var(--chrome)", background: notified.has(bonus.id) ? "var(--gold-dim)" : "transparent", border: `1px solid ${notified.has(bonus.id) ? "rgba(201,168,76,0.3)" : "var(--wire)"}`, borderRadius: "99px", padding: "7px 14px", cursor: "pointer" }}>
                        {notified.has(bonus.id) ? "🔔 Notified" : "🔔 Alert me"}
                      </button>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>
                        Affiliate: {bonus.commission}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", marginTop: "24px", lineHeight: 1.6 }}>
          Affiliate disclosure: we earn commissions through links on this page. Bonus availability and expiry dates are approximate and subject to change by the exchange. Always verify on the exchange's official site before depositing.
        </p>
      </div>
    </div>
  );
}
