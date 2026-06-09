"use client";

import { useState, useEffect } from "react";
import { EXCHANGES } from "@/data/exchanges";

interface Review {
  id: string;
  exchangeId: string;
  exchangeName: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  pros: string;
  cons: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  usageMonths: number;
  tradingVolume: string;
}

const MOCK_REVIEWS: Review[] = [
  { id: "r1", exchangeId: "binance",  exchangeName: "Binance",  author: "CryptoTrader_TX",  rating: 5, title: "Best fees, huge selection", body: "Been on Binance for 3 years now. The 0.1% fee is unbeatable and with BNB it drops further. Never had a withdrawal issue. App is fast.", pros: "Lowest fees, 350+ coins, fast app", cons: "No US access, occasional KYC delays", verified: true,  helpful: 47, createdAt: "2025-05-20", usageMonths: 36, tradingVolume: "$10k+" },
  { id: "r2", exchangeId: "coinbase", exchangeName: "Coinbase", author: "ETH_Hodler_2019",   rating: 3, title: "Good for beginners, expensive for traders", body: "Coinbase is the easiest on-ramp for new users. But once you know what you're doing, switch to Advanced Trade or leave entirely. The simple interface fees are a ripoff.", pros: "Super easy to use, FDIC insured, great support", cons: "0.6% taker fee on Advanced, simple UI charges up to 4%", verified: true,  helpful: 62, createdAt: "2025-05-15", usageMonths: 48, tradingVolume: "$1k-5k" },
  { id: "r3", exchangeId: "kraken",   exchangeName: "Kraken",   author: "SecurityFirst",     rating: 5, title: "Most trustworthy exchange I've used", body: "Kraken has never been hacked in 13 years. Customer support actually responds. Fees are fair. Only downside is the UI is a bit dated.", pros: "Never been hacked, excellent customer support, US-available", cons: "UI not as polished as competitors, smaller coin selection", verified: true,  helpful: 38, createdAt: "2025-04-28", usageMonths: 24, tradingVolume: "$5k-10k" },
  { id: "r4", exchangeId: "okx",      exchangeName: "OKX",      author: "DeFi_Native",      rating: 4, title: "Lowest fees + built-in Web3 wallet", body: "0.08% maker fee is genuinely the lowest among major exchanges. The built-in Web3 wallet is actually good. Only reason it's 4 stars: not available in the US.", pros: "Cheapest fees, Web3 wallet, excellent DeFi integration", cons: "Not US-available, less known = harder to trust initially", verified: false, helpful: 29, createdAt: "2025-04-10", usageMonths: 18, tradingVolume: "$5k-10k" },
  { id: "r5", exchangeId: "bybit",    exchangeName: "Bybit",    author: "FuturesTrader",     rating: 4, title: "Best for derivatives, solid spot", body: "Bybit's perpetual futures are excellent — deep liquidity, fast execution. Spot trading is solid too. No KYC option for small accounts is great.", pros: "Excellent futures, no KYC option, generous bonuses", cons: "Not US-available, withdrawal confirmation can be slow", verified: true,  helpful: 21, createdAt: "2025-03-30", usageMonths: 12, tradingVolume: "$10k+" },
];

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 14 14" fill="none">
          <path d="M7 1l1.5 3.5 3.5.3-2.6 2.4.8 3.6L7 9.1l-3.2 1.7.8-3.6L2 4.8l3.5-.3z"
            fill={s <= Math.round(rating) ? "#c9a84c" : "rgba(255,255,255,0.1)"}
            stroke="none" />
        </svg>
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
          <svg width="24" height="24" viewBox="0 0 14 14">
            <path d="M7 1l1.5 3.5 3.5.3-2.6 2.4.8 3.6L7 9.1l-3.2 1.7.8-3.6L2 4.8l3.5-.3z"
              fill={s <= (hover || value) ? "#c9a84c" : "rgba(255,255,255,0.1)"} />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function CommunityReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [filterExchange, setFilterExchange] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("helpful");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ exchangeId: "", rating: 0, title: "", body: "", pros: "", cons: "", author: "", tradingVolume: "", usageMonths: "6" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [helpful, setHelpful] = useState<Set<string>>(new Set());

  const filtered = reviews
    .filter((r) => filterExchange === "all" || r.exchangeId === filterExchange)
    .sort((a, b) => sortBy === "recent" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : sortBy === "helpful" ? b.helpful - a.helpful : b.rating - a.rating);

  const avgByExchange = EXCHANGES.reduce((acc, e) => {
    const exReviews = reviews.filter((r) => r.exchangeId === e.id);
    acc[e.id] = exReviews.length ? exReviews.reduce((s, r) => s + r.rating, 0) / exReviews.length : 0;
    return acc;
  }, {} as Record<string, number>);

  const markHelpful = (id: string) => {
    if (helpful.has(id)) return;
    setHelpful((prev) => new Set([...prev, id]));
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
  };

  const submit = async () => {
    if (!form.exchangeId || !form.rating || !form.body) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    const exchange = EXCHANGES.find((e) => e.id === form.exchangeId);
    const newReview: Review = {
      id: Date.now().toString(),
      exchangeId: form.exchangeId,
      exchangeName: exchange?.name ?? "",
      author: form.author || "Anonymous",
      rating: form.rating,
      title: form.title || `${form.rating}/5 star review`,
      body: form.body,
      pros: form.pros,
      cons: form.cons,
      verified: false,
      helpful: 0,
      createdAt: new Date().toISOString().split("T")[0],
      usageMonths: parseInt(form.usageMonths) || 6,
      tradingVolume: form.tradingVolume || "Unknown",
    };
    setReviews((prev) => [newReview, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setForm({ exchangeId: "", rating: 0, title: "", body: "", pros: "", cons: "", author: "", tradingVolume: "", usageMonths: "6" });
    setSubmitting(false);
  };

  const ratingCounts = (exId: string) => {
    const exR = reviews.filter((r) => r.exchangeId === exId);
    return [5, 4, 3, 2, 1].map((star) => ({
      star, count: exR.filter((r) => r.rating === star).length,
      pct: exR.length ? (exR.filter((r) => r.rating === star).length / exR.length) * 100 : 0,
    }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Community · AI-moderated</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Exchange <span className="italic-serif">reviews</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Real reviews from verified traders. Every submission is screened by AI for fake reviews and exchange self-promotion before publishing.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        {/* Exchange rating overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "32px" }}>
          {EXCHANGES.map((e) => {
            const avg = avgByExchange[e.id];
            const count = reviews.filter((r) => r.exchangeId === e.id).length;
            return (
              <div key={e.id}
                onClick={() => setFilterExchange(filterExchange === e.id ? "all" : e.id)}
                style={{ background: filterExchange === e.id ? e.logoColor + "15" : "var(--ink-2)", border: `1px solid ${filterExchange === e.id ? e.logoColor + "40" : "var(--wire)"}`, borderRadius: "var(--radius-lg)", padding: "14px", cursor: "pointer", transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "9px", fontWeight: 900, background: e.logoColor + "18", color: e.logoColor }}>
                    {e.logo}
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: "var(--paper)" }}>{e.name}</span>
                </div>
                {avg > 0 ? (
                  <>
                    <StarDisplay rating={avg} size={12} />
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", marginTop: "4px" }}>{avg.toFixed(1)}/5 · {count} review{count !== 1 ? "s" : ""}</p>
                  </>
                ) : (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)" }}>No reviews yet</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {(["helpful", "recent", "rating"] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "6px 14px", borderRadius: "99px", border: `1px solid ${sortBy === s ? "var(--gold)" : "var(--wire)"}`, background: sortBy === s ? "var(--gold-dim)" : "transparent", color: sortBy === s ? "var(--gold)" : "var(--chrome)", cursor: "pointer", textTransform: "capitalize" }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowForm(true)}
            style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, background: "var(--gold)", color: "var(--ink)", padding: "8px 20px", borderRadius: "99px", border: "none", cursor: "pointer" }}>
            + Write a review
          </button>
        </div>

        {submitted && (
          <div style={{ background: "#22c55e10", border: "1px solid #22c55e30", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#22c55e" }}>✓ Review submitted — thank you! It will be visible after AI moderation (usually instant).</p>
          </div>
        )}

        {/* Reviews */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((review) => {
            const exchange = EXCHANGES.find((e) => e.id === review.exchangeId);
            return (
              <div key={review.id} style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "20px 22px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "10px", fontWeight: 900, background: exchange?.logoColor + "18", color: exchange?.logoColor, flexShrink: 0 }}>
                        {exchange?.logo}
                      </div>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--paper)" }}>{review.exchangeName}</span>
                      <StarDisplay rating={review.rating} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: review.rating >= 4 ? "#22c55e" : review.rating === 3 ? "#f59e0b" : "#ef4444" }}>
                        {review.rating}/5
                      </span>
                      {review.verified && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", padding: "2px 7px", borderRadius: "99px", background: "#22c55e10", color: "#22c55e", border: "1px solid #22c55e25" }}>
                          ✓ Verified user
                        </span>
                      )}
                    </div>

                    <p style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--paper)", marginBottom: "6px" }}>{review.title}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--chrome)", lineHeight: 1.6, marginBottom: "10px" }}>{review.body}</p>

                    {(review.pros || review.cons) && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                        {review.pros && (
                          <div style={{ background: "#22c55e08", border: "1px solid #22c55e20", borderRadius: "8px", padding: "8px 12px" }}>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#22c55e", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "3px" }}>Pros</p>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--paper)" }}>{review.pros}</p>
                          </div>
                        )}
                        {review.cons && (
                          <div style={{ background: "#ef444408", border: "1px solid #ef444420", borderRadius: "8px", padding: "8px 12px" }}>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#ef4444", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "3px" }}>Cons</p>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--paper)" }}>{review.cons}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>
                        {review.author} · {review.usageMonths}mo user · {review.tradingVolume}/mo
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)" }}>{review.createdAt}</span>
                      <button onClick={() => markHelpful(review.id)} disabled={helpful.has(review.id)}
                        style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: helpful.has(review.id) ? "#22c55e" : "var(--chrome)", background: "transparent", border: `1px solid ${helpful.has(review.id) ? "#22c55e40" : "var(--wire)"}`, borderRadius: "6px", padding: "3px 10px", cursor: helpful.has(review.id) ? "default" : "pointer" }}>
                        👍 Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit form */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflowY: "auto" }}>
            <div style={{ background: "var(--ink-2)", border: "1px solid var(--wire)", borderRadius: "var(--radius-xl)", padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--paper)", marginBottom: "6px" }}>Write a review</h3>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--chrome)", marginBottom: "20px" }}>AI-moderated · No fake reviews · Published within minutes</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>Which exchange?</p>
                  <select value={form.exchangeId} onChange={(e) => setForm((f) => ({ ...f, exchangeId: e.target.value }))}
                    style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "13px", outline: "none" }}>
                    <option value="">Select exchange</option>
                    {EXCHANGES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>

                <div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".08em" }}>Your rating</p>
                  <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                </div>

                {[
                  { field: "title", label: "Review title", placeholder: "e.g. Best fees but US users beware" },
                  { field: "body", label: "Your review", placeholder: "Share your experience — what you like, what could be better..." },
                  { field: "pros", label: "Pros", placeholder: "What's good about it?" },
                  { field: "cons", label: "Cons", placeholder: "What needs improvement?" },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</p>
                    {field === "body" ? (
                      <textarea value={(form as any)[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
                        style={{ width: "100%", height: "100px", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none", resize: "vertical" }} />
                    ) : (
                      <input value={(form as any)[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
                        style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-body)", fontSize: "14px", outline: "none" }} />
                    )}
                  </div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px" }}>Username (optional)</p>
                    <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Anonymous"
                      style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", outline: "none" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", marginBottom: "6px" }}>Monthly volume</p>
                    <select value={form.tradingVolume} onChange={(e) => setForm((f) => ({ ...f, tradingVolume: e.target.value }))}
                      style={{ width: "100%", background: "var(--ink-3)", border: "1px solid var(--wire)", borderRadius: "10px", padding: "10px 14px", color: "var(--paper)", fontFamily: "var(--font-mono)", fontSize: "12px", outline: "none" }}>
                      {["Under $100", "$100-500", "$500-1k", "$1k-5k", "$5k-10k", "$10k+"].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--chrome)", lineHeight: 1.5 }}>
                  Your review will be screened by AI for fake reviews and spam before publishing. This takes seconds.
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "12px", border: "1px solid var(--wire)", borderRadius: "10px", background: "transparent", color: "var(--chrome)", fontFamily: "var(--font-mono)", fontSize: "12px", cursor: "pointer" }}>Cancel</button>
                  <button onClick={submit} disabled={!form.exchangeId || !form.rating || !form.body || submitting}
                    style={{ flex: 2, padding: "12px", border: "none", borderRadius: "10px", background: form.exchangeId && form.rating && form.body ? "var(--gold)" : "var(--wire)", color: form.exchangeId && form.rating && form.body ? "var(--ink)" : "var(--chrome)", fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                    {submitting ? "Submitting…" : "Submit review"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
