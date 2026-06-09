/**
 * quiz-engine.ts
 *
 * All quiz questions, scoring weights, and recommendation logic.
 * Completely decoupled from UI — testable in isolation.
 */

export interface QuizOption {
  id: string;
  label: string;
  icon: string;
  scores: Partial<Record<ExchangeId, number>>;
}

export interface QuizQuestion {
  id: string;
  step: number;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

export type ExchangeId = "binance" | "coinbase" | "kraken" | "bybit" | "okx";

export interface ExchangeResult {
  id: ExchangeId;
  name: string;
  tagline: string;
  logo: string;
  logoColor: string;
  score: number;
  matchPercent: number;
  reasons: string[];
  badge: string | null;
  affiliateUrl: string;
  bonus: string;
  makerFee: number;
  takerFee: number;
  coins: number;
  usBased: boolean;
}

// ─── Questions ────────────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "experience",
    step: 1,
    question: "How experienced are you with crypto?",
    subtitle: "This helps us match your comfort level",
    options: [
      {
        id: "beginner",
        label: "Total beginner",
        icon: "🌱",
        scores: { coinbase: 5, kraken: 2, binance: 0, bybit: 0, okx: 1 },
      },
      {
        id: "some",
        label: "Some experience",
        icon: "📈",
        scores: { coinbase: 3, kraken: 4, binance: 3, bybit: 2, okx: 3 },
      },
      {
        id: "experienced",
        label: "Regular trader",
        icon: "⚡",
        scores: { coinbase: 1, kraken: 3, binance: 5, bybit: 4, okx: 5 },
      },
      {
        id: "pro",
        label: "Pro / high-volume",
        icon: "🏆",
        scores: { coinbase: 0, kraken: 3, binance: 5, bybit: 5, okx: 5 },
      },
    ],
  },
  {
    id: "goal",
    step: 2,
    question: "What's your main goal?",
    subtitle: "Pick the one that fits best",
    options: [
      {
        id: "buy_hold",
        label: "Buy & hold Bitcoin / ETH",
        icon: "💎",
        scores: { coinbase: 5, kraken: 4, binance: 3, bybit: 1, okx: 2 },
      },
      {
        id: "altcoins",
        label: "Trade altcoins",
        icon: "🪙",
        scores: { coinbase: 1, kraken: 2, binance: 5, bybit: 3, okx: 5 },
      },
      {
        id: "futures",
        label: "Futures / leverage trading",
        icon: "🚀",
        scores: { coinbase: 0, kraken: 3, binance: 4, bybit: 5, okx: 5 },
      },
      {
        id: "passive",
        label: "Earn yield / staking",
        icon: "🌾",
        scores: { coinbase: 4, kraken: 4, binance: 4, bybit: 3, okx: 3 },
      },
    ],
  },
  {
    id: "fees",
    step: 3,
    question: "How much do fees matter to you?",
    subtitle: "Honestly — it varies a lot between exchanges",
    options: [
      {
        id: "fees_critical",
        label: "Critical — I trade often",
        icon: "🔬",
        scores: { coinbase: 0, kraken: 3, binance: 5, bybit: 4, okx: 5 },
      },
      {
        id: "fees_important",
        label: "Important but not #1",
        icon: "⚖️",
        scores: { coinbase: 2, kraken: 4, binance: 4, bybit: 4, okx: 4 },
      },
      {
        id: "fees_dontcare",
        label: "Not a priority for me",
        icon: "😌",
        scores: { coinbase: 5, kraken: 3, binance: 2, bybit: 2, okx: 2 },
      },
    ],
  },
  {
    id: "location",
    step: 4,
    question: "Where are you based?",
    subtitle: "Some exchanges have US restrictions",
    options: [
      {
        id: "us",
        label: "United States",
        icon: "🇺🇸",
        scores: { coinbase: 5, kraken: 4, binance: 0, bybit: 0, okx: 0 },
      },
      {
        id: "europe",
        label: "Europe",
        icon: "🇪🇺",
        scores: { coinbase: 3, kraken: 4, binance: 4, bybit: 4, okx: 4 },
      },
      {
        id: "asia",
        label: "Asia / Rest of world",
        icon: "🌏",
        scores: { coinbase: 2, kraken: 3, binance: 5, bybit: 5, okx: 5 },
      },
    ],
  },
  {
    id: "privacy",
    step: 5,
    question: "How do you feel about KYC verification?",
    subtitle: "Know Your Customer identity checks",
    options: [
      {
        id: "kyc_fine",
        label: "Fine with full KYC",
        icon: "🪪",
        scores: { coinbase: 5, kraken: 5, binance: 4, bybit: 3, okx: 3 },
      },
      {
        id: "kyc_prefer_minimal",
        label: "Prefer minimal KYC",
        icon: "🔒",
        scores: { coinbase: 1, kraken: 2, binance: 3, bybit: 5, okx: 4 },
      },
    ],
  },
];

// ─── Exchange profiles ─────────────────────────────────────────────────────────

const EXCHANGES: Record<ExchangeId, Omit<ExchangeResult, "score" | "matchPercent" | "reasons">> = {
  binance: {
    id: "binance",
    name: "Binance",
    tagline: "Largest exchange by volume — lowest fees, most coins",
    logo: "B",
    logoColor: "#F0B90B",
    badge: "Most Popular",
    affiliateUrl: "https://www.binance.com/en/register?ref=CRYPTOFFILIATE",
    bonus: "20% trading fee discount",
    makerFee: 0.1,
    takerFee: 0.1,
    coins: 350,
    usBased: false,
  },
  coinbase: {
    id: "coinbase",
    name: "Coinbase",
    tagline: "Easiest onboarding, US-regulated, FDIC-insured deposits",
    logo: "C",
    logoColor: "#0052FF",
    badge: "Best for Beginners",
    affiliateUrl: "https://coinbase.com/join/CRYPTOFFILIATE",
    bonus: "$10 in free Bitcoin",
    makerFee: 0.4,
    takerFee: 0.6,
    coins: 240,
    usBased: true,
  },
  kraken: {
    id: "kraken",
    name: "Kraken",
    tagline: "Security-first, US-available, strong track record since 2011",
    logo: "K",
    logoColor: "#5741D9",
    badge: null,
    affiliateUrl: "https://www.kraken.com/sign-up?ref=CRYPTOFFILIATE",
    bonus: "0% maker fee for 30 days",
    makerFee: 0.16,
    takerFee: 0.26,
    coins: 200,
    usBased: true,
  },
  bybit: {
    id: "bybit",
    name: "Bybit",
    tagline: "Best for derivatives — minimal KYC, high liquidity",
    logo: "BY",
    logoColor: "#F7A600",
    badge: "Best for Futures",
    affiliateUrl: "https://www.bybit.com/register?affiliate_id=CRYPTOFFILIATE",
    bonus: "Up to $30,000 welcome bonus",
    makerFee: 0.1,
    takerFee: 0.1,
    coins: 300,
    usBased: false,
  },
  okx: {
    id: "okx",
    name: "OKX",
    tagline: "Ultra-low fees, 340+ coins, built-in Web3 wallet",
    logo: "OKX",
    logoColor: "#00B578",
    badge: "Lowest Fees",
    affiliateUrl: "https://www.okx.com/join/CRYPTOFFILIATE",
    bonus: "Mystery box up to $10,000",
    makerFee: 0.08,
    takerFee: 0.1,
    coins: 340,
    usBased: false,
  },
};

// ─── Reason generators ────────────────────────────────────────────────────────

function buildReasons(
  exchangeId: ExchangeId,
  answers: Record<string, string>
): string[] {
  const reasons: string[] = [];
  const e = EXCHANGES[exchangeId];

  if (answers.experience === "beginner" && exchangeId === "coinbase")
    reasons.push("Simplest interface for first-time buyers");
  if (answers.experience === "pro" && (exchangeId === "binance" || exchangeId === "okx"))
    reasons.push("Institutional-grade tools and deep liquidity");

  if (answers.goal === "futures" && (exchangeId === "bybit" || exchangeId === "okx"))
    reasons.push("Industry-leading futures and derivatives platform");
  if (answers.goal === "altcoins" && exchangeId === "binance")
    reasons.push("Largest altcoin selection — 350+ trading pairs");
  if (answers.goal === "altcoins" && exchangeId === "okx")
    reasons.push("340+ coins including many hard-to-find altcoins");
  if (answers.goal === "buy_hold" && exchangeId === "coinbase")
    reasons.push("FDIC-insured USD balances, trusted by 100M+ users");
  if (answers.goal === "passive" && (exchangeId === "coinbase" || exchangeId === "kraken"))
    reasons.push("Best-in-class staking rewards with easy setup");

  if (answers.fees === "fees_critical" && (exchangeId === "okx" || exchangeId === "binance"))
    reasons.push(`${e.makerFee}% maker fee — among the lowest in the industry`);
  if (answers.fees === "fees_dontcare" && exchangeId === "coinbase")
    reasons.push("Simple flat fees are worth it for the ease of use");

  if (answers.location === "us" && e.usBased)
    reasons.push("Fully licensed and regulated in the United States");
  if (answers.location === "us" && !e.usBased)
    reasons.push("Note: limited or no US availability");

  if (answers.privacy === "kyc_prefer_minimal" && (exchangeId === "bybit" || exchangeId === "okx"))
    reasons.push("Trade without mandatory ID verification at lower tiers");
  if (answers.privacy === "kyc_fine" && exchangeId === "kraken")
    reasons.push("Rigorous KYC means one of the most secure exchanges available");

  // Always add the bonus as a reason
  reasons.push(`Exclusive offer: ${e.bonus}`);

  return reasons.slice(0, 4); // cap at 4 reasons
}

// ─── Scoring engine ───────────────────────────────────────────────────────────

export function scoreExchanges(
  answers: Record<string, string>
): ExchangeResult[] {
  const totals: Record<ExchangeId, number> = {
    binance: 0, coinbase: 0, kraken: 0, bybit: 0, okx: 0,
  };

  // Sum scores for each answer
  for (const question of QUIZ_QUESTIONS) {
    const answerId = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    if (!option) continue;
    for (const [exId, pts] of Object.entries(option.scores)) {
      totals[exId as ExchangeId] += pts ?? 0;
    }
  }

  const maxPossible = QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + Math.max(...q.options.map((o) => Math.max(...Object.values(o.scores))));
  }, 0);

  const results: ExchangeResult[] = (Object.keys(totals) as ExchangeId[]).map(
    (id) => ({
      ...EXCHANGES[id],
      score: totals[id],
      matchPercent: Math.round((totals[id] / maxPossible) * 100),
      reasons: buildReasons(id, answers),
    })
  );

  return results.sort((a, b) => b.score - a.score);
}
