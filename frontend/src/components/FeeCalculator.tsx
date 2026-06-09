"use client";

import { useState } from "react";
import type { Exchange } from "@/lib/types";
import { buildAffiliateUrl } from "@/lib/utils";

interface Props {
  exchanges: Exchange[];
}

export function FeeCalculator({ exchanges }: Props) {
  const [tradeSize, setTradeSize] = useState(1000);
  const [orderType, setOrderType] = useState<"maker" | "taker">("taker");

  const results = exchanges
    .map((e) => {
      const feeRate = orderType === "maker" ? e.makerFee : e.takerFee;
      const fee = (tradeSize * feeRate) / 100;
      return { exchange: e, feeRate, fee };
    })
    .sort((a, b) => a.fee - b.fee);

  const cheapest = results[0];
  const mostExpensive = results[results.length - 1];
  const savings = mostExpensive.fee - cheapest.fee;

  return (
    <div>
      {/* Inputs */}
      <div className="card p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Trade size (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                $
              </span>
              <input
                type="number"
                value={tradeSize}
                onChange={(e) => setTradeSize(Number(e.target.value))}
                min={1}
                step={100}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
            {/* Quick picks */}
            <div className="flex gap-2 mt-2">
              {[100, 1000, 5000, 10000].map((v) => (
                <button
                  key={v}
                  onClick={() => setTradeSize(v)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    tradeSize === v
                      ? "bg-brand-50 text-brand-600 border-brand-300"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  ${v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Order type
            </label>
            <div className="flex gap-2">
              {(["maker", "taker"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    orderType === type
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} order
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {orderType === "maker"
                ? "Maker = limit order that adds liquidity (usually cheaper)"
                : "Taker = market order that removes liquidity (usually more expensive)"}
            </p>
          </div>
        </div>
      </div>

      {/* Savings callout */}
      {savings > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-4 text-sm">
          <span className="font-semibold text-emerald-800">
            Potential savings:{" "}
          </span>
          <span className="text-emerald-700">
            Using {cheapest.exchange.name} instead of{" "}
            {mostExpensive.exchange.name} saves you{" "}
            <strong>${savings.toFixed(2)}</strong> on a $
            {tradeSize.toLocaleString()} trade.
          </span>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {results.map(({ exchange, feeRate, fee }, i) => {
          const isCheapest = i === 0;
          const affiliateUrl = buildAffiliateUrl(
            exchange.affiliateUrl,
            exchange.id,
            "calculator"
          );
          return (
            <div
              key={exchange.id}
              className={`card p-4 flex items-center gap-4 ${
                isCheapest
                  ? "border-emerald-200 ring-1 ring-emerald-200"
                  : ""
              }`}
            >
              {/* Rank */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isCheapest
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {i + 1}
              </div>

              {/* Logo */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                style={{
                  background: exchange.logoColor + "18",
                  border: `1.5px solid ${exchange.logoColor}40`,
                  color: exchange.logoColor,
                }}
              >
                {exchange.logo}
              </div>

              {/* Name + fee rate */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">
                    {exchange.name}
                  </span>
                  {isCheapest && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      Cheapest
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {feeRate}% {orderType} fee
                </p>
              </div>

              {/* Fee bar */}
              <div className="flex-1 hidden sm:block">
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(fee / mostExpensive.fee) * 100}%`,
                      background: isCheapest
                        ? "#22c55e"
                        : exchange.logoColor,
                    }}
                  />
                </div>
              </div>

              {/* Fee amount */}
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-base font-bold ${
                    isCheapest ? "text-emerald-600" : "text-slate-900"
                  }`}
                >
                  ${fee.toFixed(2)}
                </p>
                <p className="text-xs text-slate-400">fee</p>
              </div>

              {/* CTA */}
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border-[1.5px] transition-colors hidden sm:inline-flex items-center gap-1"
                style={{
                  color: exchange.logoColor,
                  borderColor: exchange.logoColor + "50",
                  background: exchange.logoColor + "10",
                }}
              >
                Trade →
              </a>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        Fees shown are standard tier rates as of June 2025. Some exchanges
        offer discounts for holding native tokens or for higher trading volumes.
        Affiliate links — we earn a commission at no cost to you.
      </p>
    </div>
  );
}
