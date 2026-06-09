import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HARDWARE_WALLETS, getWalletBySlug } from "@/data/hardware-wallets";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return HARDWARE_WALLETS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getWalletBySlug(params.slug);
  if (!w) return {};
  return {
    title: `${w.name} Review 2025 — All Models, Prices & Verdict`,
    description: `Complete ${w.name} hardware wallet review: every model from $${w.priceFrom}–$${w.priceTo}, security specs, ${w.coinsSupported.toLocaleString()}+ coins, and ${w.commissionPct}% affiliate commission.`,
  };
}

function Check({ val }: { val: boolean }) {
  return val
    ? <span className="text-emerald-500 font-bold">✓</span>
    : <span className="text-red-400">✗</span>;
}

export default function HardwareWalletReviewPage({ params }: Props) {
  const wallet = getWalletBySlug(params.slug);
  if (!wallet) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: wallet.name,
      brand: { "@type": "Brand", name: wallet.name },
      url: wallet.affiliateUrl,
    },
    reviewRating: { "@type": "Rating", ratingValue: wallet.rating, bestRating: 5 },
    author: { "@type": "Organization", name: "Cryptoffiliate" },
    datePublished: wallet.lastUpdated,
    dateModified: wallet.lastUpdated,
    reviewBody: wallet.verdict,
  };

  const highlightModel = wallet.models.find((m) => m.highlight) ?? wallet.models[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex gap-1.5 flex-wrap items-center">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/hardware-wallets" className="hover:text-slate-600">Hardware wallets</Link>
          <span>/</span>
          <span className="text-slate-600">{wallet.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-black font-mono flex-shrink-0"
            style={{
              background: wallet.logoColor === "#000000" ? "#f1f5f9" : wallet.logoColor + "18",
              border: `2px solid ${wallet.logoColor === "#000000" ? "#cbd5e1" : wallet.logoColor + "40"}`,
              color: wallet.logoColor === "#000000" ? "#0f172a" : wallet.logoColor
            }}>
            {wallet.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{wallet.name} review 2025</h1>
              {wallet.badge && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{
                    background: wallet.badgeColor === "#000000" ? "#f1f5f9" : wallet.badgeColor! + "18",
                    color: wallet.badgeColor === "#000000" ? "#0f172a" : wallet.badgeColor!
                  }}>
                  {wallet.badge}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{wallet.tagline}</p>
            <p className="text-xs text-slate-400 mt-1">
              Founded {wallet.founded} · {wallet.jurisdiction} · {wallet.coinsSupported.toLocaleString()}+ coins · Last updated {wallet.lastUpdated}
            </p>
          </div>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 mb-6">
          Affiliate disclosure: we earn {wallet.commissionPct}% commission on {wallet.name} sales through our links, at no cost to you.
        </p>

        {/* Top CTA — recommended model */}
        <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-semibold text-slate-900">
              Our pick: <span style={{ color: wallet.logoColor === "#000000" ? "#0f172a" : wallet.logoColor }}>
                {wallet.name} {highlightModel.name}
              </span> — ${highlightModel.price}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{highlightModel.bestFor}</p>
            <p className="text-xs text-slate-400 mt-1">
              {wallet.models.length} models · ${wallet.priceFrom}–${wallet.priceTo} · {wallet.commissionPct}% affiliate commission
            </p>
          </div>
          <a href={wallet.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: wallet.logoColor === "#000000" ? "#0f172a" : wallet.logoColor }}>
            Shop {wallet.name} →
          </a>
        </div>

        {/* Verdict */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Our verdict</h2>
          <div className="card p-5">
            <p className="text-sm text-slate-700 leading-relaxed">{wallet.verdict}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {wallet.bestFor.map((b) => (
                <span key={b} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: wallet.logoColor === "#000000" ? "#f1f5f9" : wallet.logoColor + "12",
                    color: wallet.logoColor === "#000000" ? "#0f172a" : wallet.logoColor
                  }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* All models */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">All models compared</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Model", "Price", "Best for", "BT", "Touch", "SE", "OS"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wallet.models.map((m) => (
                    <tr key={m.name} className={`border-b border-slate-100 last:border-0 ${m.highlight ? "bg-brand-50/40" : ""}`}>
                      <td className="px-3 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {m.name}
                        {m.highlight && <span className="ml-1 text-xs text-brand-500 font-semibold">Best pick</span>}
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-900">${m.price}</td>
                      <td className="px-3 py-3 text-slate-500 text-xs">{m.bestFor}</td>
                      <td className="px-3 py-3 text-center"><Check val={m.bluetooth} /></td>
                      <td className="px-3 py-3 text-center"><Check val={m.touchscreen} /></td>
                      <td className="px-3 py-3 text-center"><Check val={m.secureElement} /></td>
                      <td className="px-3 py-3 text-center"><Check val={m.openSource} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 bg-slate-50 text-xs text-slate-400 border-t border-slate-100">
              BT = Bluetooth · Touch = Touchscreen · SE = Secure Element · OS = Open Source firmware
            </div>
          </div>
        </section>

        {/* Key stats */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Key specs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Coins supported",  value: `${wallet.coinsSupported.toLocaleString()}+` },
              { label: "Blockchains",      value: `${wallet.chains}+` },
              { label: "Open source",      value: wallet.openSource ? "Yes ✓" : "No" },
              { label: "Secure Element",   value: wallet.secureElement ? "Yes ✓" : "Varies" },
              { label: "Mobile app",       value: wallet.mobileApp ? "Yes ✓" : "No" },
              { label: "Bluetooth",        value: wallet.bluetooth ? "Some models" : "Safe 7+" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <p className="text-base font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security approach */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Security approach</h2>
          <div className="card p-5">
            <p className="text-sm text-slate-700 leading-relaxed">{wallet.securityApproach}</p>
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Pros & cons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Pros</p>
              <ul className="space-y-2">
                {wallet.prosText.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">Cons</p>
              <ul className="space-y-2">
                {wallet.consText.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Affiliate program */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Affiliate program</h2>
          <div className="card p-5 grid sm:grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Commission</p>
              <p className="text-xl font-black text-emerald-600">{wallet.commissionPct}%</p>
              <p className="text-xs text-slate-400">on all sales</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Cookie</p>
              <p className="text-xl font-black text-slate-900">{wallet.cookieDays} days</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Payout</p>
              <p className="text-xl font-black text-slate-900">{wallet.payoutMethod}</p>
              <p className="text-xs text-slate-400">min ${wallet.minPayout}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 px-1 mb-2">{wallet.commissionNote}</p>
          <a href={wallet.affiliateSignupUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
            Join the {wallet.name} affiliate program →
          </a>
        </section>

        {/* Bottom CTA */}
        <div className="card p-6 text-center">
          <p className="font-semibold text-slate-900 mb-1">Ready to secure your crypto?</p>
          <p className="text-sm text-slate-400 mb-4">
            {wallet.name} ships worldwide. Models from ${wallet.priceFrom}.
          </p>
          <a href={wallet.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: wallet.logoColor === "#000000" ? "#0f172a" : wallet.logoColor }}>
            Shop {wallet.name} wallets →
          </a>
          <p className="text-xs text-slate-400 mt-2">Affiliate link · {wallet.commissionPct}% commission</p>
        </div>

        {/* Compare others */}
        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <p className="text-sm font-semibold text-slate-600">Compare:</p>
          {HARDWARE_WALLETS.filter((w) => w.id !== wallet.id).map((w) => (
            <Link key={w.id} href={`/hardware-wallets/${w.slug}`}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              {w.name} review →
            </Link>
          ))}
          <Link href="/hardware-wallets/ledger-vs-trezor"
            className="text-xs px-3 py-1.5 rounded-full border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
            Ledger vs Trezor →
          </Link>
        </div>
      </div>
    </>
  );
}
