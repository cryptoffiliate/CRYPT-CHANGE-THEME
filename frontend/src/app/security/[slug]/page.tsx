import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SECURITY_TOOLS, getSecurityToolBySlug } from "@/data/security-tools";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return SECURITY_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getSecurityToolBySlug(params.slug);
  if (!t) return {};
  const category = t.category === "vpn" ? "VPN" : "password manager";
  return {
    title: `${t.name} Review 2025 — Best ${category} for Crypto?`,
    description: `Is ${t.name} worth it for crypto investors? Our review covers privacy credentials, crypto payment support, jurisdiction, and the affiliate program (${t.commissionFirst}).`,
  };
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0 gap-4">
      <span className="text-sm text-slate-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function SecurityToolReviewPage({ params }: Props) {
  const tool = getSecurityToolBySlug(params.slug);
  if (!tool) notFound();

  const categoryLabel = tool.category === "vpn" ? "VPN" : "Password manager";
  const categoryPath = tool.category === "vpn" ? "vpn" : "password-managers";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: tool.name,
      applicationCategory: tool.category === "vpn" ? "SecurityApplication" : "UtilitiesApplication",
      url: tool.affiliateUrl,
    },
    reviewRating: { "@type": "Rating", ratingValue: tool.rating, bestRating: 5 },
    author: { "@type": "Organization", name: "Cryptoffiliate" },
    datePublished: tool.lastUpdated,
    dateModified: tool.lastUpdated,
    reviewBody: tool.verdict,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/security" className="hover:text-slate-600">Security</Link>
          <span>/</span>
          <Link href={`/security/${categoryPath}`} className="hover:text-slate-600">{categoryLabel}s</Link>
          <span>/</span>
          <span className="text-slate-600">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-black font-mono flex-shrink-0"
            style={{ background: tool.logoColor + "18", border: `2px solid ${tool.logoColor}40`, color: tool.logoColor }}>
            {tool.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{tool.name} review</h1>
              {tool.badge && (
                <span className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ background: tool.badgeColor! + "18", color: tool.badgeColor! }}>
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{tool.tagline}</p>
            <p className="text-xs text-slate-400 mt-1">
              {categoryLabel} · Last updated: {tool.lastUpdated} · Rating: {tool.rating}/5
            </p>
          </div>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-xs text-brand-500 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2 mb-6">
          Affiliate disclosure: we earn {tool.commissionFirst} if you purchase via our link, at no cost to you.
        </p>

        {/* Top CTA */}
        <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-semibold text-slate-900">Our verdict: {tool.name} scores <span className="text-brand-500">{tool.rating}/5</span></p>
            <p className="text-sm text-slate-500 mt-0.5 leading-relaxed max-w-sm">{tool.verdict.slice(0, 100)}...</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {tool.freeTier ? "✓ Free tier available" : `From $${tool.pricingStart}/${tool.pricingPeriod}`}
            </p>
          </div>
          <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: tool.logoColor }}>
            {tool.freeTier ? `Try ${tool.name} free →` : `Get ${tool.name} →`}
          </a>
        </div>

        {/* Full verdict */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Our verdict</h2>
          <div className="card p-5">
            <p className="text-sm text-slate-700 leading-relaxed">{tool.verdict}</p>
          </div>
        </section>

        {/* Why crypto investors use it */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Why crypto investors use {tool.name}</h2>
          <div className="card p-4 space-y-2.5">
            {tool.cryptoRelevance.map((r) => (
              <div key={r} className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                <p className="text-sm text-slate-700">{r}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specs */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Key specs</h2>
          <div className="card px-5 py-2">
            {Object.entries(tool.specs).map(([k, v]) => (
              <SpecRow key={k} label={k} value={v} />
            ))}
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Pros & cons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Pros</p>
              <ul className="space-y-2">
                {tool.prosText.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">Cons</p>
              <ul className="space-y-2">
                {tool.consText.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Affiliate program box */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Affiliate program</h2>
          <div className="card p-5 grid sm:grid-cols-3 gap-4 mb-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">First sale</p>
              <p className="text-base font-black text-emerald-600">{tool.commissionFirst}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Recurring</p>
              <p className="text-base font-black text-slate-900">{tool.commissionRecurring}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Cookie</p>
              <p className="text-base font-black text-slate-900">{tool.cookieDays} days</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500 px-1">
            <span>Network: {tool.network}</span>
            <span>Min payout: ${tool.minPayout} via {tool.payoutMethod.split(",")[0]}</span>
          </div>
          <a href={tool.affiliateSignupUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
            Join the {tool.name} affiliate program →
          </a>
        </section>

        {/* Bottom CTA */}
        <div className="card p-6 text-center">
          <p className="font-semibold text-slate-900 mb-1">Ready to protect your crypto?</p>
          <p className="text-sm text-slate-400 mb-4">
            {tool.freeTier
              ? `${tool.name} has a free tier — no credit card required to start.`
              : `${tool.pricingNote}`}
          </p>
          <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: tool.logoColor }}>
            {tool.freeTier ? `Get ${tool.name} free →` : `Get ${tool.name} →`}
          </a>
          <p className="text-xs text-slate-400 mt-2">Affiliate link · {tool.commissionFirst}</p>
        </div>

        {/* Cross-links */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-600 mb-3">Compare other {categoryLabel.toLowerCase()}s</p>
          <div className="flex flex-wrap gap-2">
            {SECURITY_TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).map((t) => (
              <Link key={t.id} href={`/security/${t.slug}`}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                {t.name} review →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
