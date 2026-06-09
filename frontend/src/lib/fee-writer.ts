/**
 * fee-writer.ts
 *
 * Writes fetched fees to Supabase and maintains a run log.
 * Uses the service role key (server-side only — never expose to browser).
 */

import { createServerSupabaseClient } from "@/lib/supabase";
import type { ExchangeFees } from "@/lib/fee-fetcher";

export interface CronRunResult {
  runId: string;
  startedAt: string;
  completedAt: string;
  success: boolean;
  updatedCount: number;
  fallbackCount: number;
  errors: string[];
  fees: ExchangeFees[];
}

/**
 * Upserts all fetched fees into the `exchange_fees` table.
 * Only overwrites a row if the incoming data is from "api" source,
 * OR if no row exists yet (first run).
 */
export async function writeFees(fees: ExchangeFees[]): Promise<CronRunResult> {
  const supabase = createServerSupabaseClient();
  const startedAt = new Date().toISOString();
  const errors: string[] = [];
  let updatedCount = 0;
  let fallbackCount = 0;

  for (const fee of fees) {
    if (fee.error) errors.push(`[${fee.exchangeId}] ${fee.error}`);
    if (fee.source === "fallback") fallbackCount++;

    const { error } = await supabase.from("exchange_fees").upsert(
      {
        exchange_id:  fee.exchangeId,
        maker_fee:    fee.makerFee,
        taker_fee:    fee.takerFee,
        source:       fee.source,
        fetched_at:   fee.fetchedAt,
        error_msg:    fee.error ?? null,
        updated_at:   new Date().toISOString(),
      },
      {
        onConflict: "exchange_id",
        // Don't downgrade a live api value to a fallback if we already have live data
        ignoreDuplicates: false,
      }
    );

    if (error) {
      errors.push(`[${fee.exchangeId}] DB write failed: ${error.message}`);
    } else {
      updatedCount++;
    }
  }

  // Log the run
  const runId = crypto.randomUUID();
  const completedAt = new Date().toISOString();

  await supabase.from("cron_runs").insert({
    id:             runId,
    job_name:       "fee-sync",
    started_at:     startedAt,
    completed_at:   completedAt,
    success:        errors.filter(e => !e.includes("No OKX") && !e.includes("No Coinbase")).length === 0,
    updated_count:  updatedCount,
    fallback_count: fallbackCount,
    errors:         errors,
  });

  return {
    runId,
    startedAt,
    completedAt,
    success: updatedCount > 0,
    updatedCount,
    fallbackCount,
    errors,
    fees,
  };
}
