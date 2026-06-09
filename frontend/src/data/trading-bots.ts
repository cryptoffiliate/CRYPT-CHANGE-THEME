/**
 * trading-bots.ts — Crypto trading bot platform data. June 2025.
 */

export interface BotPricingPlan {
  name: string;
  price: number;
  period: "month" | "year";
  bots: number | "unlimited";
  exchanges: number | "unlimited";
  highlight?: boolean;
}

export interface TradingBotPlatform {
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
  plans: BotPricingPlan[];
  priceFrom: number;

  // Features
  botTypes: string[];
  supportedExchanges: number;
  tradingViewIntegration: boolean;
  copyTrading: boolean;
  mobileApp: boolean;
  paperTrading: boolean;

  bestFor: string[];
  prosText: string[];
  consText: string[];
  verdict: string;

  // Affiliate
  affiliateUrl: string;
  affiliateSignupUrl: string;
  commissionFirst: string;
  commissionRecurring: string;
  cookieDays: number;
  minPayout: number;
  payoutMethod: string;
  lastUpdated: string;
}

export const TRADING_BOT_PLATFORMS: TradingBotPlatform[] = [
  {
    id: "wundertrading",
    slug: "wundertrading",
    name: "WunderTrading",
    logo: "WT",
    logoColor: "#7B5CF6",
    tagline: "50% lifetime recurring commission — 365-day cookie",
    description:
      "WunderTrading is the fastest-growing crypto automation platform built around TradingView integration. It lets traders convert any TradingView indicator or Pine Script into a live trading bot in minutes — no coding required. The affiliate program pays up to 50% lifetime recurring commission with a 365-day cookie — the most generous structure in the trading bot space.",
    rating: 4.6,
    reviews: 8400,
    badge: "Best Commission",
    badgeColor: "#7B5CF6",
    freeTier: true,
    plans: [
      { name: "Free",     price: 0,   period: "month", bots: 1,         exchanges: 1 },
      { name: "Basic",    price: 19,  period: "month", bots: 5,         exchanges: 3,  highlight: true },
      { name: "Advanced", price: 49,  period: "month", bots: 20,        exchanges: 10 },
      { name: "Pro",      price: 99,  period: "month", bots: "unlimited", exchanges: "unlimited" },
    ],
    priceFrom: 19,
    botTypes: ["DCA Bot", "Grid Bot", "Signal Bot", "TradingView Bot", "Copy Trading", "Arbitrage"],
    supportedExchanges: 12,
    tradingViewIntegration: true,
    copyTrading: true,
    mobileApp: true,
    paperTrading: true,
    bestFor: ["TradingView users", "Signal traders", "Copy trading followers", "Automation beginners"],
    prosText: [
      "Up to 50% lifetime recurring commission — best in the space",
      "365-day cookie — a full year to earn the conversion",
      "Tiered commissions grow as you refer more users (30%→50%)",
      "TradingView integration converts existing TV users instantly",
      "Free tier drives sign-ups — pays out on upgrades",
    ],
    consText: [
      "30-day cookie auto-refreshes but requires return visit",
      "Fewer exchange integrations than 3Commas (12 vs 23)",
      "Newer platform — less name recognition than 3Commas",
    ],
    verdict:
      "The best affiliate program in the trading bot category by a wide margin. Up to 50% lifetime recurring on a 365-day cookie is unprecedented in crypto automation. If you promote TradingView content, this is a must-have — every TV user is a warm lead.",
    affiliateUrl: "https://wundertrading.com/?ref=cryptoffiliate",
    affiliateSignupUrl: "https://wundertrading.com/affiliates",
    commissionFirst: "30% (grows to 50% at 150 active users)",
    commissionRecurring: "Up to 50% lifetime on all renewals",
    cookieDays: 365,
    minPayout: 30,
    payoutMethod: "USDT (TRC-20)",
    lastUpdated: "2025-06-01",
  },
  {
    id: "3commas",
    slug: "3commas",
    name: "3Commas",
    logo: "3C",
    logoColor: "#1DA462",
    tagline: "Most popular bot platform — 40% commission, 23 exchanges",
    description:
      "3Commas is the most widely used crypto trading bot platform with 1M+ users. It offers a comprehensive suite — DCA bots, Grid bots, Options bots, and a smart trading terminal — across 23 exchanges. The copy trading marketplace lets beginners mirror professional strategies. The affiliate program pays up to 40% commission.",
    rating: 4.4,
    reviews: 31000,
    badge: "Most Popular",
    badgeColor: "#1DA462",
    freeTier: true,
    plans: [
      { name: "Free",    price: 0,   period: "month", bots: 1,   exchanges: 1 },
      { name: "Starter", price: 29,  period: "month", bots: 5,   exchanges: 5,  highlight: true },
      { name: "Advanced",price: 49,  period: "month", bots: 25,  exchanges: 10 },
      { name: "Pro",     price: 99,  period: "month", bots: "unlimited", exchanges: "unlimited" },
    ],
    priceFrom: 29,
    botTypes: ["DCA Bot", "Grid Bot", "Options Bot", "Signal Bot", "SmartTrade Terminal"],
    supportedExchanges: 23,
    tradingViewIntegration: true,
    copyTrading: true,
    mobileApp: true,
    paperTrading: true,
    bestFor: ["Active traders", "Copy trading beginners", "Multi-exchange traders", "DCA strategy users"],
    prosText: [
      "Largest user base — 1M+ traders, strongest social proof",
      "23 exchange integrations — widest coverage",
      "Copy trading marketplace with transparent performance",
      "Up to 40% commission for affiliates",
      "Best-in-class DCA bot with multiple take-profit targets",
    ],
    consText: [
      "2021 API key leak incident — security improved since",
      "Can be complex for absolute beginners",
      "Lower commission ceiling than WunderTrading (40% vs 50%)",
    ],
    verdict:
      "Best for social proof and volume. The 1M+ user base means your audience has likely already heard of 3Commas — easier conversion. 40% commission with 23 exchange integrations makes it a strong complement to WunderTrading in your affiliate stack.",
    affiliateUrl: "https://3commas.io/?utm_source=cryptoffiliate",
    affiliateSignupUrl: "https://3commas.io/affiliate",
    commissionFirst: "Up to 40% on first sale",
    commissionRecurring: "Recurring on active subscriptions",
    cookieDays: 30,
    minPayout: 50,
    payoutMethod: "PayPal, BTC, USDT",
    lastUpdated: "2025-06-01",
  },
  {
    id: "tradingview",
    slug: "tradingview",
    name: "TradingView",
    logo: "TV",
    logoColor: "#2962FF",
    tagline: "30M+ traders · 30% lifetime recurring · 90-day cookie",
    description:
      "TradingView is the world's leading charting and trading platform with 30M+ active users. While not a bot platform itself, it integrates with every major bot (WunderTrading, 3Commas, Pionex) and is used by virtually every serious crypto trader for charting, alerts, and strategy development. The affiliate program pays 30% lifetime recurring with a 90-day cookie.",
    rating: 4.8,
    reviews: 180000,
    badge: "30M+ Users",
    badgeColor: "#2962FF",
    freeTier: true,
    plans: [
      { name: "Free",    price: 0,    period: "month", bots: 0,   exchanges: 0 },
      { name: "Essential",price: 14.95,period: "month", bots: 0,  exchanges: 0, highlight: true },
      { name: "Plus",    price: 29.95, period: "month", bots: 0,  exchanges: 0 },
      { name: "Premium", price: 59.95, period: "month", bots: 0,  exchanges: 0 },
    ],
    priceFrom: 14.95,
    botTypes: ["Charting & alerts (integrates with bots via webhooks)"],
    supportedExchanges: 100,
    tradingViewIntegration: true,
    copyTrading: false,
    mobileApp: true,
    paperTrading: true,
    bestFor: ["All traders", "Technical analysts", "Charting enthusiasts", "Pine Script developers"],
    prosText: [
      "30% lifetime recurring commission — $50+ per user per year",
      "90-day cookie — one of the longest in the category",
      "30M+ users — most recognized brand in trading",
      "Over $3M paid to affiliates historically",
      "Free tier drives massive organic sign-ups that convert to paid",
    ],
    consText: [
      "Not a bot platform — purely charting and alerts",
      "Free tier very generous — some users never upgrade",
      "Commission only on paid subscriptions, not free accounts",
    ],
    verdict:
      "The most reliable recurring income in the entire crypto affiliate space. Every trader uses TradingView. The 30% recurring commission on a 90-day cookie compounds beautifully — once referred, users stay subscribed for years. Stack this with WunderTrading for maximum recurring income.",
    affiliateUrl: "https://www.tradingview.com/?aff_id=cryptoffiliate",
    affiliateSignupUrl: "https://www.tradingview.com/gopro/",
    commissionFirst: "30% of first payment",
    commissionRecurring: "30% lifetime on all renewals",
    cookieDays: 90,
    minPayout: 10,
    payoutMethod: "PayPal (via TUNE Network)",
    lastUpdated: "2025-06-01",
  },
  {
    id: "pionex",
    slug: "pionex",
    name: "Pionex",
    logo: "PX",
    logoColor: "#F0A500",
    tagline: "Built-in bots, zero subscription fee — exchange + bot in one",
    description:
      "Pionex is unique: it's both a cryptocurrency exchange and a trading bot platform, with 16 built-in bots and zero monthly subscription fee. Users pay only exchange trading fees (0.05%) — one of the lowest in the industry. Perfect for beginners who want automated trading without paying for a separate subscription.",
    rating: 4.3,
    reviews: 14000,
    badge: "Zero Monthly Fee",
    badgeColor: "#F0A500",
    freeTier: true,
    plans: [
      { name: "Free (built-in)", price: 0, period: "month", bots: 16, exchanges: 1 },
    ],
    priceFrom: 0,
    botTypes: ["Grid Bot", "DCA Bot", "Spot-Futures Arbitrage", "Smart Trade", "Rebalancing Bot"],
    supportedExchanges: 1,
    tradingViewIntegration: false,
    copyTrading: true,
    mobileApp: true,
    paperTrading: false,
    bestFor: ["Complete beginners", "Fee-conscious traders", "Simple grid strategy users"],
    prosText: [
      "No monthly subscription — just 0.05% trading fee",
      "16 built-in bots — no setup required",
      "Perfect entry-level recommendation for beginner content",
      "Great for 'free crypto bot' keyword traffic",
    ],
    consText: [
      "Only works on Pionex exchange — no external exchange support",
      "No TradingView integration",
      "Lower commission ceiling than WunderTrading/3Commas",
    ],
    verdict:
      "Best for beginner-focused content and 'free trading bot' keyword traffic. The zero-subscription model removes the biggest objection to trying a bot. Use as an entry-level recommendation, then upsell WunderTrading or 3Commas for advanced users.",
    affiliateUrl: "https://www.pionex.com/en/sign/ref/cryptoffiliate",
    affiliateSignupUrl: "https://www.pionex.com/en/affiliates",
    commissionFirst: "~20% of trading fees from referred users",
    commissionRecurring: "Ongoing % of trading fees",
    cookieDays: 30,
    minPayout: 50,
    payoutMethod: "USDT",
    lastUpdated: "2025-06-01",
  },
];

export function getTradingBotBySlug(slug: string) {
  return TRADING_BOT_PLATFORMS.find((p) => p.slug === slug);
}
