/**
 * tax-software.ts
 *
 * Single source of truth for all crypto tax software data.
 * Commission data sourced from official program pages, June 2025.
 */

export interface TaxSoftware {
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

  // Pricing
  freeTier: boolean;
  pricingStart: number;      // cheapest paid plan USD/year
  pricingMax: number;        // most expensive plan USD/year
  plans: TaxPlan[];

  // Features
  transactionLimit: number;  // on starter plan
  exchanges: number;         // # of supported exchanges/wallets
  countries: number;         // # of supported countries
  defiSupport: boolean;
  nftSupport: boolean;
  stakingSupport: boolean;
  turbotaxIntegration: boolean;
  taxProfessionalHelp: boolean;
  forms: string[];           // IRS forms generated

  // Best for
  bestFor: string[];
  prosText: string[];
  consText: string[];
  verdict: string;

  // Affiliate
  affiliateUrl: string;
  commissionPct: number;     // first sale %
  recurringPct: number;      // recurring years %
  cookieDays: number | "lifetime";
  minPayout: number;
  payoutMethod: string;
  affiliateSignupUrl: string;

  lastUpdated: string;
}

export interface TaxPlan {
  name: string;
  price: number;             // USD/year
  transactions: number | "unlimited";
  highlight?: boolean;
}

export const TAX_SOFTWARE: TaxSoftware[] = [
  {
    id: "koinly",
    slug: "koinly",
    name: "Koinly",
    logo: "K",
    logoColor: "#4CAF50",
    tagline: "Best overall — 800+ integrations, 20+ countries",
    description:
      "Koinly is the most comprehensive crypto tax platform available, supporting 800+ exchanges, wallets, and blockchains across 20+ countries. It handles everything from simple trades to complex DeFi portfolios with automatic transaction importing and smart matching.",
    rating: 4.6,
    reviews: 11000,
    badge: "Best Overall",
    badgeColor: "#4CAF50",
    freeTier: true,
    pricingStart: 49,
    pricingMax: 279,
    plans: [
      { name: "Newbie",    price: 49,  transactions: 100 },
      { name: "Hodler",    price: 99,  transactions: 1000, highlight: true },
      { name: "Trader",    price: 179, transactions: 10000 },
      { name: "Pro",       price: 279, transactions: 100000 },
    ],
    transactionLimit: 100,
    exchanges: 800,
    countries: 20,
    defiSupport: true,
    nftSupport: true,
    stakingSupport: true,
    turbotaxIntegration: true,
    taxProfessionalHelp: false,
    forms: ["Form 8949", "Schedule D", "FBAR", "Country-specific reports"],
    bestFor: ["International users", "DeFi traders", "Multi-exchange portfolios"],
    prosText: [
      "800+ integrations — most of any platform",
      "Lifetime cookie on affiliate program",
      "Supports 20+ countries including UK, Australia, Canada",
      "Smart matching reduces manual reconciliation",
      "4.6/5 Trustpilot with 11,000+ reviews",
    ],
    consText: [
      "More manual cleanup required vs CoinLedger",
      "No access to tax professionals on standard plans",
      "Free tier doesn't include downloadable reports",
    ],
    verdict:
      "The best choice for international users and anyone with a complex multi-platform portfolio. Its sheer breadth of integrations — 800+ exchanges and wallets — means you'll almost never need to import manually.",
    affiliateUrl: "https://koinly.io/?via=CRYPTOFFILIATE",
    commissionPct: 20,
    recurringPct: 10,
    cookieDays: "lifetime",
    minPayout: 100,
    payoutMethod: "PayPal",
    affiliateSignupUrl: "https://koinly.io/affiliate/",
    lastUpdated: "2025-06-01",
  },
  {
    id: "coinledger",
    slug: "coinledger",
    name: "CoinLedger",
    logo: "CL",
    logoColor: "#2563EB",
    tagline: "Best for US traders — 25% recurring commission forever",
    description:
      "CoinLedger (formerly CryptoTrader.Tax) is the #1 rated platform for US crypto investors. It focuses on error reconciliation and ease of use, with direct integrations into TurboTax, H&R Block, and TaxAct. The affiliate program pays 25% recurring commission every year a customer files — one of the most generous recurring programs in crypto.",
    rating: 4.8,
    reviews: 7200,
    badge: "Best for US",
    badgeColor: "#2563EB",
    freeTier: true,
    pricingStart: 49,
    pricingMax: 199,
    plans: [
      { name: "Starter",    price: 49,  transactions: 100 },
      { name: "Plus",       price: 99,  transactions: 1000, highlight: true },
      { name: "Pro",        price: 199, transactions: 3000 },
      { name: "Unlimited",  price: 199, transactions: 999999 },
    ],
    transactionLimit: 100,
    exchanges: 400,
    countries: 6,
    defiSupport: true,
    nftSupport: true,
    stakingSupport: true,
    turbotaxIntegration: true,
    taxProfessionalHelp: true,
    forms: ["Form 8949", "Schedule D", "Form 1040", "TurboTax export"],
    bestFor: ["US investors", "TurboTax users", "DeFi & NFT traders"],
    prosText: [
      "25% recurring commission every year customer files",
      "Best error reconciliation — finds missing cost basis automatically",
      "Direct TurboTax, H&R Block, TaxAct integration",
      "Expert review service available for complex cases",
      "700,000+ users — strong social proof",
    ],
    consText: [
      "Primarily US-focused (limited international support)",
      "Fewer exchange integrations than Koinly (400 vs 800)",
      "Expert review add-on is expensive ($500+)",
    ],
    verdict:
      "The best choice for US investors, especially those who use TurboTax. The 25% recurring commission makes this the single best affiliate program in the crypto tax space — you earn every year a customer files.",
    affiliateUrl: "https://coinledger.io?via=cryptoffiliate",
    commissionPct: 25,
    recurringPct: 25,
    cookieDays: 30,
    minPayout: 50,
    payoutMethod: "PayPal / bank transfer",
    affiliateSignupUrl: "https://coinledger.io/affiliate-program",
    lastUpdated: "2025-06-01",
  },
  {
    id: "zenledger",
    slug: "zenledger",
    name: "ZenLedger",
    logo: "ZL",
    logoColor: "#7C3AED",
    tagline: "Best for tax professionals and DeFi power users",
    description:
      "ZenLedger is a powerful platform built for US crypto investors who need professional-grade tax reporting. It integrates directly with TurboTax and supports a wide range of DeFi protocols, NFTs, and staking. It also offers professional consultation services for investors with complex tax situations.",
    rating: 4.2,
    reviews: 3100,
    badge: null,
    badgeColor: null,
    freeTier: true,
    pricingStart: 49,
    pricingMax: 999,
    plans: [
      { name: "Starter",    price: 49,   transactions: 100 },
      { name: "Premium",    price: 149,  transactions: 5000, highlight: true },
      { name: "Executive",  price: 399,  transactions: 15000 },
      { name: "Platinum",   price: 999,  transactions: 999999 },
    ],
    transactionLimit: 100,
    exchanges: 400,
    countries: 1,
    defiSupport: true,
    nftSupport: true,
    stakingSupport: true,
    turbotaxIntegration: true,
    taxProfessionalHelp: true,
    forms: ["Form 8949", "Schedule D", "FBAR", "FATCA"],
    bestFor: ["High-volume US traders", "DeFi power users", "Tax professionals"],
    prosText: [
      "Strongest audit trail and compliance documentation",
      "Refer a CPA and earn 5% on all their referred clients",
      "Professional consultation available ($275/hr)",
      "Strong FBAR and FATCA support for high-net-worth users",
    ],
    consText: [
      "US-only tax reports",
      "More complex UI than competitors",
      "Live support requires expensive paid plan",
    ],
    verdict:
      "Best suited for high-volume US traders and tax professionals who need a complete audit trail. The CPA referral program (5% on all clients they bring) is unique in the space.",
    affiliateUrl: "https://zenledger.io?ref=cryptoffiliate",
    commissionPct: 20,
    recurringPct: 0,
    cookieDays: 30,
    minPayout: 100,
    payoutMethod: "PayPal",
    affiliateSignupUrl: "https://zenledger.io/affiliate/",
    lastUpdated: "2025-06-01",
  },
  {
    id: "cointracker",
    slug: "cointracker",
    name: "CoinTracker",
    logo: "CT",
    logoColor: "#0891B2",
    tagline: "Best portfolio tracker + tax tool in one",
    description:
      "CoinTracker combines real-time portfolio tracking with automated tax reporting. It's uniquely strong for DeFi users thanks to support for the latest IRS Rev. Proc. 2024-28 per-wallet cost basis tracking. Backed by Coinbase Ventures, it integrates with more exchanges than almost any competitor.",
    rating: 4.3,
    reviews: 5800,
    badge: "Best Portfolio Tracker",
    badgeColor: "#0891B2",
    freeTier: true,
    pricingStart: 59,
    pricingMax: 599,
    plans: [
      { name: "Base",     price: 59,  transactions: 100 },
      { name: "Standard", price: 199, transactions: 1000, highlight: true },
      { name: "Premium",  price: 599, transactions: 999999 },
    ],
    transactionLimit: 100,
    exchanges: 500,
    countries: 10,
    defiSupport: true,
    nftSupport: true,
    stakingSupport: true,
    turbotaxIntegration: true,
    taxProfessionalHelp: false,
    forms: ["Form 8949", "Schedule D", "Country-specific"],
    bestFor: ["Portfolio tracking", "DeFi users", "Long-term holders"],
    prosText: [
      "Best real-time portfolio tracking UI in the industry",
      "500+ exchange and wallet integrations",
      "IRS Rev. Proc. 2024-28 per-wallet cost basis compliant",
      "Backed by Coinbase Ventures — strong long-term support",
    ],
    consText: [
      "More expensive than competitors at higher tiers",
      "Some users report UI complexity",
      "No direct access to tax professionals",
    ],
    verdict:
      "The best choice for investors who want portfolio tracking and tax reporting in a single platform. Especially strong for DeFi users who need the latest IRS compliance.",
    affiliateUrl: "https://www.cointracker.io?ref=cryptoffiliate",
    commissionPct: 20,
    recurringPct: 10,
    cookieDays: 30,
    minPayout: 50,
    payoutMethod: "PayPal",
    affiliateSignupUrl: "https://www.cointracker.io/affiliates",
    lastUpdated: "2025-06-01",
  },
  {
    id: "taxbit",
    slug: "taxbit",
    name: "TaxBit",
    logo: "TB",
    logoColor: "#DC2626",
    tagline: "Best for institutional & enterprise compliance",
    description:
      "TaxBit is the enterprise-grade platform trusted by PayPal, Google, and the IRS itself. Built by CPAs and tax attorneys, it's the most compliance-focused option — generating Form 1099-DA (new for 2026), Form 8949, and full audit-ready documentation. Best suited for institutional investors and high-net-worth individuals.",
    rating: 4.1,
    reviews: 2400,
    badge: "Enterprise Grade",
    badgeColor: "#DC2626",
    freeTier: false,
    pricingStart: 50,
    pricingMax: 500,
    plans: [
      { name: "Individual", price: 50,  transactions: 250 },
      { name: "Plus",       price: 175, transactions: 2500, highlight: true },
      { name: "Pro",        price: 500, transactions: 999999 },
    ],
    transactionLimit: 250,
    exchanges: 500,
    countries: 2,
    defiSupport: true,
    nftSupport: true,
    stakingSupport: true,
    turbotaxIntegration: true,
    taxProfessionalHelp: true,
    forms: ["Form 8949", "Schedule D", "Form 1099-DA", "FBAR"],
    bestFor: ["Institutional investors", "High-net-worth individuals", "Compliance-first users"],
    prosText: [
      "Only platform generating Form 1099-DA (new IRS requirement 2026)",
      "Trusted by PayPal, Google, and the IRS itself",
      "Built by CPAs and tax attorneys — highest compliance accuracy",
      "Best audit trail documentation in the industry",
    ],
    consText: [
      "No free tier",
      "Limited individual investor focus — primarily enterprise",
      "Less intuitive UI for beginners",
    ],
    verdict:
      "The compliance gold standard for institutional investors and anyone who needs bulletproof IRS documentation. Not the best choice for casual retail investors — Koinly or CoinLedger will serve them better.",
    affiliateUrl: "https://taxbit.com?ref=cryptoffiliate",
    commissionPct: 15,
    recurringPct: 0,
    cookieDays: 30,
    minPayout: 100,
    payoutMethod: "Bank transfer",
    affiliateSignupUrl: "https://taxbit.com/affiliates",
    lastUpdated: "2025-06-01",
  },
];

export function getTaxSoftwareBySlug(slug: string): TaxSoftware | undefined {
  return TAX_SOFTWARE.find((t) => t.slug === slug);
}

// For the comparison table — returns platforms sorted by overall rating
export function getSortedByRating(): TaxSoftware[] {
  return [...TAX_SOFTWARE].sort((a, b) => b.rating - a.rating);
}
