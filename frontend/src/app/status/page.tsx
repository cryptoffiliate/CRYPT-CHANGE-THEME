import type { Metadata } from "next";
import { ExchangeStatusBoard } from "@/components/tools/ExchangeStatusBoard";

export const metadata: Metadata = {
  title: "Crypto Exchange Status — Live Uptime & Incident Tracker 2025",
  description:
    "Real-time status of Binance, Coinbase, Kraken, Bybit, and OKX. Live uptime monitoring, latency tracking, and incident reports. Is your exchange down right now?",
};

export default function StatusPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)" }}>
      <div style={{ borderBottom: "1px solid var(--wire)", padding: "48px 0 32px" }}>
        <div className="container">
          <div className="eyebrow">Checked every 5 minutes</div>
          <h1 className="heading-xl" style={{ marginBottom: "12px" }}>
            Exchange <span className="italic-serif">status</span>
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Real-time uptime monitoring for every major exchange. Bookmark this page — when things go wrong, check here first.
          </p>
        </div>
      </div>
      <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
        <ExchangeStatusBoard />
      </div>
    </div>
  );
}
