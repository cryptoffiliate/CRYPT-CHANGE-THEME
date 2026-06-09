/**
 * hardware-wallets.ts
 *
 * Complete hardware wallet data. Commission rates from official program pages,
 * product specs from manufacturer sites. June 2025.
 */

export interface WalletModel {
  name: string;
  price: number;           // USD
  bestFor: string;
  bluetooth: boolean;
  touchscreen: boolean;
  secureElement: boolean;
  openSource: boolean;
  highlight?: boolean;     // recommended model
}

export interface HardwareWallet {
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

  // Models
  models: WalletModel[];
  priceFrom: number;
  priceTo: number;

  // Key specs
  coinsSupported: number;
  chains: number;
  openSource: boolean;
  secureElement: boolean;
  mobileApp: boolean;
  bluetooth: boolean;
  jurisdiction: string;
  founded: number;

  // Security approach
  securityApproach: string;

  // Best for
  bestFor: string[];
  prosText: string[];
  consText: string[];
  verdict: string;

  // Affiliate program
  affiliateUrl: string;
  affiliateSignupUrl: string;
  commissionPct: number;   // %
  commissionNote: string;
  cookieDays: number;
  minPayout: number;
  payoutMethod: string;
  network: string;

  lastUpdated: string;
}

export const HARDWARE_WALLETS: HardwareWallet[] = [
  {
    id: "ledger",
    slug: "ledger",
    name: "Ledger",
    logo: "L",
    logoColor: "#000000",
    tagline: "World's most popular hardware wallet — 10% commission",
    description:
      "Ledger is the world's largest hardware wallet manufacturer with 6M+ devices sold. Its Secure Element chip (the same used in passports and credit cards) has never been hacked. The Nano X is the most popular everyday wallet; the Flex and Stax are premium touchscreen models for power users.",
    rating: 4.7,
    reviews: 95000,
    badge: "Best Seller",
    badgeColor: "#000000",
    models: [
      { name: "Nano S Plus",  price: 79,  bestFor: "Beginners",        bluetooth: false, touchscreen: false, secureElement: true,  openSource: false },
      { name: "Nano X",       price: 149, bestFor: "Mobile users",     bluetooth: true,  touchscreen: false, secureElement: true,  openSource: false, highlight: true },
      { name: "Nano Gen5",    price: 179, bestFor: "Next-gen Nano",    bluetooth: true,  touchscreen: true,  secureElement: true,  openSource: false },
      { name: "Flex",         price: 249, bestFor: "Power users",      bluetooth: true,  touchscreen: true,  secureElement: true,  openSource: false },
      { name: "Stax",         price: 399, bestFor: "Premium / NFTs",   bluetooth: true,  touchscreen: true,  secureElement: true,  openSource: false },
    ],
    priceFrom: 79,
    priceTo: 399,
    coinsSupported: 15000,
    chains: 50,
    openSource: false,
    secureElement: true,
    mobileApp: true,
    bluetooth: true,
    jurisdiction: "France",
    founded: 2014,
    securityApproach:
      "Closed-source firmware on a certified Secure Element chip (CC EAL5+). The chip is the same standard used in passports and payment cards. Firmware is proprietary, which Ledger argues protects against reverse engineering — but means users must trust Ledger's code.",
    bestFor: ["Mobile-first traders", "NFT holders", "Users wanting Bluetooth", "15,000+ coin support"],
    prosText: [
      "Secure Element chip (same as passports) — never been hacked",
      "Bluetooth on Nano X+ — manage crypto from your phone",
      "15,000+ coins and 50+ blockchains supported",
      "Ledger Live app for staking, swapping, and buying",
      "6M+ devices sold — strongest brand recognition",
    ],
    consText: [
      "Closed-source firmware — can't be independently audited",
      "2023 Ledger Recover controversy (optional seed backup service)",
      "Proprietary software — more limited third-party wallet support",
      "More expensive entry model than Trezor ($79 vs $59)",
    ],
    verdict:
      "The best choice for most users who want Bluetooth mobile connectivity, the widest coin support, and the highest-trust secure element chip. The Nano X at $149 is the sweet spot — it's the most popular model and the best seller for affiliates.",
    affiliateUrl: "https://shop.ledger.com/?r=CRYPTOFFILIATE",
    affiliateSignupUrl: "https://affiliate.ledger.com/",
    commissionPct: 10,
    commissionNote: "10% on all sales. Paid in Bitcoin. Min payout €50.",
    cookieDays: 30,
    minPayout: 50,
    payoutMethod: "Bitcoin",
    network: "Own platform",
    lastUpdated: "2025-06-01",
  },
  {
    id: "trezor",
    slug: "trezor",
    name: "Trezor",
    logo: "T",
    logoColor: "#1CB45A",
    tagline: "The original hardware wallet — 12–15% commission",
    description:
      "Trezor invented the hardware wallet category in 2013. Its flagship advantage is fully open-source firmware — every line of code is publicly auditable on GitHub. The Safe 3 and Safe 5 now include a Secure Element chip, giving Trezor the best of both worlds: open-source transparency plus hardware isolation.",
    rating: 4.6,
    reviews: 48000,
    badge: "Best for Privacy",
    badgeColor: "#1CB45A",
    models: [
      { name: "Model One",  price: 59,  bestFor: "Budget beginners",   bluetooth: false, touchscreen: false, secureElement: false, openSource: true },
      { name: "Safe 3",     price: 79,  bestFor: "Security-conscious", bluetooth: false, touchscreen: false, secureElement: true,  openSource: true, highlight: true },
      { name: "Model T",    price: 129, bestFor: "Touchscreen lovers", bluetooth: false, touchscreen: true,  secureElement: false, openSource: true },
      { name: "Safe 5",     price: 169, bestFor: "Premium + open src", bluetooth: false, touchscreen: true,  secureElement: true,  openSource: true },
      { name: "Safe 7",     price: 249, bestFor: "Wireless + open src",bluetooth: true,  touchscreen: true,  secureElement: true,  openSource: true },
    ],
    priceFrom: 59,
    priceTo: 249,
    coinsSupported: 8000,
    chains: 30,
    openSource: true,
    secureElement: true,
    mobileApp: true,
    bluetooth: false,
    jurisdiction: "Czech Republic",
    founded: 2013,
    securityApproach:
      "100% open-source firmware auditable by anyone on GitHub. Safe 3, Safe 5, and Safe 7 now include a Secure Element chip (EAL6+) in addition to open-source code. Shamir Backup (available on Safe 5/7) allows splitting your seed into multiple shares — a unique security feature Ledger doesn't offer.",
    bestFor: ["Privacy advocates", "Bitcoin maximalists", "Open-source believers", "Budget-conscious users ($59 entry)"],
    prosText: [
      "100% open-source firmware — independently audited",
      "Highest commission rate: 12–15% vs Ledger's 10%",
      "Shamir Backup on Safe 5/7 — unique multi-share seed splitting",
      "Most affordable entry point: Model One at $59",
      "Secure Element now on Safe 3+ — best of both worlds",
    ],
    consText: [
      "No Bluetooth (until Safe 7) — desktop-only use for most models",
      "Fewer coins than Ledger (8,000 vs 15,000)",
      "No Ledger Recover equivalent — manual seed backup only",
      "Trezor Suite less polished than Ledger Live",
    ],
    verdict:
      "The better choice for privacy advocates, Bitcoin maximalists, and anyone who wants verifiable security (open-source code). Pays better commissions than Ledger (12–15% vs 10%) and has a $59 entry model that converts beginners easily.",
    affiliateUrl: "https://trezor.io/affiliate?ref=CRYPTOFFILIATE",
    affiliateSignupUrl: "https://trezor.io/affiliate",
    commissionPct: 15,
    commissionNote: "12–15% on all models. Monthly payouts in Bitcoin or wire transfer.",
    cookieDays: 30,
    minPayout: 100,
    payoutMethod: "Bitcoin or wire transfer",
    network: "Own platform",
    lastUpdated: "2025-06-01",
  },
  {
    id: "coolwallet",
    slug: "coolwallet",
    name: "CoolWallet",
    logo: "CW",
    logoColor: "#2B7BE9",
    tagline: "Credit-card sized — 10%+ commission, $200 USDT payout",
    description:
      "CoolWallet is a credit card-sized hardware wallet that fits in your physical wallet. It pairs with your smartphone via Bluetooth and has a built-in E-ink display and battery. Unique form factor makes it the most portable cold storage option — and a strong gift purchase.",
    rating: 4.3,
    reviews: 8400,
    badge: "Most Portable",
    badgeColor: "#2B7BE9",
    models: [
      { name: "CoolWallet S",   price: 99,  bestFor: "Entry portability", bluetooth: true, touchscreen: false, secureElement: true, openSource: false },
      { name: "CoolWallet Pro", price: 149, bestFor: "DeFi + staking",    bluetooth: true, touchscreen: false, secureElement: true, openSource: false, highlight: true },
    ],
    priceFrom: 99,
    priceTo: 149,
    coinsSupported: 3000,
    chains: 20,
    openSource: false,
    secureElement: true,
    mobileApp: true,
    bluetooth: true,
    jurisdiction: "Taiwan",
    founded: 2014,
    securityApproach:
      "Certified Secure Element chip (CC EAL5+) in a credit-card form factor. All transaction signing happens on-device. The card has no ports — completely air-gapped except for Bluetooth to the companion app.",
    bestFor: ["On-the-go traders", "Gift purchases", "Mobile-first users", "Minimalists"],
    prosText: [
      "Credit-card size — fits in your physical wallet",
      "Bluetooth-only (no ports) — clean, portable design",
      "Strong gift purchase appeal — unique vs Ledger/Trezor",
      "DeFi, staking, and NFT support on Pro model",
    ],
    consText: [
      "Fewer supported coins than Ledger/Trezor",
      "Closed source firmware",
      "Less brand recognition — harder cold conversion",
      "$200 USDT minimum payout is higher than Ledger/Trezor",
    ],
    verdict:
      "Best promoted as a complement or gift purchase alongside a review of Ledger/Trezor. The unique form factor (credit card) gives you a distinctive hook in 'best hardware wallet' content that everyone else doesn't have.",
    affiliateUrl: "https://www.coolwallet.io/?ref=cryptoffiliate",
    affiliateSignupUrl: "https://www.coolwallet.io/affiliate-program/",
    commissionPct: 10,
    commissionNote: "10%+ on all sales. Paid in USDT (TRC20). Min payout $200.",
    cookieDays: 30,
    minPayout: 200,
    payoutMethod: "USDT (TRC20)",
    network: "Own platform",
    lastUpdated: "2025-06-01",
  },
];

// ─── Comparison helpers ───────────────────────────────────────────────────────

export function getWalletBySlug(slug: string): HardwareWallet | undefined {
  return HARDWARE_WALLETS.find((w) => w.slug === slug);
}

/** Per-category buying recommendations */
export const WALLET_RECOMMENDATIONS = [
  { label: "Best for beginners",          winner: "ledger",      model: "Nano S Plus ($79)",   reason: "Widest coin support, beginner-friendly Ledger Live app" },
  { label: "Best for mobile",             winner: "ledger",      model: "Nano X ($149)",       reason: "Bluetooth to phone, full Ledger Live mobile app" },
  { label: "Best for privacy / Bitcoin",  winner: "trezor",      model: "Safe 3 ($79)",        reason: "Open-source, Secure Element, lowest price with SE chip" },
  { label: "Best budget option",          winner: "trezor",      model: "Model One ($59)",     reason: "Cheapest hardware wallet with proven security record" },
  { label: "Best premium wallet",         winner: "ledger",      model: "Flex ($249)",         reason: "Touchscreen, Bluetooth, largest screen on a Ledger device" },
  { label: "Best for portability",        winner: "coolwallet",  model: "Pro ($149)",          reason: "Credit-card size — fits in your physical wallet" },
  { label: "Best open-source premium",    winner: "trezor",      model: "Safe 5 ($169)",       reason: "Open-source + Secure Element + haptic touchscreen" },
];
