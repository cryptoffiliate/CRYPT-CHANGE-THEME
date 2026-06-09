#!/usr/bin/env npx tsx
/**
 * scripts/test-fee-fetcher.ts
 *
 * Run locally to verify all exchange fee fetchers before deploying.
 *
 * Usage:
 *   npx tsx scripts/test-fee-fetcher.ts
 *
 * Optional env vars for authenticated endpoints:
 *   OKX_API_KEY=...  OKX_SECRET=...  OKX_PASSPHRASE=...
 *   COINBASE_API_KEY=...
 */

import { fetchAllFees } from "../src/lib/fee-fetcher";

const EXPECTED: Record<string, { makerMin: number; makerMax: number; takerMin: number; takerMax: number }> = {
  binance:  { makerMin: 0.0, makerMax: 0.5, takerMin: 0.0, takerMax: 0.5 },
  kraken:   { makerMin: 0.0, makerMax: 0.5, takerMin: 0.0, takerMax: 0.5 },
  okx:      { makerMin: 0.0, makerMax: 0.3, takerMin: 0.0, takerMax: 0.3 },
  bybit:    { makerMin: 0.0, makerMax: 0.5, takerMin: 0.0, takerMax: 0.5 },
  coinbase: { makerMin: 0.0, makerMax: 1.0, takerMin: 0.0, takerMax: 1.0 },
};

const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED    = "\x1b[31m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";

function status(isLive: boolean, hasError: boolean): string {
  if (hasError && !isLive) return `${YELLOW}⚠  FALLBACK${RESET}`;
  if (isLive)              return `${GREEN}✓  LIVE API${RESET}`;
  return                          `${YELLOW}○  FALLBACK${RESET}`;
}

async function main() {
  console.log(`\n${BOLD}Cryptoffiliate — Fee Fetcher Test${RESET}`);
  console.log(`${DIM}Started: ${new Date().toISOString()}${RESET}\n`);

  const start = Date.now();
  const fees = await fetchAllFees();
  const elapsed = Date.now() - start;

  let passed = 0;
  let failed = 0;

  for (const fee of fees) {
    const exp = EXPECTED[fee.exchangeId];
    const isLive = fee.source === "api";
    const hasError = !!fee.error;

    const makerOk = exp && fee.makerFee >= exp.makerMin && fee.makerFee <= exp.makerMax;
    const takerOk = exp && fee.takerFee >= exp.takerMin && fee.takerFee <= exp.takerMax;
    const rangeOk = makerOk && takerOk;

    if (rangeOk) passed++; else failed++;

    const rangeSymbol = rangeOk ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;

    console.log(
      `  ${rangeSymbol} ${BOLD}${fee.exchangeId.padEnd(10)}${RESET}` +
      `  maker ${String(fee.makerFee).padEnd(6)}%` +
      `  taker ${String(fee.takerFee).padEnd(6)}%` +
      `  ${status(isLive, hasError)}`
    );

    if (fee.error) {
      console.log(`       ${DIM}${fee.error}${RESET}`);
    }
    if (!rangeOk) {
      console.log(`       ${RED}Out of expected range!${RESET}`);
    }
  }

  console.log(`\n${DIM}Completed in ${elapsed}ms${RESET}`);
  console.log(
    `Result: ${GREEN}${passed} passed${RESET}  ${failed > 0 ? RED : ""}${failed} failed${RESET}`
  );

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`${RED}Fatal:${RESET}`, err);
  process.exit(1);
});
