"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { TaxSoftware } from "@/data/tax-software";

type SortKey = "rating" | "pricingStart" | "commissionPct" | "exchanges";

function Check({ val }: { val: boolean }) {
  return val
    ? <span className="text-emerald-500 text-base">✓</span>
    : <span className="text-red-400 text-sm">✗</span>;
}

function ExpandedRow({ platform }: { platform: TaxSoftware }) {
  return (
    <tr className="bg-slate-50/50">
      <td colSpan={8} className="px-4 pb-4 pt-1">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-44 bg-white rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Best for</p>
            <div className="flex flex-wrap gap-1.5">
              {platform.bestFor.map((b) => (
                <span key={b} className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: platform.logoColor + "12", color: platform.logoColor }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-44 bg-white rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Affiliate program</p>
            <p className="text-sm font-semibold text-slate-900">{platform.commissionPct}% first sale
              {platform.recurringPct > 0 && ` · ${platform.recurringPct}% recurring`}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Cookie: {platform.cookieDays === "lifetime" ? "Lifetime" : `${platform.cookieDays} days`} ·
              Min payout: ${platform.minPayout}
            </p>
            <a href={platform.affiliateSignupUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-brand-500 font-medium mt-1.5 inline-block hover:text-brand-600">
              Join program →
            </a>
          </div>
          <div className="flex-1 min-w-44 bg-white rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tax forms</p>
            <div className="flex flex-wrap gap-1">
              {platform.forms.map((f) => (
                <span key={f} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function TaxComparisonTable({ platforms }: { platforms: TaxSoftware[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [usOnly, setUsOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(key === "pricingStart"); }
  };

  const sorted = useMemo(() => {
    let list = [...platforms];
    if (usOnly) list = list.filter((p) => p.id === "coinledger" || p.id === "taxbit" || p.id === "zenledger");
    if (freeOnly) list = list.filter((p) => p.freeTier);
    list.sort((a, b) => {
      const va = a[sortKey] as number, vb = b[sortKey] as number;
      return sortAsc ? va - vb : vb - va;
    });
    return list;
  }, [platforms, sortKey, sortAsc, usOnly, freeOnly]);

  const SortTh = ({ k, label }: { k: SortKey; label: string }) => (
    <th onClick={() => handleSort(k)}
      className={`px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider cursor-pointer select-none transition-colors ${
        sortKey === k ? "text-brand-500 border-b-2 border-brand-500" : "text-slate-400 hover:text-slate-600"
      }`}>
      {label}{sortKey === k ? (sortAsc ? " ↑" : " ↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs items-center">
        <span className="text-slate-400 font-semibold uppercase tracking-wider">Filter:</span>
        {[
          { label: "Free tier", active: freeOnly, toggle: () => setFreeOnly((v) => !v) },
          { label: "US focus",  active: usOnly,   toggle: () => setUsOnly((v) => !v) },
        ].map(({ label, active, toggle }) => (
          <button key={label} onClick={toggle}
            className={`px-3 py-1.5 rounded-full border-[1.5px] font-medium transition-all ${
              active ? "bg-brand-50 text-brand-600 border-brand-400" : "bg-white text-slate-600 border-slate-200"
            }`}>
            {active && "✓ "}{label}
          </button>
        ))}
        <span className="text-slate-400 font-semibold uppercase tracking-wider ml-2">Sort:</span>
        {([["rating","Rating"],["pricingStart","Price"],["commissionPct","Commission"],["exchanges","Exchanges"]] as [SortKey,string][]).map(([k,l]) => (
          <button key={k} onClick={() => handleSort(k)}
            className={`px-3 py-1.5 rounded-full border-[1.5px] font-medium transition-all ${
              sortKey === k ? "bg-brand-50 text-brand-600 border-brand-400" : "bg-white text-slate-600 border-slate-200"
            }`}>
            {l}{sortKey === k ? (sortAsc ? " ↑" : " ↓") : ""}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform</th>
                <SortTh k="rating" label="Rating" />
                <SortTh k="pricingStart" label="From" />
                <SortTh k="commissionPct" label="Commission" />
                <SortTh k="exchanges" label="Exchanges" />
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">DeFi</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Free</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Try it</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const isExp = expandedId === p.id;
                return (
                  <>
                    <tr key={p.id} onClick={() => setExpandedId(isExp ? null : p.id)}
                      className={`cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 ${isExp ? "bg-brand-50/20" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono flex-shrink-0"
                            style={{ background: p.logoColor + "18", border: `1.5px solid ${p.logoColor}40`, color: p.logoColor }}>
                            {p.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-slate-900">{p.name}</span>
                              {p.badge && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                                  style={{ background: p.badgeColor! + "18", color: p.badgeColor! }}>
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{p.countries === 1 ? "US only" : `${p.countries}+ countries`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <p className="font-semibold text-sm text-slate-900">{p.rating}</p>
                        <p className="text-xs text-slate-400">/5</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <p className="font-semibold text-sm text-slate-900">${p.pricingStart}</p>
                        <p className="text-xs text-slate-400">/yr</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <p className="font-semibold text-sm text-emerald-600">{p.commissionPct}%</p>
                        {p.recurringPct > 0 && <p className="text-xs text-slate-400">+{p.recurringPct}% recur.</p>}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <p className="font-semibold text-sm text-slate-900">{p.exchanges}+</p>
                      </td>
                      <td className="px-3 py-3 text-center"><Check val={p.defiSupport} /></td>
                      <td className="px-3 py-3 text-center"><Check val={p.freeTier} /></td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border-[1.5px] transition-all"
                          style={{ color: p.logoColor, borderColor: p.logoColor + "50", background: p.logoColor + "10" }}>
                          Try →
                        </a>
                      </td>
                    </tr>
                    {isExp && <ExpandedRow key={`${p.id}-exp`} platform={p} />}
                  </>
                );
              })}
              {sorted.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No platforms match filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-between text-xs text-slate-400 flex-wrap gap-2">
          <span>Click any row to expand · Commission data from official program pages · June 2025</span>
          <Link href="/disclosure" className="underline hover:text-slate-600">Affiliate disclosure</Link>
        </div>
      </div>
    </div>
  );
}
