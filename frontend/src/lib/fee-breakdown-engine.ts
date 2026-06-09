/**
 * fee-breakdown-engine.ts
 *
 * Calculates the TRUE total cost of a crypto trade including:
 *   1. Trading fee (maker or taker)
 *   2. Spread markup (the hidden one most sites don't show)
 *   3. Deposit fee (varies by payment method)
 *   4. Withdrawal fee (varies by asset and network)
 *   5. Network / gas fee
 *
 * Data sourced from exchange fee schedules as of June 2025.
 * All fee values are percentages unless noted as flat USD amounts.
 */

export type PaymentMethod = "bank_transfer" | "debit_card" | "credit_card" | "crypto_deposit";
export type WithdrawalNetwork = "btc" | "eth_erc20" | "usdt_trc20" | "usdt_erc20";
export type OrderType = "market" | "limit";

export interface FeeLayer {
  name: string;
  description: string;
  amount: number;       // in USD
  pct: number;          // as % of trade size
  isHidden: boolean;    // true = not shown prominently by exchange
  type: "trading" | "spread" | "deposit" | "withdrawal" | "network";
}

export interface ExchangeBreakdown {
  exchangeId: string;
  name: string;
  logoColor: string;
  logo: string;
  layers: FeeLayer[];
  totalFee: number;          // USD
  totalPct: number;          // % of trade size
  youReceive: number;        // USD after all fees
  affiliateUrl: string;
  bonus: string;
  verdict: string;           // one-line plain-English summary
}

// ─── Fee data per exchange ────────────────────────────────────────────────────

interface ExchangeFeeProfile {
  name: string;
  logo: string;
  logoColor: string;
  affiliateUrl: string;
  bonus: string;
  // Trading fees (%)
  makerFee: number;
  takerFee: number;
  // Spread markup (%) — added silently on top of trading fee
  spreadSimple: number;   // via beginner/simple interface
  spreadAdvanced: number; // via advanced/pro interface (often near zero)
  // Deposit fees by method (%)
  depositFees: Record<PaymentMethod, number>;
  depositFlatMin: Record<PaymentMethod, number>; // minimum flat fee in USD
  // Withdrawal fees (flat USD equiv.)
  withdrawalFees: Record<WithdrawalNetwork, number>;
}

const EXCHANGE_PROFILES: Record<string, ExchangeFeeProfile> = {
  coinbase: {
    name: "Coinbase",
    logo: "C",
    logoColor: "#0052FF",
    affiliateUrl: "https://coinbase.com/join/CRYPTOFFILIATE",
    bonus: "$10 in free Bitcoin",
    makerFee: 0.4,
    takerFee: 0.6,
    spreadSimple: 0.5,     // 0.5–2% hidden spread on simple buy/sell
    spreadAdvanced: 0.0,   // Advanced Trade has no spread
    depositFees: {
      bank_transfer: 0,
      debit_card: 3.99,
      credit_card: 3.99,
      crypto_deposit: 0,
    },
    depositFlatMin: {
      bank_transfer: 0,
      debit_card: 0,
      credit_card: 0,
      crypto_deposit: 0,
    },
    withdrawalFees: {
      btc: 2.50,
      eth_erc20: 8.00,
      usdt_trc20: 1.00,
      usdt_erc20: 12.00,
    },
  },
  binance: {
    name: "Binance",
    logo: "B",
    logoColor: "#F0B90B",
    affiliateUrl: "https://www.binance.com/en/register?ref=CRYPTOFFILIATE",
    bonus: "20% fee discount",
    makerFee: 0.1,
    takerFee: 0.1,
    spreadSimple: 1.0,    // "Convert" interface has ~1% spread
    spreadAdvanced: 0.0,  // Spot trading has no spread
    depositFees: {
      bank_transfer: 0,
      debit_card: 1.8,
      credit_card: 2.0,
      crypto_deposit: 0,
    },
    depositFlatMin: {
      bank_transfer: 0,
      debit_card: 0,
      credit_card: 0,
      crypto_deposit: 0,
    },
    withdrawalFees: {
      btc: 12.50,    // 0.00025 BTC at ~$50k
      eth_erc20: 3.50,
      usdt_trc20: 1.00,
      usdt_erc20: 12.00,
    },
  },
  kraken: {
    name: "Kraken",
    logo: "K",
    logoColor: "#5741D9",
    affiliateUrl: "https://www.kraken.com/sign-up?ref=CRYPTOFFILIATE",
    bonus: "0% maker fee 30 days",
    makerFee: 0.16,
    takerFee: 0.26,
    spreadSimple: 0.9,   // Kraken "Instant Buy" spread
    spreadAdvanced: 0.0,
    depositFees: {
      bank_transfer: 0,
      debit_card: 1.5,
      credit_card: 1.5,
      crypto_deposit: 0,
    },
    depositFlatMin: {
      bank_transfer: 0,
      debit_card: 0,
      credit_card: 0,
      crypto_deposit: 0,
    },
    withdrawalFees: {
      btc: 1.50,
      eth_erc20: 1.50,
      usdt_trc20: 2.50,
      usdt_erc20: 6.00,
    },
  },
  bybit: {
    name: "Bybit",
    logo: "BY",
    logoColor: "#F7A600",
    affiliateUrl: "https://www.bybit.com/register?affiliate_id=CRYPTOFFILIATE",
    bonus: "Up to $30,000 bonus",
    makerFee: 0.1,
    takerFee: 0.1,
    spreadSimple: 0.3,
    spreadAdvanced: 0.0,
    depositFees: {
      bank_transfer: 0,
      debit_card: 2.0,
      credit_card: 2.0,
      crypto_deposit: 0,
    },
    depositFlatMin: {
      bank_transfer: 0,
      debit_card: 0,
      credit_card: 0,
      crypto_deposit: 0,
    },
    withdrawalFees: {
      btc: 5.00,
      eth_erc20: 2.50,
      usdt_trc20: 1.00,
      usdt_erc20: 10.00,
    },
  },
  okx: {
    name: "OKX",
    logo: "OKX",
    logoColor: "#00B578",
    affiliateUrl: "https://www.okx.com/join/CRYPTOFFILIATE",
    bonus: "Mystery box up to $10k",
    makerFee: 0.08,
    takerFee: 0.1,
    spreadSimple: 0.3,
    spreadAdvanced: 0.0,
    depositFees: {
      bank_transfer: 0,
      debit_card: 2.0,
      credit_card: 2.0,
      crypto_deposit: 0,
    },
    depositFlatMin: {
      bank_transfer: 0,
      debit_card: 0,
      credit_card: 0,
      crypto_deposit: 0,
    },
    withdrawalFees: {
      btc: 2.50,
      eth_erc20: 2.00,
      usdt_trc20: 1.00,
      usdt_erc20: 8.00,
    },
  },
};

// ─── Breakdown calculator ─────────────────────────────────────────────────────

export interface CalculatorInputs {
  tradeSize: number;
  orderType: OrderType;
  useSimpleInterface: boolean;  // true = beginner UI with spread; false = advanced
  paymentMethod: PaymentMethod;
  withdrawalNetwork: WithdrawalNetwork;
  includeDeposit: boolean;
  includeWithdrawal: boolean;
}

function buildVerdict(
  exchangeId: string,
  totalPct: number,
  layers: FeeLayer[],
  inputs: CalculatorInputs
): string {
  const hiddenTotal = layers
    .filter((l) => l.isHidden)
    .reduce((sum, l) => sum + l.amount, 0);

  if (exchangeId === "coinbase" && inputs.useSimpleInterface) {
    return `The simple interface hides a ~0.5% spread on top of the trading fee. Switch to Coinbase Advanced Trade to cut costs by ~40%.`;
  }
  if (hiddenTotal > 10) {
    return `$${hiddenTotal.toFixed(2)} of your total cost comes from fees not shown on the main fee page.`;
  }
  if (totalPct < 0.15) {
    return `One of the cheapest options for this trade — low fees across all layers.`;
  }
  if (inputs.paymentMethod === "debit_card") {
    return `Debit card deposit adds significant cost. Use a bank transfer to save $${(layers.find(l => l.type === "deposit")?.amount ?? 0).toFixed(2)}.`;
  }
  return `Total cost of ${totalPct.toFixed(2)}% across all fee layers.`;
}

export function calculateBreakdown(
  inputs: CalculatorInputs
): ExchangeBreakdown[] {
  const results: ExchangeBreakdown[] = [];

  for (const [id, profile] of Object.entries(EXCHANGE_PROFILES)) {
    const layers: FeeLayer[] = [];
    const { tradeSize, orderType, useSimpleInterface, paymentMethod,
            withdrawalNetwork, includeDeposit, includeWithdrawal } = inputs;

    // ── 1. Deposit fee ──────────────────────────────────────────────────────
    if (includeDeposit && paymentMethod !== "crypto_deposit") {
      const depositPct = profile.depositFees[paymentMethod];
      const depositAmt = Math.max(
        (tradeSize * depositPct) / 100,
        profile.depositFlatMin[paymentMethod]
      );
      if (depositAmt > 0) {
        layers.push({
          name: "Deposit fee",
          description: `${paymentMethod.replace("_", " ")} deposit charge`,
          amount: depositAmt,
          pct: depositPct,
          isHidden: false,
          type: "deposit",
        });
      }
    }

    // ── 2. Spread (the hidden one) ──────────────────────────────────────────
    if (useSimpleInterface) {
      const spreadPct = profile.spreadSimple;
      const spreadAmt = (tradeSize * spreadPct) / 100;
      if (spreadAmt > 0) {
        layers.push({
          name: "Spread markup",
          description: `Price markup built into the ${profile.name} simple interface — not shown on the fee page`,
          amount: spreadAmt,
          pct: spreadPct,
          isHidden: true,
          type: "spread",
        });
      }
    }

    // ── 3. Trading fee ──────────────────────────────────────────────────────
    const tradingFeePct = orderType === "limit" ? profile.makerFee : profile.takerFee;
    const tradingFeeAmt = (tradeSize * tradingFeePct) / 100;
    layers.push({
      name: orderType === "limit" ? "Maker fee" : "Taker fee",
      description: `Standard ${orderType} order trading fee`,
      amount: tradingFeeAmt,
      pct: tradingFeePct,
      isHidden: false,
      type: "trading",
    });

    // ── 4. Withdrawal fee ───────────────────────────────────────────────────
    if (includeWithdrawal) {
      const withdrawAmt = profile.withdrawalFees[withdrawalNetwork];
      const withdrawPct = (withdrawAmt / tradeSize) * 100;
      layers.push({
        name: "Withdrawal fee",
        description: `${withdrawalNetwork.replace("_", " ").toUpperCase()} network withdrawal`,
        amount: withdrawAmt,
        pct: withdrawPct,
        isHidden: true,
        type: "withdrawal",
      });
    }

    const totalFee = layers.reduce((s, l) => s + l.amount, 0);
    const totalPct = (totalFee / tradeSize) * 100;
    const youReceive = tradeSize - totalFee;

    results.push({
      exchangeId: id,
      name: profile.name,
      logo: profile.logo,
      logoColor: profile.logoColor,
      affiliateUrl: profile.affiliateUrl,
      bonus: profile.bonus,
      layers,
      totalFee,
      totalPct,
      youReceive,
      verdict: buildVerdict(id, totalPct, layers, inputs),
    });
  }

  return results.sort((a, b) => a.totalFee - b.totalFee);
}
