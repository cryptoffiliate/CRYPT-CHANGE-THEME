import type { Metadata } from "next";
import Link from "next/link";
import { VPN_TOOLS, PASSWORD_TOOLS } from "@/data/security-tools";

export const metadata: Metadata = {
  title: "Best Crypto Security Tools 2025 — VPNs & Password Managers",
  description:
    "Every serious crypto investor needs a VPN and a password manager. We compared the best options for privacy, security, and affiliate commissions. NordVPN, Proton VPN, Bitwarden, 1Password, and more.",
  openGraph: {
    title: "Best Crypto Security Tools 2025",
    description: "The essential privacy stack for crypto investors — VPNs, password managers, and why they matter.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Crypto Security Tools 2025",
  numberOfItems: VPN_TOOLS.length + PASSWORD_TOOLS.length,
  itemListElement: [...VPN_TOOLS, ...PASSWORD_TOOLS].map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    url: `https://cryptoffiliate.com/security/${t.slug}`,
  })),
};

export default function SecurityHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="brutalist-page min-h-screen bg-slate-50">
        {/* Hero */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <p className="section-label mb-2">Updated June 2025 · Essential for crypto investors</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Crypto security toolkit
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mb-8">
              Every crypto investor has two exposure points most people ignore: their internet connection
              and their passwords. A VPN hides your activity from exchanges, ISPs, and analytics firms.
              A password manager ensures no two accounts share credentials. Both take 10 minutes to set up.
            </p>

            {/* Why it matters — crypto-specific */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: "🔍",
                  title: "Blockchain analytics firms",
                  desc: "Companies like Chainalysis link your IP address to on-chain transactions. A VPN breaks that link.",
                },
                {
                  icon: "📶",
                  title: "Public WiFi attacks",
                  desc: "Airport and café networks are prime targets for session hijacking. A VPN encrypts everything.",
                },
                {
                  icon: "🔑",
                  title: "Exchange account breaches",
                  desc: "If one password leaks, all accounts with the same password are compromised. A password manager makes every one unique.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card p-4">
                  <p className="text-2xl mb-2">{icon}</p>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/security/vpn" className="btn-primary text-sm">Compare VPNs →</Link>
              <Link href="/security/password-managers" className="btn-outline text-sm">Compare password managers →</Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

          {/* VPN section */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="section-label">VPNs</p>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Best VPNs for crypto investors</h2>
              </div>
              <Link href="/security/vpn" className="btn-outline text-sm">See full comparison →</Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {VPN_TOOLS.map((tool) => (
                <div key={tool.id} className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                      style={{ background: tool.logoColor + "18", border: `1.5px solid ${tool.logoColor}40`, color: tool.logoColor }}>
                      {tool.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-900 text-sm">{tool.name}</p>
                        {tool.badge && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: tool.badgeColor! + "18", color: tool.badgeColor! }}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{tool.tagline}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">${tool.pricingStart}<span className="text-xs text-slate-400">/{tool.pricingPeriod}</span></p>
                      {!tool.freeTier && <p className="text-xs text-slate-400">No free tier</p>}
                      {tool.freeTier && <p className="text-xs text-emerald-600">Free tier ✓</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {tool.cryptoRelevance.slice(0, 2).map((r) => (
                      <p key={r} className="text-xs text-slate-600 flex items-start gap-1">
                        <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>{r}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-400">Commission:</span>
                    <span className="font-semibold text-emerald-600">{tool.commissionFirst}</span>
                  </div>

                  <div className="flex gap-2">
                    <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white text-center hover:opacity-90 transition-opacity"
                      style={{ background: tool.logoColor }}>
                      Get {tool.name} →
                    </a>
                    <Link href={`/security/${tool.slug}`}
                      className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Password manager section */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="section-label">Password managers</p>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Best password managers for crypto</h2>
              </div>
              <Link href="/security/password-managers" className="btn-outline text-sm">See full comparison →</Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {PASSWORD_TOOLS.map((tool) => (
                <div key={tool.id} className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                      style={{ background: tool.logoColor + "18", border: `1.5px solid ${tool.logoColor}40`, color: tool.logoColor }}>
                      {tool.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-900 text-sm">{tool.name}</p>
                        {tool.badge && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: tool.badgeColor! + "18", color: tool.badgeColor! }}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{tool.tagline}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">${tool.pricingStart}<span className="text-xs text-slate-400">/{tool.pricingPeriod}</span></p>
                      {tool.freeTier && <p className="text-xs text-emerald-600">Free tier ✓</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-400">Commission:</span>
                    <span className="font-semibold text-emerald-600">{tool.commissionFirst}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-400">Recurring:</span>
                    <span className="font-medium text-slate-700">{tool.commissionRecurring}</span>
                  </div>

                  <div className="flex gap-2">
                    <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white text-center hover:opacity-90 transition-opacity"
                      style={{ background: tool.logoColor }}>
                      Get {tool.name} →
                    </a>
                    <Link href={`/security/${tool.slug}`}
                      className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The essential stack CTA */}
          <section className="card p-6 text-center bg-white">
            <p className="text-lg font-bold text-slate-900 mb-2">The essential crypto security stack</p>
            <p className="text-sm text-slate-500 mb-5 max-w-lg mx-auto">
              Our recommended combination: NordVPN for everyday privacy + Bitwarden to secure every exchange account.
              Total cost: under $5/month. Total setup time: under 20 minutes.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={VPN_TOOLS[0].affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="btn-primary text-sm">
                Get NordVPN →
              </a>
              <a href={PASSWORD_TOOLS[0].affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                className="btn-outline text-sm">
                Get Bitwarden free →
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-3">Affiliate disclosure: we earn commissions through these links at no cost to you.</p>
          </section>

        </div>
      </div>
    </>
  );
}
