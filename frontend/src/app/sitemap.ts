import { MetadataRoute } from "next";
import { EXCHANGES } from "@/data/exchanges";
import { TAX_SOFTWARE } from "@/data/tax-software";
import { SECURITY_TOOLS } from "@/data/security-tools";
import { HARDWARE_WALLETS } from "@/data/hardware-wallets";
import { CLOUD_MINING_PLATFORMS } from "@/data/cloud-mining";
import { TRADING_BOT_PLATFORMS } from "@/data/trading-bots";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cryptoffiliate.com";
  const now = new Date();
  const w = "weekly" as const;
  const d = "daily" as const;
  const m = "monthly" as const;

  const staticPages = [
    // Core
    { url: base,                                         changeFrequency: d, priority: 1.0 },
    { url: `${base}/compare`,                            changeFrequency: d, priority: 0.9 },
    { url: `${base}/reviews`,                            changeFrequency: w, priority: 0.8 },
    { url: `${base}/bonuses`,                            changeFrequency: d, priority: 0.9 },
    { url: `${base}/bonuses/bonus-tracker`,              changeFrequency: d, priority: 0.85 },
    { url: `${base}/quiz`,                               changeFrequency: m, priority: 0.8 },
    { url: `${base}/alerts`,                             changeFrequency: m, priority: 0.7 },
    // AI
    { url: `${base}/ai-advisor`,                         changeFrequency: m, priority: 0.9 },
    { url: `${base}/scam-detector`,                      changeFrequency: m, priority: 0.9 },
    // Tools
    { url: `${base}/tools/fee-calculator`,               changeFrequency: w, priority: 0.8 },
    { url: `${base}/tools/fee-breakdown`,                changeFrequency: w, priority: 0.9 },
    { url: `${base}/tools/fee-trends`,                   changeFrequency: d, priority: 0.8 },
    { url: `${base}/tools/profit-calculator`,            changeFrequency: m, priority: 0.8 },
    { url: `${base}/tools/migration-planner`,            changeFrequency: m, priority: 0.85 },
    { url: `${base}/tools/jurisdiction-checker`,         changeFrequency: m, priority: 0.8 },
    { url: `${base}/tools/fee-analyst`,                  changeFrequency: m, priority: 0.85 },
    { url: `${base}/tools/portfolio-health`,             changeFrequency: m, priority: 0.8 },
    // Tax
    { url: `${base}/tax-software`,                       changeFrequency: w, priority: 0.9 },
    { url: `${base}/tax-software/best-for-us-investors`, changeFrequency: w, priority: 0.8 },
    { url: `${base}/tax-harvesting`,                     changeFrequency: m, priority: 0.85 },
    // Security
    { url: `${base}/security`,                           changeFrequency: w, priority: 0.9 },
    { url: `${base}/security/vpn`,                       changeFrequency: w, priority: 0.8 },
    { url: `${base}/security/password-managers`,         changeFrequency: w, priority: 0.8 },
    { url: `${base}/security-audit`,                     changeFrequency: m, priority: 0.85 },
    // Wallets
    { url: `${base}/hardware-wallets`,                   changeFrequency: w, priority: 0.9 },
    { url: `${base}/hardware-wallets/ledger-vs-trezor`,  changeFrequency: w, priority: 0.95 },
    // Status
    { url: `${base}/status`,                             changeFrequency: "hourly" as const, priority: 0.9 },
    // Community
    { url: `${base}/community/fee-reports`,              changeFrequency: d, priority: 0.8 },
    // Mining & bots
    { url: `${base}/cloud-mining`,                       changeFrequency: w, priority: 0.8 },
    { url: `${base}/trading-bots`,                       changeFrequency: w, priority: 0.8 },
  ].map((p) => ({ ...p, lastModified: now }));

  const dynamicPages = [
    ...EXCHANGES.map(e       => ({ url: `${base}/reviews/${e.slug}`,          lastModified: new Date(e.lastUpdated), changeFrequency: w, priority: 0.8 })),
    ...TAX_SOFTWARE.map(t    => ({ url: `${base}/tax-software/${t.slug}`,     lastModified: new Date(t.lastUpdated), changeFrequency: w, priority: 0.8 })),
    ...SECURITY_TOOLS.map(t  => ({ url: `${base}/security/${t.slug}`,         lastModified: new Date(t.lastUpdated), changeFrequency: w, priority: 0.8 })),
    ...HARDWARE_WALLETS.map(h => ({ url: `${base}/hardware-wallets/${h.slug}`, lastModified: new Date(h.lastUpdated), changeFrequency: w, priority: 0.8 })),
    ...CLOUD_MINING_PLATFORMS.map(p => ({ url: `${base}/cloud-mining/${p.slug}`,   lastModified: new Date(p.lastUpdated), changeFrequency: w, priority: 0.8 })),
    ...TRADING_BOT_PLATFORMS.map(p  => ({ url: `${base}/trading-bots/${p.slug}`,   lastModified: new Date(p.lastUpdated), changeFrequency: w, priority: 0.8 })),
  ];

  return [...staticPages, ...dynamicPages];
}
