"use client";

/**
 * LiveFeesBadge.tsx
 *
 * Small inline badge shown on the comparison table and calculator.
 * Tells users the fees are live — this is your competitive differentiator.
 */

import { useLiveFees } from "@/hooks/useLiveFees";

export function LiveFeesBadge() {
  const { fees, loading, lastSyncAt } = useLiveFees();

  const liveCount = Object.values(fees).filter((f) => f.isLive).length;
  const totalCount = Object.values(fees).length;

  const lastSync = lastSyncAt
    ? new Date(lastSyncAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
        Syncing fees...
      </span>
    );
  }

  if (liveCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Fees from published schedules
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live fees · {liveCount}/{totalCount} exchanges synced
      {lastSync && (
        <span className="text-slate-400 font-normal">· Updated {lastSync}</span>
      )}
    </span>
  );
}

/**
 * FeeSyncStatus — admin-facing component for the cron dashboard
 */
export function FeeSyncStatus() {
  const { fees, loading, error } = useLiveFees();

  return (
    <div className="card p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Fee sync status
      </p>
      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div className="space-y-2">
          {Object.values(fees).map((fee) => (
            <div key={fee.exchangeId} className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 capitalize">{fee.exchangeId}</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-500">
                  {fee.makerFee}% / {fee.takerFee}%
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    fee.isLive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {fee.isLive ? "● Live" : "○ Fallback"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
