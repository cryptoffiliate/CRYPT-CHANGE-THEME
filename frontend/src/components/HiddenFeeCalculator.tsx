"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateBreakdown,
  type CalculatorInputs,
  type ExchangeBreakdown,
  type FeeLayer,
} from "@/lib/fee-breakdown-engine";
import { buildAffiliateUrl } from "@/lib/utils";

// ─── Input controls ───────────────────────────────────────────────────────────

const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer (ACH/SEPA)",
  debit_card:    "Debit card",
  credit_card:   "Credit card",
  crypto_deposit:"Crypto deposit",
};

const WITHDRAWAL_LABELS: Record<string, string> = {
  btc:         "Bitcoin (BTC)",
  eth_erc20:   "Ethereum ERC-20",
  usdt_trc20:  "USDT on Tron (TRC-20) — cheapest",
  usdt_erc20:  "USDT on Ethereum (ERC-20) — expensive",
};

const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? "bg-brand-500 text-white border-brand-500"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Fee bar stack (visual breakdown per exchange) ────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  deposit:    "#6366f1",
  spread:     "#ef4444",
  trading:    "#f59e0b",
  withdrawal: "#8b5cf6",
  network:    "#64748b",
};

const TYPE_LABELS: Record<string, string> = {
  deposit:    "Deposit",
  spread:     "Spread (hidden)",
  trading:    "Trading fee",
  withdrawal: "Withdrawal",
  network:    "Network",
};

function FeeStackBar({
  layers,
  totalFee,
  maxFee,
}: {
  layers: FeeLayer[];
  totalFee: number;
  maxFee: number;
}) {
  const barWidth = maxFee > 0 ? (totalFee / maxFee) * 100 : 0;

  return (
    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden w-full">
      <div
        className="h-full flex rounded-full overflow-hidden transition-all duration-700"
        style={{ width: `${barWidth}%` }}
      >
        {layers.map((layer, i) => {
          const segWidth = totalFee > 0 ? (layer.amount / totalFee) * 100 : 0;
          return (
            <div
              key={i}
              style={{
                width: `${segWidth}%`,
                background: TYPE_COLORS[layer.type] ?? "#64748b",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Single exchange result row ───────────────────────────────────────────────

function ExchangeResultRow({
  result,
  rank,
  maxFee,
  tradeSize,
  isExpanded,
  onToggle,
}: {
  result: ExchangeBreakdown;
  rank: number;
  maxFee: number;
  tradeSize: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isCheapest = rank === 0;
  const url = buildAffiliateUrl(result.affiliateUrl, result.exchangeId, "calculator" as any);

  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer border-b border-slate-100 transition-colors ${
          isCheapest
            ? "bg-emerald-50/50 hover:bg-emerald-50"
            : "hover:bg-slate-50"
        }`}
      >
        {/* Rank + name */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                isCheapest
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {rank + 1}
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
              style={{
                background: result.logoColor + "18",
                border: `1.5px solid ${result.logoColor}40`,
                color: result.logoColor,
              }}
            >
              {result.logo}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {result.name}
              </p>
              {isCheapest && (
                <p className="text-xs text-emerald-600 font-medium">
                  Cheapest option
                </p>
              )}
            </div>
          </div>
        </td>

        {/* Fee bar */}
        <td className="px-3 py-3.5 min-w-32">
          <FeeStackBar
            layers={result.layers}
            totalFee={result.totalFee}
            maxFee={maxFee}
          />
        </td>

        {/* Total fee */}
        <td className="px-3 py-3.5 text-right">
          <p
            className={`text-sm font-bold ${
              isCheapest ? "text-emerald-600" : "text-slate-900"
            }`}
          >
            ${result.totalFee.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400">{result.totalPct.toFixed(2)}%</p>
        </td>

        {/* You receive */}
        <td className="px-3 py-3.5 text-right">
          <p className="text-sm font-semibold text-slate-900">
            ${result.youReceive.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400">of ${tradeSize.toLocaleString()}</p>
        </td>

        {/* CTA */}
        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border-[1.5px] transition-colors"
            style={{
              color: result.logoColor,
              borderColor: result.logoColor + "50",
              background: result.logoColor + "10",
            }}
          >
            Trade →
          </a>
        </td>
      </tr>

      {/* Expanded breakdown */}
      {isExpanded && (
        <tr className={isCheapest ? "bg-emerald-50/30" : "bg-slate-50/50"}>
          <td colSpan={5} className="px-4 pb-4 pt-1">
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Fee layers */}
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Fee breakdown
                </p>
                <div className="space-y-2.5">
                  {result.layers.map((layer, i) => (
                    <div key={i} className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ background: TYPE_COLORS[layer.type] }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                            {layer.name}
                            {layer.isHidden && (
                              <span className="text-xs text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                                hidden
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 leading-tight mt-0.5">
                            {layer.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-slate-900">
                          ${layer.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {layer.pct.toFixed(3)}%
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-2.5 flex justify-between">
                    <p className="text-xs font-bold text-slate-900">Total cost</p>
                    <p
                      className="text-xs font-black"
                      style={{ color: result.logoColor }}
                    >
                      ${result.totalFee.toFixed(2)} ({result.totalPct.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Verdict + CTA */}
              <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Our take
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {result.verdict}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-3">
                    🎁 {result.bonus}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex-1 py-2 rounded-lg text-xs font-bold text-white text-center transition-opacity hover:opacity-90"
                    style={{ background: result.logoColor }}
                  >
                    Trade on {result.name} →
                  </a>
                  <Link
                    href={`/reviews/${result.exchangeId}`}
                    className="px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {Object.entries(TYPE_LABELS).map(([type, label]) => (
        <div key={type} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: TYPE_COLORS[type] }}
          />
          <span className="text-xs text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HiddenFeeCalculator() {
  const [tradeSize, setTradeSize] = useState(1000);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [useSimple, setUseSimple] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<CalculatorInputs["paymentMethod"]>("bank_transfer");
  const [withdrawalNetwork, setWithdrawalNetwork] = useState<CalculatorInputs["withdrawalNetwork"]>("usdt_trc20");
  const [includeDeposit, setIncludeDeposit] = useState(false);
  const [includeWithdrawal, setIncludeWithdrawal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const inputs: CalculatorInputs = {
    tradeSize,
    orderType,
    useSimpleInterface: useSimple,
    paymentMethod,
    withdrawalNetwork,
    includeDeposit,
    includeWithdrawal,
  };

  const results = useMemo(() => calculateBreakdown(inputs), [
    tradeSize, orderType, useSimple, paymentMethod,
    withdrawalNetwork, includeDeposit, includeWithdrawal,
  ]);

  const maxFee = Math.max(...results.map((r) => r.totalFee));
  const cheapest = results[0];
  const mostExpensive = results[results.length - 1];
  const savings = mostExpensive.totalFee - cheapest.totalFee;

  return (
    <div>
      {/* Input panel */}
      <div className="card p-5 mb-6">
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Trade size */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Trade size (USD)
            </label>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <input
                type="number"
                value={tradeSize}
                onChange={(e) => setTradeSize(Math.max(1, Number(e.target.value)))}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTradeSize(amt)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    tradeSize === amt
                      ? "bg-brand-50 text-brand-600 border-brand-300 font-medium"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Order type + interface */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Order type
              </label>
              <div className="flex gap-2">
                <ToggleChip active={orderType === "market"} onClick={() => setOrderType("market")}>
                  Market order
                </ToggleChip>
                <ToggleChip active={orderType === "limit"} onClick={() => setOrderType("limit")}>
                  Limit order
                </ToggleChip>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Trading interface
              </label>
              <div className="flex gap-2">
                <ToggleChip active={useSimple} onClick={() => setUseSimple(true)}>
                  Simple / beginner UI
                </ToggleChip>
                <ToggleChip active={!useSimple} onClick={() => setUseSimple(false)}>
                  Advanced / pro UI
                </ToggleChip>
              </div>
            </div>
          </div>
        </div>

        {/* Optional: deposit + withdrawal */}
        <div className="border-t border-slate-100 mt-4 pt-4 grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="incl-deposit"
                checked={includeDeposit}
                onChange={(e) => setIncludeDeposit(e.target.checked)}
                className="w-4 h-4 accent-brand-500"
              />
              <label htmlFor="incl-deposit" className="text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer">
                Include deposit fee
              </label>
            </div>
            {includeDeposit && (
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                {Object.entries(PAYMENT_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="incl-withdrawal"
                checked={includeWithdrawal}
                onChange={(e) => setIncludeWithdrawal(e.target.checked)}
                className="w-4 h-4 accent-brand-500"
              />
              <label htmlFor="incl-withdrawal" className="text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer">
                Include withdrawal fee
              </label>
            </div>
            {includeWithdrawal && (
              <select
                value={withdrawalNetwork}
                onChange={(e) => setWithdrawalNetwork(e.target.value as any)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                {Object.entries(WITHDRAWAL_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Savings callout */}
      {savings > 0.50 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-sm flex items-start gap-3">
          <span className="text-lg flex-shrink-0">💡</span>
          <p className="text-emerald-800 leading-relaxed">
            <span className="font-bold">Save ${savings.toFixed(2)}</span> on this trade
            by using {cheapest.name} instead of {mostExpensive.name}
            {useSimple && " — and switch to the advanced interface to eliminate the hidden spread."}
          </p>
        </div>
      )}

      {/* Hidden fee warning */}
      {useSimple && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p className="text-red-700 leading-relaxed">
            <span className="font-bold">Spread markups are active.</span> You're simulating
            the beginner/simple interface — most exchanges add a hidden spread of 0.3–1%
            on top of their advertised fee. Switch to "Advanced / pro UI" above to see
            what the actual trading fee looks like without the markup.
          </p>
        </div>
      )}

      {/* Results table */}
      <div className="card overflow-hidden shadow-sm">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 flex-wrap gap-3">
          <Legend />
          <p className="text-xs text-slate-400">Click any row to expand</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Exchange
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-32">
                  Fee composition
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total fee
                </th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  You receive
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Trade
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => (
                <ExchangeResultRow
                  key={result.exchangeId}
                  result={result}
                  rank={i}
                  maxFee={maxFee}
                  tradeSize={tradeSize}
                  isExpanded={expandedId === result.exchangeId}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === result.exchangeId ? null : result.exchangeId
                    )
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex justify-between flex-wrap gap-2">
          <span>
            Spread data from published exchange schedules · June 2025 ·{" "}
            <Link href="/disclosure" className="underline hover:text-slate-600">
              Affiliate disclosure
            </Link>
          </span>
          <span>Fees shown are standard tier (no VIP discounts)</span>
        </div>
      </div>
    </div>
  );
}
