/**
 * src/app/api/cron/sync-fees/route.ts
 *
 * Vercel Cron Job endpoint — runs nightly at 02:00 UTC.
 * Secured with CRON_SECRET environment variable.
 *
 * Vercel calls this via:
 *   GET /api/cron/sync-fees
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Schedule is configured in vercel.json (see project root).
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchAllFees } from "@/lib/fee-fetcher";
import { writeFees } from "@/lib/fee-writer";

// ─── Security: reject requests without the cron secret ───────────────────────
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  // In development without a secret set, allow through for testing
  if (!secret && process.env.NODE_ENV === "development") return true;
  if (!secret) return false;

  return authHeader === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[fee-sync] Starting fee synchronization run...");
  const startTime = Date.now();

  try {
    // ── Step 1: Fetch all fees in parallel ─────────────────────────────────
    const fees = await fetchAllFees();

    console.log(
      "[fee-sync] Fetched:",
      fees.map((f) => `${f.exchangeId}=${f.makerFee}/${f.takerFee}(${f.source})`).join(", ")
    );

    // ── Step 2: Write to Supabase ───────────────────────────────────────────
    const result = await writeFees(fees);

    const duration = Date.now() - startTime;

    console.log(
      `[fee-sync] Done in ${duration}ms. Updated: ${result.updatedCount}, Fallbacks: ${result.fallbackCount}`
    );

    if (result.errors.length > 0) {
      console.warn("[fee-sync] Non-fatal errors:", result.errors);
    }

    return NextResponse.json({
      ok:            true,
      runId:         result.runId,
      durationMs:    duration,
      updatedCount:  result.updatedCount,
      fallbackCount: result.fallbackCount,
      errors:        result.errors,
      fees:          result.fees.map((f) => ({
        exchange:  f.exchangeId,
        maker:     f.makerFee,
        taker:     f.takerFee,
        source:    f.source,
        fetchedAt: f.fetchedAt,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[fee-sync] Fatal error:", message);

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

// Vercel Edge Runtime — faster cold starts, global execution
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30; // seconds — well within Vercel's 60s cron limit
