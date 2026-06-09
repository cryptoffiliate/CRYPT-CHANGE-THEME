/**
 * cloud-mining.ts — Cloud mining platform data. June 2025.
 */

export interface CloudMiningPlan {
  name: string;
  price: number;
  hashrate: string;
  duration: string;
  dailyReturn: string;
  coin: string;
  highlight?: boolean;
}

export interface CloudMiningPlatform {
  id: string;
  slug: string;
  name: string;
  logo: string;
  logoColor: string;
  tagline: string;
  description: string;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeColor: string | null;
  founded: number;
  jurisdiction: string;

  // Pricing
  minInvestment: number;
  maxInvestment: number;
  plans: CloudMiningPlan[];

  // Features
  coins: string[];
  payoutFrequency: string;
  contractTypes: string[];
  freeTrial: boolean;
  mobileApp: boolean;
  regulated: boolean;
  backedBy: string | null;

  // Risk disclosure
  riskLevel: "low" | "medium" | "high";
  riskNote: string;

  prosText: string[];
  consText: string[];
  verdict: string;
  bestFor: string[];

  // Affiliate
  affiliateUrl: string;
  affiliateSignupUrl: string;
  commissionPct: number;
  commissionNote: string;
  cookieDays: number;
  minPayout: number;
  payoutMethod: string;
  lastUpdated: string;
}

export const CLOUD_MINING_PLATFORMS: CloudMiningPlatform[] = [
  {
    id: "nicehash",
    slug: "nicehash",
    name: "NiceHash",
    logo: "NH",
    logoColor: "#F7A600",
    tagline: "World's largest hashrate marketplace — buy or sell mining power",
    description:
      "NiceHash is the world's largest peer-to-peer hashrate marketplace. Unlike traditional cloud mining, it lets users buy and sell computing power on a live order book — you're not locked into a contract, you buy hashrate on demand. Backed by strong EU compliance (Slovenia-based) and used by 5M+ miners.",
    rating: 4.5,
    reviews: 42000,
    badge: "Most Flexible",
    badgeColor: "#F7A600",
    founded: 2014,
    jurisdiction: "Slovenia (EU)",
    minInvestment: 50,
    maxInvestment: 999999,
    plans: [
      { name: "BTC Starter",    price: 50,   hashrate: "1 TH/s",   duration: "Daily",    dailyReturn: "~$0.05–0.10", coin: "BTC" },
      { name: "BTC Standard",   price: 500,  hashrate: "10 TH/s",  duration: "Daily",    dailyReturn: "~$0.50–1.00", coin: "BTC", highlight: true },
      { name: "BTC Advanced",   price: 5000, hashrate: "100 TH/s", duration: "Daily",    dailyReturn: "~$5–10",      coin: "BTC" },
    ],
    coins: ["BTC", "ETH", "LTC", "ZEC", "DASH"],
    payoutFrequency: "Daily",
    contractTypes: ["On-demand hashrate", "Fixed hashrate"],
    freeTrial: true,
    mobileApp: true,
    regulated: true,
    backedBy: null,
    riskLevel: "medium",
    riskNote: "Returns vary with Bitcoin price and mining difficulty. No guaranteed return. NiceHash is a marketplace — prices fluctuate daily.",
    prosText: [
      "No lock-in contracts — start and stop anytime",
      "Transparent live order book — see real market rates",
      "EU-regulated (Slovenia) — strong compliance",
      "5M+ users — largest hashrate marketplace in the world",
      "Free trial hashpower available for new users",
    ],
    consText: [
      "Returns fluctuate with Bitcoin price and difficulty",
      "More complex than traditional cloud mining for beginners",
      "2022 hack history — though security has been upgraded",
    ],
    verdict:
      "Best for experienced users who want flexibility and transparency. The live marketplace model means you're buying real hashrate at market prices — no inflated contract promises. Free trial makes it easy to refer beginners.",
    affiliateUrl: "https://www.nicehash.com/?refby=cryptoffiliate",
    affiliateSignupUrl: "https://www.nicehash.com/affiliates",
    commissionPct: 5,
    commissionNote: "5% of referred users' hashrate purchases. Daily payouts in BTC.",
    cookieDays: 30,
    minPayout: 0.001,
    payoutMethod: "Bitcoin",
    lastUpdated: "2025-06-01",
  },
  {
    id: "ecos",
    slug: "ecos",
    name: "ECOS",
    logo: "EC",
    logoColor: "#00C896",
    tagline: "Government-backed platform in Armenia's Free Economic Zone",
    description:
      "ECOS is a fully government-licensed cloud mining platform operating in Armenia's Free Economic Zone. It offers fixed-term Bitcoin mining contracts (1–60 months), a built-in crypto wallet and exchange, and a mobile app with a 4.4/5 rating. Its government backing and regulatory framework make it one of the most credible cloud mining options available.",
    rating: 4.3,
    reviews: 18000,
    badge: "Government Licensed",
    badgeColor: "#00C896",
    founded: 2017,
    jurisdiction: "Armenia (FEZ)",
    minInvestment: 75,
    maxInvestment: 50000,
    plans: [
      { name: "Starter",    price: 75,   hashrate: "2 TH/s",   duration: "12 months", dailyReturn: "~$0.04–0.08",  coin: "BTC" },
      { name: "Standard",   price: 500,  hashrate: "15 TH/s",  duration: "24 months", dailyReturn: "~$0.30–0.60",  coin: "BTC", highlight: true },
      { name: "Advanced",   price: 2000, hashrate: "65 TH/s",  duration: "36 months", dailyReturn: "~$1.20–2.50",  coin: "BTC" },
    ],
    coins: ["BTC", "ETH", "LTC", "XRP"],
    payoutFrequency: "Daily",
    contractTypes: ["Fixed-term contracts (1–60 months)"],
    freeTrial: true,
    mobileApp: true,
    regulated: true,
    backedBy: "Armenian government Free Economic Zone",
    riskLevel: "medium",
    riskNote: "Fixed contracts — you pay upfront. Returns depend on BTC price and mining difficulty. Government licensing doesn't guarantee returns.",
    prosText: [
      "Government-licensed in Armenia's Free Economic Zone",
      "Free trial contract available — easy affiliate entry point",
      "Built-in wallet, exchange, and investment features",
      "All-in-one platform reduces friction for new users",
      "4.4/5 mobile app rating",
    ],
    consText: [
      "Fixed contract terms — capital is committed upfront",
      "Returns are estimates, not guarantees",
      "Higher minimum than NiceHash ($75 vs $50)",
    ],
    verdict:
      "Best cloud mining platform for beginners thanks to government licensing and the all-in-one ecosystem. The free trial makes conversions easy. High-ticket contract commissions add up fast.",
    affiliateUrl: "https://ecos.am/en/?ref=cryptoffiliate",
    affiliateSignupUrl: "https://ecos.am/en/affiliate-program/",
    commissionPct: 10,
    commissionNote: "Up to 10% of referred contract purchases. Paid monthly.",
    cookieDays: 30,
    minPayout: 50,
    payoutMethod: "USDT, BTC",
    lastUpdated: "2025-06-01",
  },
  {
    id: "bitfufu",
    slug: "bitfufu",
    name: "BitFuFu",
    logo: "BFF",
    logoColor: "#FF6B35",
    tagline: "Backed by Bitmain — institutional-grade cloud mining",
    description:
      "BitFuFu is backed by Bitmain, the world's largest ASIC manufacturer — giving it a unique hardware advantage. It uses cutting-edge Antminer hardware in its own data centers, resulting in some of the highest efficiency rates in cloud mining. Institutional investors and high-net-worth miners choose BitFuFu for its transparent maintenance fees and real-time mining dashboards.",
    rating: 4.4,
    reviews: 9200,
    badge: "Bitmain Backed",
    badgeColor: "#FF6B35",
    founded: 2020,
    jurisdiction: "Singapore",
    minInvestment: 100,
    maxInvestment: 100000,
    plans: [
      { name: "Nano",     price: 100,  hashrate: "3 TH/s",   duration: "30 days",   dailyReturn: "~$0.05–0.12", coin: "BTC" },
      { name: "Standard", price: 1000, hashrate: "30 TH/s",  duration: "180 days",  dailyReturn: "~$0.50–1.20", coin: "BTC", highlight: true },
      { name: "Pro",      price: 5000, hashrate: "150 TH/s", duration: "365 days",  dailyReturn: "~$2.50–6.00", coin: "BTC" },
    ],
    coins: ["BTC", "ETH"],
    payoutFrequency: "Daily",
    contractTypes: ["Fixed-term contracts", "Flexible contracts"],
    freeTrial: false,
    mobileApp: true,
    regulated: true,
    backedBy: "Bitmain (world's largest ASIC manufacturer)",
    riskLevel: "medium",
    riskNote: "Returns depend on BTC price and network difficulty. Bitmain backing provides hardware reliability, not return guarantees.",
    prosText: [
      "Backed by Bitmain — best hardware efficiency in the industry",
      "Transparent maintenance fee structure — no hidden costs",
      "Real-time mining dashboard with live stats",
      "Singapore-based — strong regulatory environment",
      "Best for high-ticket institutional-angle content",
    ],
    consText: [
      "No free trial — requires upfront investment",
      "Fewer coins than competitors (BTC and ETH only)",
      "Higher minimum ($100) than NiceHash",
    ],
    verdict:
      "Best for high-ticket commissions. The Bitmain backing story resonates with serious crypto investors. Average contract size is larger than competitors, meaning higher absolute commissions per conversion.",
    affiliateUrl: "https://bitfufu.com/?ref=cryptoffiliate",
    affiliateSignupUrl: "https://bitfufu.com/affiliate",
    commissionPct: 3,
    commissionNote: "3% on referred contract purchases. High-ticket contracts mean $30–$150+ per conversion.",
    cookieDays: 30,
    minPayout: 50,
    payoutMethod: "USDT, BTC",
    lastUpdated: "2025-06-01",
  },
];

export function getCloudMiningBySlug(slug: string) {
  return CLOUD_MINING_PLATFORMS.find((p) => p.slug === slug);
}
