/**
 * GET /api/status/check
 * Pings all exchange health endpoints, measures latency, updates Supabase.
 * Called by cron every 5 minutes.
 */
import { NextRequest, NextResponse } from "next/server";
import { STATUS_CHECK_ENDPOINTS } from "@/data/exchange-status";
import { createServerSupabaseClient } from "@/lib/supabase";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret && process.env.NODE_ENV === "development") return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function pingExchange(id: string, endpoint: { url: string; method: string }) {
  const start = Date.now();
  try {
    const res = await fetch(endpoint.url, {
      method: endpoint.method,
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      return { id, status: "degraded" as const, latencyMs, error: null };
    }
    const status = latencyMs > 3000 ? "degraded" as const : "operational" as const;
    return { id, status, latencyMs, error: null };
  } catch (err) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = msg.includes("timeout") || msg.includes("abort");
    return { id, status: isTimeout ? "major_outage" as const : "degraded" as const, latencyMs, error: msg };
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await Promise.allSettled(
    Object.entries(STATUS_CHECK_ENDPOINTS).map(([id, ep]) => pingExchange(id, ep))
  );

  const statuses = results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
    .map((r) => r.value);

  const supabase = createServerSupabaseClient();
  for (const s of statuses) {
    await supabase.from("exchange_status").upsert({
      id: s.id,
      status: s.status,
      latency_ms: s.latencyMs,
      last_checked: new Date().toISOString(),
    }, { onConflict: "id" });
  }

  return NextResponse.json({ ok: true, checked: statuses.length, results: statuses });
}

export const runtime = "nodejs";
