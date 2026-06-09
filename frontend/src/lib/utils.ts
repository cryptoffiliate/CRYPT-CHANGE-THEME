import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a fee percentage consistently */
export function formatFee(fee: number): string {
  return `${fee}%`;
}

/** Format a large number with K/M suffix */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

/** Build a full affiliate URL with UTM params for tracking */
export function buildAffiliateUrl(
  baseUrl: string,
  exchangeId: string,
  placement: "table" | "review" | "bonus" | "calculator" = "table"
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", "cryptoffiliate");
  url.searchParams.set("utm_medium", "affiliate");
  url.searchParams.set("utm_campaign", exchangeId);
  url.searchParams.set("utm_content", placement);
  return url.toString();
}

/** Truncate a string with ellipsis */
export function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen - 1) + "…";
}

/** Format an ISO date string as "Month Year" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
