import type { Metadata } from "next";
import Link from "next/link";
import { HARDWARE_WALLETS } from "@/data/hardware-wallets";

export const metadata: Metadata = {
  title: "Ledger vs Trezor 2025 — Which Hardware Wallet Should You Buy?",
  description:
    "Ledger vs Trezor: the definitive 2025 comparison. Security models, open source vs closed, all models and prices, and exactly who should buy which. Independent verdict.",
  openGraph: {
    title: "Ledger vs Trezor 2025 — Complete Head-to-Head",
    description: "Every spec, every model, every trade-off. We tell you exactly which one to buy.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Ledger vs Trezor 2025: Which Hardware Wallet Should You Buy?",
  datePublished: "2025-06-01",
  dateModified: "2025-06-01",
  author: { "@type": "Organization", name: "Cryptoffiliate" },
};

const ledger = HARDWARE_WALLETS.find((w) => w.id === "ledger")!;
const trezor = HARDWARE_WALLETS.find((w) => w.id === "trezor")!;

export default function LedgerVsTrezorPage() {
  const comparisons = [
    { category: "Entry price",        ledger: "$79 (Nano S Plus)",    trezor: "$59 (Model One)",     winner: "trezor",  note: "Trezor is $20 cheaper at entry level" },
    { category: "Open source",        ledger: "No — closed firmware", trezor: "Yes — GitHub verified", winner: "trezor",  note: "Trezor's code is publicly auditable" },
    { category: "Secure Element",     ledger: "Yes — all models",     trezor: "Safe 3+ only",        winner: "ledger",  note: "Ledger has SE on every device including $79 S Plus" },
    { category: "Bluetooth",          ledger: "From Nano X ($149)",   trezor: "Safe 7 only ($249)", winner: "ledger",  note: "Ledger offers Bluetooth at a much lower price" },
    { category: "Coins supported",    ledger: "15,000+",              trezor: "8,000+",              winner: "ledger",  note: "Ledger supports nearly twice as many assets" },
    { category: "Mobile app",         ledger: "Yes — Ledger Live",    trezor: "Yes — Trezor Suite",  winner: "tie",     note: "Both have solid mobile companion apps" },
    { category: "Seed backup",        ledger: "24-word standard",     trezor: "Shamir backup option",winner: "trezor",  note: "Trezor's Shamir splits seed into multiple shares" },
    { category: "Affiliate commission",ledger: "10%",                 trezor: "12–15%",             winner: "trezor",  note: "Trezor pays higher commissions" },
    { category: "Track record",       ledger: "0 wallet hacks",       trezor: "0 wallet hacks",     winner: "tie",     note: "Both have never been hacked at the wallet level" },
    { category: "2023 controversy",   ledger: "Ledger Recover feature",trezor: "None",              winner: "trezor",  note: "Ledger Recover was opt-in but caused community backlash" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/hardware-wallets" className="hover:text-slate-600">Hardware wallets</Link>
          <span>/</span>
          <span className="text-slate-600">Ledger vs Trezor</span>
        </nav>

        <p className="section-label mb-2">Updated June 2025 · Independent comparison</p>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Ledger vs Trezor 2025 — which should you buy?
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Both are the gold standard in hardware wallets with zero wallet-level hacks in their history.
          The choice comes down to one core trade-off: Ledger prioritizes convenience and coin coverage;
          Trezor prioritizes transparency and open-source verifiability. Here's exactly who should choose which.
        </p>

        {/* TL;DR verdict box */}
        <div className="card p-5 mb-8 border-brand-200 bg-brand-50/30">
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-3">TL;DR verdict</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-slate-900 mb-1">Buy Ledger if you:</p>
              <ul className="space-y-1">
                {["Want Bluetooth and mobile app", "Hold 100+ different coins/tokens", "Value the widest exchange integrations", "Want DeFi and NFT support"].map(i => (
                  <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                    <span className="text-black font-bold flex-shrink-0">L</span>{i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-1">Buy Trezor if you:</p>
              <ul className="space-y-1">
                {["Want open-source verifiable firmware", "Are a Bitcoin maximalist", "Want Shamir multi-share backup", "Value the lower entry price ($59)"].map(i => (
                  <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                    <span className="text-emerald-600 font-bold flex-shrink-0">T</span>{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Head-to-head comparison table */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Head-to-head comparison</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#000000" }}>Ledger</th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: "#1CB45A" }}>Trezor</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map(({ category, ledger: lv, trezor: tv, winner, note }) => (
                    <tr key={category} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">{category}</td>
                      <td className={`px-3 py-3 text-sm text-center ${winner === "ledger" ? "font-bold text-slate-900 bg-amber-50/40" : "text-slate-500"}`}>
                        {winner === "ledger" && <span className="mr-1">★</span>}{lv}
                      </td>
                      <td className={`px-3 py-3 text-sm text-center ${winner === "trezor" ? "font-bold text-slate-900 bg-emerald-50/40" : "text-slate-500"}`}>
                        {winner === "trezor" && <span className="mr-1">★</span>}{tv}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
              ★ = winner in that category · Tie = no meaningful difference
            </div>
          </div>
        </section>

        {/* Model-by-model matchups */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Model matchups by price</h2>
          <div className="space-y-3">
            {[
              { price: "$59–79",  l: "Nano S Plus ($79)",     t: "Model One ($59) / Safe 3 ($79)", verdict: "At $79, the Safe 3 wins — open source AND secure element. At $59, Model One is the only option." },
              { price: "$129–149",l: "Nano X ($149)",         t: "Model T ($129)",                  verdict: "Nano X wins if you want Bluetooth and mobile use. Model T wins if you want open-source + touchscreen." },
              { price: "$169–179",l: "Nano Gen5 ($179)",      t: "Safe 5 ($169)",                   verdict: "Safe 5 wins — open source, SE chip, haptic touchscreen, and $10 cheaper." },
              { price: "$249",    l: "Flex ($249)",            t: "Safe 7 ($249)",                   verdict: "Flex wins for non-privacy users (bigger screen, Bluetooth lower latency). Safe 7 wins for open-source priority." },
              { price: "$399",    l: "Stax ($399)",            t: "N/A",                             verdict: "Ledger Stax is in its own category — curved E-ink display, Qi charging, NFT cover art. No Trezor equivalent." },
            ].map(({ price, l, t, verdict }) => (
              <div key={price} className="card p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{price} price range</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-2 text-sm">
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <p className="text-xs text-slate-400 mb-0.5">Ledger</p>
                    <p className="font-semibold text-slate-900">{l}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2.5">
                    <p className="text-xs text-slate-400 mb-0.5">Trezor</p>
                    <p className="font-semibold text-slate-900">{t}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600">{verdict}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="card p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-black font-mono mx-auto mb-3">L</div>
            <p className="font-bold text-slate-900 mb-1">Shop Ledger</p>
            <p className="text-xs text-slate-400 mb-3">From $79 · Nano S Plus recommended</p>
            <a href={ledger.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="block w-full py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-700 transition-colors">
              Shop Ledger →
            </a>
            <p className="text-xs text-slate-400 mt-1.5">{ledger.commissionPct}% affiliate commission</p>
          </div>
          <div className="card p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-sm font-black font-mono mx-auto mb-3" style={{ color: "#1CB45A" }}>T</div>
            <p className="font-bold text-slate-900 mb-1">Shop Trezor</p>
            <p className="text-xs text-slate-400 mb-3">From $59 · Safe 3 recommended</p>
            <a href={trezor.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="block w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style={{ background: "#1CB45A" }}>
              Shop Trezor →
            </a>
            <p className="text-xs text-slate-400 mt-1.5">{trezor.commissionPct}% affiliate commission</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Affiliate disclosure: we earn 10–15% commission on hardware wallet purchases through our links, at no cost to you.
          Not financial advice — hardware wallet security ultimately depends on how you store your seed phrase.
        </p>
      </div>
    </>
  );
}
