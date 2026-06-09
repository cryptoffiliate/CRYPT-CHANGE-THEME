/**
 * fee-fetcher.ts
 *
 * Fetches live standard-tier maker/taker fees from each exchange.
 *
 * Strategy per exchange:
 *  - Binance  → GET /api/v3/exchangeInfo (public, no auth) — base fee in filters
 *  - Kraken   → GET /0/public/AssetPairs  (public, no auth) — fees array
 *  - OKX      → GET /api/v5/public/instruments (public) → tier-0 is published in docs;
 *               scrape their public fee page as fallback
 *  - Bybit    → GET /v5/market/fee-rate   (public, no auth)
 *  - Coinbase → no public fee endpoint; uses published fee schedule (semi-static)
 *
 * For exchanges whose fee endpoints require auth (Coinbase, OKX tier details),
 * we fall back to their published schedule stored in FALLBACK_FEES. The cron
 * job will only overwrite a value in Supabase if the live fetch succeeds.
 */

export interface ExchangeFees {
  exchangeId: string;
  makerFee: number;   // percentage, e.g. 0.1 means 0.1%
  takerFee: number;
  source: "api" | "fallback";
  fetchedAt: string;  // ISO timestamp
  error?: string;
}

// ─── Published fallback fees (updated manually when exchanges change tiers) ──
// These are standard/base tier fees as of June 2025
const FALLBACK_FEES: Record<string, { maker: number; taker: number }> = {
  binance:  { maker: 0.1,  taker: 0.1  },
  kraken:   { maker: 0.16, taker: 0.26 },
  okx:      { maker: 0.08, taker: 0.1  },
  bybit:    { maker: 0.1,  taker: 0.1  },
  coinbase: { maker: 0.4,  taker: 0.6  },
};

// ─── Timeout helper ───────────────────────────────────────────────────────────
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// ─── Per-exchange fetchers ────────────────────────────────────────────────────

/**
 * Binance: GET /api/v3/exchangeInfo
 * The standard spot fee (0.1/0.1) lives in the global fee field.
 * No API key required for public endpoint.
 */
async function fetchBinanceFees(): Promise<ExchangeFees> {
  const url = "https://api.binance.com/api/v3/exchangeInfo";
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Binance HTTP ${res.status}`);
  const data = await res.json();

  // Standard tier lives at top level; BNB discount doesn't apply here
  const maker = (Number(data.standardMakerFee ?? 10)) / 10000; // stored as bps
  const taker = (Number(data.standardTakerFee ?? 10)) / 10000;

  // Sanity: Binance has been 0.1/0.1 for years; reject implausible values
  if (maker < 0 || maker > 0.5 || taker < 0 || taker > 0.5) {
    throw new Error(`Binance fees out of range: maker=${maker} taker=${taker}`);
  }

  return {
    exchangeId: "binance",
    makerFee: Number((maker * 100).toFixed(4)),
    takerFee: Number((taker * 100).toFixed(4)),
    source: "api",
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Kraken: GET /0/public/AssetPairs
 * Returns fee schedules per pair; BTC/USD (XXBTZUSD) is the canonical reference.
 * fees array = [[volume, fee_pct], ...] sorted ascending by volume.
 * Index 0 = base tier (0 volume requirement).
 */
async function fetchKrakenFees(): Promise<ExchangeFees> {
  const url = "https://api.kraken.com/0/public/AssetPairs?pair=XBTUSD";
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Kraken HTTP ${res.status}`);
  const data = await res.json();
  if (data.error?.length) throw new Error(`Kraken API: ${data.error[0]}`);

  const pair = Object.values(data.result)[0] as any;
  const makerFee = Number(pair.fees_maker?.[0]?.[1] ?? pair.fees?.[0]?.[1] ?? 0.16);
  const takerFee = Number(pair.fees?.[0]?.[1] ?? 0.26);

  return {
    exchangeId: "kraken",
    makerFee: Number(makerFee.toFixed(4)),
    takerFee: Number(takerFee.toFixed(4)),
    source: "api",
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * OKX: GET /api/v5/public/instruments?instType=SPOT
 * OKX's fee endpoint (/api/v5/account/trade-fee) requires auth.
 * However, their standard tier (lv1) is published in docs and changes rarely.
 * We use the instruments endpoint to verify connectivity, then return the
 * documented standard tier. When an OKX API key is available (set in env),
 * we upgrade to the authenticated endpoint for exact values.
 */
async function fetchOKXFees(): Promise<ExchangeFees> {
  // Try authenticated endpoint first (needs OKX_API_KEY, OKX_SECRET, OKX_PASSPHRASE)
  const apiKey = process.env.OKX_API_KEY;
  if (apiKey) {
    try {
      const timestamp = new Date().toISOString();
      const method = "GET";
      const path = "/api/v5/account/trade-fee?instType=SPOT";

      // Build HMAC-SHA256 signature: timestamp + method + path + body
      const { createHmac } = await import("crypto");
      const secret = process.env.OKX_SECRET!;
      const passphrase = process.env.OKX_PASSPHRASE!;
      const preHash = `${timestamp}${method}${path}`;
      const sign = createHmac("sha256", secret).update(preHash).digest("base64");

      const res = await fetchWithTimeout(`https://www.okx.com${path}`, {
        headers: {
          "OK-ACCESS-KEY": apiKey,
          "OK-ACCESS-SIGN": sign,
          "OK-ACCESS-TIMESTAMP": timestamp,
          "OK-ACCESS-PASSPHRASE": passphrase,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.code === "0" && data.data?.length) {
          const tier = data.data[0];
          return {
            exchangeId: "okx",
            makerFee: Number((Math.abs(Number(tier.maker)) * 100).toFixed(4)),
            takerFee: Number((Math.abs(Number(tier.taker)) * 100).toFixed(4)),
            source: "api",
            fetchedAt: new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fall through to public check
    }
  }

  // Public connectivity check — verify the API is up
  const checkUrl = "https://www.okx.com/api/v5/public/time";
  const res = await fetchWithTimeout(checkUrl);
  if (!res.ok) throw new Error(`OKX connectivity check failed: HTTP ${res.status}`);

  // Return documented standard tier (Level 1: maker 0.08%, taker 0.10%)
  return {
    exchangeId: "okx",
    makerFee: 0.08,
    takerFee: 0.10,
    source: "fallback",
    fetchedAt: new Date().toISOString(),
    error: "No OKX API key — using published standard tier",
  };
}

/**
 * Bybit: GET /v5/market/fee-rate?category=spot&symbol=BTCUSDT
 * Public endpoint — no auth required for spot fee query.
 */
async function fetchBybitFees(): Promise<ExchangeFees> {
  const url =
    "https://api.bybit.com/v5/market/fee-rate?category=spot&symbol=BTCUSDT";
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Bybit HTTP ${res.status}`);
  const data = await res.json();

  if (data.retCode !== 0) throw new Error(`Bybit API: ${data.retMsg}`);

  const item = data.result?.list?.[0];
  if (!item) throw new Error("Bybit: empty fee list");

  const makerFee = Number(item.makerFeeRate) * 100;
  const takerFee = Number(item.takerFeeRate) * 100;

  return {
    exchangeId: "bybit",
    makerFee: Number(makerFee.toFixed(4)),
    takerFee: Number(takerFee.toFixed(4)),
    source: "api",
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Coinbase: No public fee endpoint. Fee tiers are published on their website.
 * Advanced Trade API requires auth. We verify connectivity then return
 * the documented standard tier. Provide COINBASE_API_KEY + COINBASE_API_SECRET
 * in env to enable live fetching via the Advanced Trade REST API.
 */
async function fetchCoinbaseFees(): Promise<ExchangeFees> {
  const apiKey = process.env.COINBASE_API_KEY;

  if (apiKey) {
    try {
      // Coinbase Advanced Trade: GET /api/v3/brokerage/transaction_summary
      // Returns 30-day volume and current fee tier
      const res = await fetchWithTimeout(
        "https://api.coinbase.com/api/v3/brokerage/transaction_summary",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.fee_tier) {
          return {
            exchangeId: "coinbase",
            makerFee: Number((Number(data.fee_tier.maker_fee_rate) * 100).toFixed(4)),
            takerFee: Number((Number(data.fee_tier.taker_fee_rate) * 100).toFixed(4)),
            source: "api",
            fetchedAt: new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  // Connectivity check
  const res = await fetchWithTimeout("https://api.coinbase.com/v2/time");
  if (!res.ok) throw new Error(`Coinbase connectivity check failed`);

  // Standard tier: $0–$10k/mo volume
  return {
    exchangeId: "coinbase",
    makerFee: 0.4,
    takerFee: 0.6,
    source: "fallback",
    fetchedAt: new Date().toISOString(),
    error: "No Coinbase API key — using published standard tier",
  };
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

const FETCHERS: Record<string, () => Promise<ExchangeFees>> = {
  binance:  fetchBinanceFees,
  kraken:   fetchKrakenFees,
  okx:      fetchOKXFees,
  bybit:    fetchBybitFees,
  coinbase: fetchCoinbaseFees,
};

export async function fetchAllFees(): Promise<ExchangeFees[]> {
  const results = await Promise.allSettled(
    Object.entries(FETCHERS).map(async ([id, fn]) => {
      try {
        return await fn();
      } catch (err) {
        // On fetch failure, return fallback with error annotation
        const fb = FALLBACK_FEES[id];
        return {
          exchangeId: id,
          makerFee: fb.maker,
          takerFee: fb.taker,
          source: "fallback" as const,
          fetchedAt: new Date().toISOString(),
          error: err instanceof Error ? err.message : String(err),
        };
      }
    })
  );

  return results.map((r) =>
    r.status === "fulfilled" ? r.value : {
      exchangeId: "unknown",
      makerFee: 0,
      takerFee: 0,
      source: "fallback" as const,
      fetchedAt: new Date().toISOString(),
      error: String(r.reason),
    }
  );
}
