/**
 * security-tools.ts
 *
 * VPN and password manager data for the security section.
 * Commission rates sourced from official program pages, June 2025.
 */

export type SecurityCategory = "vpn" | "password-manager";

export interface SecurityTool {
  id: string;
  slug: string;
  category: SecurityCategory;
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
  pricingStart: number;      // cheapest paid plan USD/mo (or /yr noted)
  pricingPeriod: "month" | "year";
  pricingNote: string;

  // Key specs
  specs: Record<string, string>;

  // Why crypto users care
  cryptoRelevance: string[];
  prosText: string[];
  consText: string[];
  verdict: string;
  bestFor: string[];

  // Affiliate
  affiliateUrl: string;
  affiliateSignupUrl: string;
  commissionFirst: string;   // e.g. "100% of first month" or "40%"
  commissionRecurring: string; // e.g. "30% on all renewals" or "none"
  cookieDays: number;
  minPayout: number;
  payoutMethod: string;
  network: string;           // CJ, Impact, own platform, Refersion, etc.

  lastUpdated: string;
}

export const SECURITY_TOOLS: SecurityTool[] = [
  // ─── VPNs ─────────────────────────────────────────────────────────────────
  {
    id: "nordvpn",
    slug: "nordvpn",
    category: "vpn",
    name: "NordVPN",
    logo: "N",
    logoColor: "#4687FF",
    tagline: "Most popular VPN — 100% first month + 30% recurring",
    description:
      "NordVPN is the world's most widely used VPN with 14M+ subscribers across 60+ countries. For crypto users, it's essential protection when trading on public WiFi, accessing geo-restricted exchanges, and preventing IP-based tracking across transactions.",
    rating: 4.7,
    reviews: 190000,
    badge: "Most Popular",
    badgeColor: "#4687FF",
    freeTier: false,
    pricingStart: 3.39,
    pricingPeriod: "month",
    pricingNote: "on 2-year plan. Monthly plan $12.99/mo",
    specs: {
      "Servers":         "6,400+ in 111 countries",
      "Simultaneous":    "10 devices",
      "Protocol":        "NordLynx (WireGuard)",
      "No-logs audit":   "Yes — PwC audited",
      "Kill switch":     "Yes",
      "Crypto payment":  "Yes (Bitcoin, Monero)",
      "Jurisdiction":    "Panama",
    },
    cryptoRelevance: [
      "Hides IP from exchanges and blockchain analytics firms",
      "Protects trades on public WiFi (airports, cafés)",
      "Access geo-restricted exchanges (Binance, Bybit from US IPs)",
      "Panama jurisdiction — no data retention laws",
      "Accepts Bitcoin & Monero for fully anonymous signup",
    ],
    prosText: [
      "100% commission on 1-month plans — highest first-sale payout",
      "30% recurring on all renewals — compounding passive income",
      "14M+ users — highest brand recognition, best conversion rate",
      "10% average conversion rate on relevant crypto traffic",
      "Accepts Bitcoin and Monero for maximum anonymity",
    ],
    consText: [
      "Owned by Nord Security, which also owns Surfshark — some privacy purists prefer unaffiliated providers",
      "30-day cookie is shorter than some competitors (PureVPN: 90 days)",
      "No free tier — some users won't convert without trial",
    ],
    verdict:
      "The highest-earning VPN affiliate program for most creators. The 100% first month CPA plus 30% recurring on renewals is the best combination of upfront payout and long-term passive income in the VPN space. 10% conversion rate on crypto-focused traffic.",
    affiliateUrl: "https://nordvpn.com/?aff=cryptoffiliate",
    affiliateSignupUrl: "https://affiliate.nordvpn.com/",
    commissionFirst: "100% of 1-mo plan / 40% on longer plans",
    commissionRecurring: "30% on all renewals",
    cookieDays: 30,
    minPayout: 10,
    payoutMethod: "PayPal, Wire, Bitcoin, ACH",
    network: "Own platform (also CJ Affiliate / Impact)",
    lastUpdated: "2025-06-01",
  },
  {
    id: "expressvpn",
    slug: "expressvpn",
    category: "vpn",
    name: "ExpressVPN",
    logo: "E",
    logoColor: "#DA3940",
    tagline: "Premium security — flat $13–$36 CPA, fast approval",
    description:
      "ExpressVPN is the go-to premium VPN for security-conscious users. It pioneered the Lightway protocol, uses RAM-only servers (no logs can survive a reboot), and has an outstanding track record of audits. Preferred by journalists, activists, and privacy professionals.",
    rating: 4.5,
    reviews: 62000,
    badge: "Best for Security",
    badgeColor: "#DA3940",
    freeTier: false,
    pricingStart: 6.67,
    pricingPeriod: "month",
    pricingNote: "on 12-month plan. Monthly plan $12.95/mo",
    specs: {
      "Servers":         "3,000+ in 105 countries",
      "Simultaneous":    "8 devices",
      "Protocol":        "Lightway (proprietary)",
      "No-logs audit":   "Yes — KPMG & Cure53 audited",
      "Kill switch":     "Yes",
      "Crypto payment":  "Yes (Bitcoin)",
      "Jurisdiction":    "British Virgin Islands",
    },
    cryptoRelevance: [
      "RAM-only servers — physically impossible to extract logs",
      "Lightway protocol resists deep-packet inspection",
      "BVI jurisdiction — outside 5/9/14 Eyes surveillance",
      "Split tunneling — route only your exchange traffic through VPN",
      "Trusted by 4M+ security-conscious users",
    ],
    prosText: [
      "Flat $13–$36 CPA per sale — predictable and reliable",
      "Highest brand trust score in security/privacy audience",
      "RAM-only server infrastructure — strongest privacy story",
      "KPMG and Cure53 audited — verifiable no-logs claim",
      "Strong conversion on 'most secure VPN' content",
    ],
    consText: [
      "No recurring commissions — one-time CPA only",
      "More expensive than NordVPN — slightly lower conversion",
      "Acquired by Kape Technologies in 2021 — raises questions for some",
    ],
    verdict:
      "Best for security-focused content where users are willing to pay a premium. The flat CPA is lower than NordVPN's recurring model long-term, but reliable and immediate. Strong converter on 'best VPN for crypto' and 'most anonymous VPN' searches.",
    affiliateUrl: "https://www.expressvpn.com/refer-a-friend/cryptoffiliate",
    affiliateSignupUrl: "https://www.expressvpn.com/affiliates",
    commissionFirst: "$13 (1-mo) / $22 (6-mo) / $36 (1-yr)",
    commissionRecurring: "None — one-time CPA",
    cookieDays: 30,
    minPayout: 100,
    payoutMethod: "Wire transfer, PayPal",
    network: "Impact (formerly)",
    lastUpdated: "2025-06-01",
  },
  {
    id: "protonvpn",
    slug: "protonvpn",
    category: "vpn",
    name: "Proton VPN",
    logo: "P",
    logoColor: "#6D4AFF",
    tagline: "Best privacy credentials — Swiss jurisdiction, open source",
    description:
      "Proton VPN is built by the CERN scientists who created ProtonMail. It's the most privacy-credible VPN on the market: Swiss jurisdiction, 100% open-source code, independently audited, and a genuinely free tier. Uniquely trusted in the crypto community for its uncompromising approach to privacy.",
    rating: 4.6,
    reviews: 28000,
    badge: "Best Privacy",
    badgeColor: "#6D4AFF",
    freeTier: true,
    pricingStart: 4.99,
    pricingPeriod: "month",
    pricingNote: "on 24-month plan. Monthly plan $9.99/mo",
    specs: {
      "Servers":         "9,900+ in 112 countries",
      "Simultaneous":    "10 devices",
      "Protocol":        "WireGuard + OpenVPN",
      "No-logs audit":   "Yes — open source + SEC Consult",
      "Kill switch":     "Yes",
      "Crypto payment":  "Yes (Bitcoin)",
      "Jurisdiction":    "Switzerland",
    },
    cryptoRelevance: [
      "Switzerland — outside EU and US jurisdiction, no data retention law",
      "100% open-source — community can audit every line of code",
      "Built by ProtonMail team — proven commitment to privacy",
      "Tor over VPN for maximum transaction anonymity",
      "Free tier lets crypto beginners test before paying",
    ],
    prosText: [
      "Highest trust score in the privacy community — best for crypto audience",
      "Free tier converts hesitant users who later upgrade",
      "Swiss jurisdiction resonates with crypto investors",
      "Open source + independently audited — credible privacy claims",
      "ProtonMail bundle increases average order value",
    ],
    consText: [
      "Commission rates not publicly disclosed — negotiate directly",
      "Lower brand awareness than NordVPN outside privacy circles",
      "Free tier can cannibalize paid conversions",
    ],
    verdict:
      "The most credible VPN recommendation for a crypto audience. Privacy-conscious traders trust Proton over all competitors because the privacy claims are verifiable. Commission details require direct signup — typically 20–30% per sale.",
    affiliateUrl: "https://protonvpn.com/?ref=cryptoffiliate",
    affiliateSignupUrl: "https://proton.me/business/partners",
    commissionFirst: "~20–30% (negotiate directly)",
    commissionRecurring: "~20% on renewals",
    cookieDays: 30,
    minPayout: 100,
    payoutMethod: "PayPal, Wire",
    network: "Own platform",
    lastUpdated: "2025-06-01",
  },
  {
    id: "surfshark",
    slug: "surfshark",
    category: "vpn",
    name: "Surfshark",
    logo: "SS",
    logoColor: "#1DB0BE",
    tagline: "Best value — unlimited devices, 40%+ commission",
    description:
      "Surfshark offers one of the best value propositions in VPNs: unlimited simultaneous device connections, 100+ country coverage, and advanced features like MultiHop (route through two VPN servers) and Camouflage Mode. Ideal for households with multiple devices.",
    rating: 4.4,
    reviews: 45000,
    badge: "Best Value",
    badgeColor: "#1DB0BE",
    freeTier: false,
    pricingStart: 1.99,
    pricingPeriod: "month",
    pricingNote: "on 24-month plan. Monthly plan $15.45/mo",
    specs: {
      "Servers":         "3,200+ in 100 countries",
      "Simultaneous":    "Unlimited devices",
      "Protocol":        "WireGuard + OpenVPN + IKEv2",
      "No-logs audit":   "Yes — Deloitte audited",
      "Kill switch":     "Yes",
      "Crypto payment":  "Yes (Bitcoin, Ethereum, Ripple)",
      "Jurisdiction":    "Netherlands",
    },
    cryptoRelevance: [
      "MultiHop routes traffic through 2 VPN servers — harder to trace",
      "Unlimited devices — protect your trading rig, phone, and laptop",
      "Accepts ETH and XRP in addition to Bitcoin",
      "Camouflage Mode disguises VPN traffic as regular HTTPS",
      "Nexus technology routes traffic through 3,200+ server network",
    ],
    prosText: [
      "40%+ commission on all plans",
      "Unlimited device connections — strong selling point",
      "Lowest price per month of any premium VPN",
      "Accepts Ethereum and Ripple — unique crypto payment option",
      "Merged with NordVPN parent company — strong long-term",
    ],
    consText: [
      "Netherlands HQ — EU data retention rules apply",
      "Unlimited devices feature less relevant for single users",
      "Less name recognition than NordVPN for first-time VPN buyers",
    ],
    verdict:
      "Excellent for crypto audiences who run multiple devices or want to pitch the value angle. The 40%+ commission and lowest-price-in-class story converts well on budget-conscious exchanges comparison pages.",
    affiliateUrl: "https://surfshark.com/deal/cryptoffiliate",
    affiliateSignupUrl: "https://surfshark.com/affiliates",
    commissionFirst: "40%+ on all plans",
    commissionRecurring: "30% on renewals",
    cookieDays: 30,
    minPayout: 100,
    payoutMethod: "PayPal, Wire",
    network: "Impact",
    lastUpdated: "2025-06-01",
  },

  // ─── Password Managers ────────────────────────────────────────────────────
  {
    id: "bitwarden",
    slug: "bitwarden",
    category: "password-manager",
    name: "Bitwarden",
    logo: "BW",
    logoColor: "#175DDC",
    tagline: "Best open-source — 30% lifetime recurring commission",
    description:
      "Bitwarden is the gold standard open-source password manager. Trusted by security professionals and crypto users who want verifiable privacy — every line of code is public. The affiliate program pays 30% recurring commission on every renewal, forever, with a 90-day cookie window.",
    rating: 4.8,
    reviews: 24000,
    badge: "Open Source",
    badgeColor: "#175DDC",
    freeTier: true,
    pricingStart: 0.83,
    pricingPeriod: "month",
    pricingNote: "$10/year for Premium. Free forever tier available",
    specs: {
      "Free tier":         "Yes — unlimited passwords, unlimited devices",
      "Premium":           "$10/year",
      "Families":          "$40/year (6 users)",
      "Open source":       "Yes — GitHub verified",
      "Self-hosting":      "Yes",
      "2FA support":       "TOTP, FIDO2, YubiKey",
      "Crypto integration":"Store seed phrases in encrypted vault",
    },
    cryptoRelevance: [
      "Store encrypted seed phrases and private keys in your vault",
      "Open source — crypto community can audit every line of code",
      "Self-hosting option — your vault, your server",
      "FIDO2/WebAuthn support for hardware key 2FA (YubiKey)",
      "Generate strong unique passwords for every exchange account",
    ],
    prosText: [
      "30% lifetime recurring commission on every renewal — no cap",
      "90-day cookie — longest window in this category",
      "Free tier drives mass adoption, paid conversions follow",
      "Open source credentials resonate strongly with crypto audience",
      "Self-hosting option for maximum paranoia users",
    ],
    consText: [
      "Low price ($10/yr) means small absolute commissions per user",
      "Less polished UX than 1Password for non-technical users",
      "Autofill requires manual triggering vs inline icons",
    ],
    verdict:
      "Best commission structure in the password manager space — 30% recurring forever with a 90-day cookie. The $10/year price means small individual commissions, but volume and lifetime value compound quickly. Open source angle converts exceptionally well with crypto audiences.",
    affiliateUrl: "https://bitwarden.com/?ref=cryptoffiliate",
    affiliateSignupUrl: "https://bitwarden.com/affiliates/",
    commissionFirst: "30% of first payment",
    commissionRecurring: "30% on every renewal forever",
    cookieDays: 90,
    minPayout: 50,
    payoutMethod: "PayPal (via Refersion)",
    network: "Refersion",
    lastUpdated: "2025-06-01",
  },
  {
    id: "1password",
    slug: "1password",
    category: "password-manager",
    name: "1Password",
    logo: "1P",
    logoColor: "#0A6EFA",
    tagline: "Best UX — $25–$50 CPA, highest average order value",
    description:
      "1Password is the most polished password manager on the market with the best user experience. Ideal for non-technical crypto investors who want security without friction. The Watchtower feature monitors for data breaches and weak passwords across all stored accounts.",
    rating: 4.7,
    reviews: 38000,
    badge: "Best UX",
    badgeColor: "#0A6EFA",
    freeTier: false,
    pricingStart: 2.99,
    pricingPeriod: "month",
    pricingNote: "billed annually at $35.88/yr. 14-day free trial",
    specs: {
      "Individual":       "$35.88/year",
      "Families":         "$59.88/year (5 users)",
      "Teams":            "$19.95/user/month",
      "Free trial":       "14 days, no credit card",
      "2FA support":      "TOTP, YubiKey, FIDO2",
      "Watchtower":       "Breach monitoring included",
      "Travel Mode":      "Hide vaults at border crossings",
    },
    cryptoRelevance: [
      "Travel Mode hides your crypto vaults at border crossings",
      "Watchtower alerts if any exchange account appears in a breach",
      "Store seed phrases in encrypted, cloud-synced vault",
      "Item history — restore deleted passwords and notes",
      "Teams plan for crypto funds and trading companies",
    ],
    prosText: [
      "$25–$50 CPA — highest absolute payout per password manager sale",
      "14-day free trial converts well — users self-qualify",
      "Watchtower breach alerts create urgency to upgrade",
      "Travel Mode is a unique crypto-relevant selling point",
      "Best UI of any password manager — low friction to adopt",
    ],
    consText: [
      "No free tier — some users prefer Bitwarden",
      "Closed source — less credible for maximum-paranoia users",
      "Canada HQ — Five Eyes jurisdiction",
    ],
    verdict:
      "Highest absolute CPA in the password manager space. The polished UX converts non-technical crypto investors who want security without complexity. Travel Mode is a genuine differentiator for international crypto holders.",
    affiliateUrl: "https://1password.com/ref/cryptoffiliate",
    affiliateSignupUrl: "https://1password.com/affiliates/",
    commissionFirst: "$25–$50 CPA per subscription",
    commissionRecurring: "~25% on renewals",
    cookieDays: 45,
    minPayout: 50,
    payoutMethod: "PayPal, Wire",
    network: "Impact",
    lastUpdated: "2025-06-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const VPN_TOOLS = SECURITY_TOOLS.filter((t) => t.category === "vpn");
export const PASSWORD_TOOLS = SECURITY_TOOLS.filter((t) => t.category === "password-manager");

export function getSecurityToolBySlug(slug: string): SecurityTool | undefined {
  return SECURITY_TOOLS.find((t) => t.slug === slug);
}
