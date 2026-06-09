/**
 * src/app/api/fees/route.ts
 *
 * Public endpoint — returns the latest stored fees for all exchanges.
 * Used by the comparison table and fee calculator for live data.
 *
 * GET /api/fees
 * GET /api/fees?exchange=binance
 *
 * Response is cached for 1 hour via stale-while-revalidate.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { FALLBACK_FEES_STATIC } from "@/lib/fee-fetcher-constants";

export const revalidate = 3600; // ISR: revalidate every hour

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const exchangeFilter = searchParams.get("exchange");

  try {
    const supabase = createServerSupabaseClient();

    let query = supabase
      .from("exchange_fees")
      .select("exchange_id, maker_fee, taker_fee, source, fetched_at, error_msg")
      .order("exchange_id");

    if (exchangeFilter) {
      query = query.eq("exchange_id", exchangeFilter);
    }

    const { data, error } = await query;

    if (error) throw error;

    // If DB has no data yet, return static fallbacks
    const fees = data?.length
      ? data.map((row) => ({
          exchangeId: row.exchange_id,
          makerFee:   row.maker_fee,
          takerFee:   row.taker_fee,
          source:     row.source,
          fetchedAt:  row.fetched_at,
          isLive:     row.source === "api",
        }))
      : Object.entries(FALLBACK_FEES_STATIC).map(([id, f]) => ({
          exchangeId: id,
          makerFee:   f.maker,
          takerFee:   f.taker,
          source:     "fallback" as const,
          fetchedAt:  new Date().toISOString(),
          isLive:     false,
        }));

    return NextResponse.json(
      {
        ok:          true,
        count:       fees.length,
        fees,
        // Tells the frontend when data was last refreshed
        servedAt:    new Date().toISOString(),
      },
      {
        headers: {
          // CDN: serve stale for 1h, refresh in background for up to 24h
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err) {
    // On DB failure, serve static fallbacks so the site never breaks
    const fees = Object.entries(FALLBACK_FEES_STATIC).map(([id, f]) => ({
      exchangeId: id,
      makerFee:   f.maker,
      takerFee:   f.taker,
      source:     "fallback" as const,
      fetchedAt:  new Date().toISOString(),
      isLive:     false,
    }));

    return NextResponse.json(
      {
        ok:       false,
        count:    fees.length,
        fees,
        error:    err instanceof Error ? err.message : "DB unavailable",
        servedAt: new Date().toISOString(),
      },
      { status: 200 } // 200 even on DB failure — frontend always gets usable data
    );
  }
}
