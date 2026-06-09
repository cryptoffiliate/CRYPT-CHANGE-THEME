// ─── Exchange types ─────────────────────────────────────────────────────────

export interface Exchange {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  tagline: string;
  rating: number;
  reviews: number;
  makerFee: number;
  takerFee: number;
  withdrawalFee: string;
  minDeposit: string;
  coins: number;
  kyc: "required" | "optional" | "none";
  fiatOnRamp: boolean;
  futures: boolean;
  staking: boolean;
  usBased: boolean;
  best: string[];
  affiliateUrl: string;
  bonus: string;
  commission: string;
  badge: string | null;
  badgeColor: string | null;
  slug: string;
  founded: number;
  headquarters: string;
  promoCode?: string;
  lastUpdated: string;
}

export interface ExchangeReview {
  id: string;
  exchangeId: string;
  slug: string;
  title: string;
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
  rating: number;
  feeRating: number;
  securityRating: number;
  uiRating: number;
  supportRating: number;
  publishedAt: string;
  updatedAt: string;
  author: string;
}

export interface PromoCode {
  id: string;
  exchangeId: string;
  code: string;
  description: string;
  bonus: string;
  expiresAt: string | null;
  affiliateUrl: string;
  verified: boolean;
  lastChecked: string;
}

// ─── Filter / sort types ─────────────────────────────────────────────────────

export type SortKey = "rating" | "makerFee" | "takerFee" | "coins";
export type SortDirection = "asc" | "desc";

export interface TableFilters {
  usBased?: boolean;
  fiatOnRamp?: boolean;
  futures?: boolean;
  staking?: boolean;
  kycOptional?: boolean;
}
