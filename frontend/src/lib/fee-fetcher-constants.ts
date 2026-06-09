/**
 * fee-fetcher-constants.ts
 *
 * Static fallback fees — exported separately so they can be imported
 * by both server-side code (fee-fetcher.ts) and the public API route
 * without pulling in Node.js crypto imports into the edge runtime.
 */

export const FALLBACK_FEES_STATIC: Record<string, { maker: number; taker: number }> = {
  binance:  { maker: 0.1,  taker: 0.1  },
  kraken:   { maker: 0.16, taker: 0.26 },
  okx:      { maker: 0.08, taker: 0.1  },
  bybit:    { maker: 0.1,  taker: 0.1  },
  coinbase: { maker: 0.4,  taker: 0.6  },
};
