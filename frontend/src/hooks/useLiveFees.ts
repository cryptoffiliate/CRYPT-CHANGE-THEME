"use client";

/**
 * useLiveFees.ts
 *
 * React hook that fetches live fee data from /api/fees.
 * Falls back to static data if the API is unavailable.
 * Used by ExchangeComparisonTable and FeeCalculator.
 */

import { useState, useEffect } from "react";
import { FALLBACK_FEES_STATIC } from "@/lib/fee-fetcher-constants";

export interface LiveFee {
  exchangeId: string;
  makerFee:   number;
  takerFee:   number;
  isLive:     boolean;   // true = fetched from exchange API tonight
  fetchedAt:  string;
}

interface UseLiveFeesResult {
  fees:      Record<string, LiveFee>;  // keyed by exchangeId
  loading:   boolean;
  error:     string | null;
  lastSyncAt: string | null;
}

export function useLiveFees(): UseLiveFeesResult {
  const [fees, setFees] = useState<Record<string, LiveFee>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/fees", {
          // Next.js fetch cache: revalidate every hour client-side
          next: { revalidate: 3600 },
        } as RequestInit);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (cancelled) return;

        const feeMap: Record<string, LiveFee> = {};
        for (const f of data.fees ?? []) {
          feeMap[f.exchangeId] = {
            exchangeId: f.exchangeId,
            makerFee:   f.makerFee,
            takerFee:   f.takerFee,
            isLive:     f.isLive ?? false,
            fetchedAt:  f.fetchedAt,
          };
        }
        setFees(feeMap);
        setLastSyncAt(data.servedAt ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load fees");

        // Fill in static fallbacks so UI still works
        const feeMap: Record<string, LiveFee> = {};
        for (const [id, f] of Object.entries(FALLBACK_FEES_STATIC)) {
          feeMap[id] = {
            exchangeId: id,
            makerFee:   f.maker,
            takerFee:   f.taker,
            isLive:     false,
            fetchedAt:  new Date().toISOString(),
          };
        }
        setFees(feeMap);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { fees, loading, error, lastSyncAt };
}

/**
 * Helper — get fee for a single exchange, with static fallback
 */
export function getFeeForExchange(
  fees: Record<string, LiveFee>,
  exchangeId: string
): { makerFee: number; takerFee: number; isLive: boolean } {
  if (fees[exchangeId]) return fees[exchangeId];
  const fb = FALLBACK_FEES_STATIC[exchangeId];
  return { makerFee: fb?.maker ?? 0.1, takerFee: fb?.taker ?? 0.1, isLive: false };
}
