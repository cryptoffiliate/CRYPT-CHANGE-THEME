"use client";

import { useState, useCallback } from "react";

// ─── Shared types ──────────────────────────────────────────────────────────────
export type CaptureVariant = "inline" | "banner" | "compact";

interface SubscribePayload {
  email: string;
  firstName?: string;
  preferences: string[];
}

type Status = "idle" | "loading" | "success" | "error";

const PREFERENCE_OPTIONS = [
  { id: "all",     label: "All new bonuses" },
  { id: "us_only", label: "US exchanges only" },
  { id: "no_kyc",  label: "No-KYC exchanges" },
  { id: "futures", label: "Futures & derivatives" },
  { id: "staking", label: "Staking & yield" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
function useSubscribe() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (payload: SubscribePayload) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Subscription failed.");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  return { subscribe, status, error };
}

// ─── Success state ─────────────────────────────────────────────────────────────
function SuccessState({ compact = false }: { compact?: boolean }) {
  return (
    <div
      data-testid="subscribe-success"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: compact ? "10px 0" : "16px 0",
        animation: "fadeUp .3s ease-out",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          background: "#00C853",
          border: "2px solid #111111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="15" viewBox="0 0 16 13" fill="none">
          <path d="M1.5 7L5.5 11L14.5 1.5" stroke="#111111" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 800, color: "#111111", letterSpacing: "-.01em" }}>
          You&apos;re subscribed.
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#4A4A4A", letterSpacing: ".04em", marginTop: 2 }}>
          ► Check your inbox for confirmation
        </p>
      </div>
    </div>
  );
}

// ─── Inline variant ───────────────────────────────────────────────────────────
export function BonusAlertInline() {
  const { subscribe, status, error } = useSubscribe();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [preferences, setPreferences] = useState<string[]>(["all"]);
  const [showPrefs, setShowPrefs] = useState(false);

  const togglePref = (id: string) => {
    if (id === "all") {
      setPreferences(["all"]);
      return;
    }
    setPreferences((prev) => {
      const without = prev.filter((p) => p !== "all");
      return without.includes(id)
        ? (without.filter((p) => p !== id).length ? without.filter((p) => p !== id) : ["all"])
        : [...without, id];
    });
  };

  const handleSubmit = () => {
    if (!email) return;
    subscribe({ email, firstName: firstName || undefined, preferences });
  };

  if (status === "success") {
    return (
      <div
        data-testid="bonus-alert-inline-success"
        style={{ background: "#FFFFFF", border: "2.5px solid #111111", boxShadow: "5px 5px 0 0 #111111", padding: "24px" }}
      >
        <SuccessState />
      </div>
    );
  }

  return (
    <div
      data-testid="bonus-alert-inline"
      style={{
        background: "#FFFFFF",
        border: "2.5px solid #111111",
        boxShadow: "6px 6px 0 0 #111111",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Diagonal stripe header */}
      <div style={{ height: "14px", background: "repeating-linear-gradient(-45deg, #FFD600 0 12px, #111111 12px 24px)", borderBottom: "2px solid #111111" }} />

      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "18px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "#FF5722",
              border: "2px solid #111111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "16px",
              fontWeight: 800,
              color: "#111111",
            }}
          >
            ▲
          </div>
          <div>
            <h3 className="heading-md" style={{ fontSize: "20px", marginBottom: 4 }}>
              Bonus alerts<span className="italic-serif" style={{ color: "#FF5722" }}>.</span>
            </h3>
            <p className="body-sm" style={{ color: "#111111", fontSize: "13px", lineHeight: 1.55 }}>
              We email you the moment a new exchange bonus drops — verified, no spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Social proof */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            background: "#F4F4F0",
            border: "1.5px solid #111111",
            marginBottom: "18px",
          }}
        >
          <div style={{ display: "flex", gap: 2 }}>
            {["#FF5722", "#002FA7", "#FFD600", "#00C853"].map((c) => (
              <div
                key={c}
                style={{ width: 18, height: 18, background: c, border: "1.5px solid #111111" }}
              />
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#111111", letterSpacing: ".06em" }}>
            <strong style={{ fontWeight: 800 }}>2,400+</strong> traders subscribed
          </p>
        </div>

        {/* Form */}
        <div style={{ display: "grid", gap: "10px", marginBottom: "14px" }}>
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            data-testid="bonus-firstname-input"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #111111",
              background: "#FFFFFF",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "#111111",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              data-testid="bonus-email-input"
              required
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "2px solid #111111",
                background: "#FFFFFF",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "#111111",
                outline: "none",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!email || status === "loading"}
              data-testid="bonus-subscribe-btn"
              className="btn-primary"
              style={{
                fontSize: "12px",
                padding: "10px 16px",
                opacity: !email || status === "loading" ? 0.5 : 1,
                cursor: !email || status === "loading" ? "default" : "pointer",
              }}
            >
              {status === "loading" ? "…" : "Alert me →"}
            </button>
          </div>
        </div>

        {/* Preferences toggle */}
        <button
          onClick={() => setShowPrefs((v) => !v)}
          data-testid="bonus-customize-toggle"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#FF5722",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            fontWeight: 700,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginBottom: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{showPrefs ? "▼" : "►"}</span>
          Customise what I get alerts for
        </button>

        {showPrefs && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px", marginBottom: "14px" }}>
            {PREFERENCE_OPTIONS.map((opt) => {
              const selected = preferences.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => togglePref(opt.id)}
                  data-testid={`bonus-pref-${opt.id}`}
                  style={{
                    textAlign: "left",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "8px 10px",
                    background: selected ? "#FFD600" : "#FFFFFF",
                    color: "#111111",
                    border: "1.5px solid #111111",
                    cursor: "pointer",
                    transition: "background .12s",
                    letterSpacing: ".02em",
                  }}
                >
                  {selected ? "● " : "○ "}
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#D50000", marginBottom: "10px", fontWeight: 700 }}>
            ⚠ {error}
          </p>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#4A4A4A", letterSpacing: ".04em", lineHeight: 1.6 }}>
          No spam · Unsubscribe in 1 click · Affiliate links disclosed in every email
        </p>
      </div>
    </div>
  );
}

// ─── Compact variant ──────────────────────────────────────────────────────────
export function BonusAlertCompact() {
  const { subscribe, status, error } = useSubscribe();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) return;
    subscribe({ email, preferences: ["all"] });
  };

  if (status === "success") return <SuccessState compact />;

  return (
    <div
      data-testid="bonus-alert-compact"
      style={{
        background: "#FFD600",
        border: "2px solid #111111",
        padding: "16px",
        boxShadow: "4px 4px 0 0 #111111",
      }}
    >
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "16px", color: "#111111", letterSpacing: "-.01em", marginBottom: 4 }}>
        ▲ Bonus alerts
      </p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#111111", marginBottom: "12px", lineHeight: 1.55, letterSpacing: ".02em" }}>
        Get notified the moment a new exchange bonus drops.
      </p>
      <div style={{ display: "flex", gap: "6px" }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          data-testid="bonus-compact-email"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "8px 10px",
            border: "2px solid #111111",
            background: "#FFFFFF",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "#111111",
            outline: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!email || status === "loading"}
          data-testid="bonus-compact-submit"
          style={{
            padding: "8px 12px",
            background: "#111111",
            color: "#F4F4F0",
            border: "2px solid #111111",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "11px",
            cursor: !email || status === "loading" ? "default" : "pointer",
            opacity: !email || status === "loading" ? 0.5 : 1,
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          {status === "loading" ? "…" : "Alert"}
        </button>
      </div>
      {error && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#D50000", marginTop: "8px", fontWeight: 700 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

// ─── Sticky banner ────────────────────────────────────────────────────────────
export function BonusAlertBanner() {
  const { subscribe, status } = useSubscribe();
  const [email, setEmail] = useState("");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || status === "success") return null;

  const handleSubmit = () => {
    if (!email) return;
    subscribe({ email, preferences: ["all"] });
  };

  return (
    <div
      data-testid="bonus-alert-banner"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#111111",
        borderTop: "3px solid #FFD600",
        animation: "fadeUp .35s ease-out",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "12px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "#FF5722",
              border: "2px solid #F4F4F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "16px",
              fontWeight: 800,
              color: "#111111",
            }}
          >
            ▲
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 800, color: "#F4F4F0", letterSpacing: "-.01em" }}>
              Bonus alerts
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#FFD600", letterSpacing: ".06em", textTransform: "uppercase" }}>
              Verified & instant
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", flex: 1, minWidth: 200 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            data-testid="bonus-banner-email"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "8px 12px",
              background: "#F4F4F0",
              border: "2px solid #F4F4F0",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "#111111",
              outline: "none",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!email}
            data-testid="bonus-banner-submit"
            style={{
              padding: "8px 16px",
              background: "#FF5722",
              color: "#111111",
              border: "2px solid #F4F4F0",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "12px",
              cursor: email ? "pointer" : "default",
              opacity: email ? 1 : 0.6,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Alert me →
          </button>
        </div>

        <button
          onClick={() => setDismissed(true)}
          data-testid="bonus-banner-dismiss"
          aria-label="Dismiss"
          style={{
            flexShrink: 0,
            width: "30px",
            height: "30px",
            background: "transparent",
            color: "#F4F4F0",
            border: "1.5px solid #F4F4F0",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: "1",
            fontFamily: "var(--font-mono)",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
