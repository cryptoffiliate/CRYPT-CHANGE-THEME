/**
 * exchange-status.ts
 * Real-time exchange status tracking.
 * Checks public health endpoints and known status pages.
 */

export interface ExchangeStatus {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  status: "operational" | "degraded" | "partial_outage" | "major_outage" | "unknown";
  latencyMs: number | null;
  lastChecked: string;
  statusPageUrl: string;
  healthEndpoint: string | null;
  incidents: StatusIncident[];
  uptime30d: number; // percentage
}

export interface StatusIncident {
  id: string;
  exchangeId: string;
  title: string;
  description: string;
  severity: "minor" | "major" | "critical";
  startedAt: string;
  resolvedAt: string | null;
  affectedServices: string[];
  reportedBy: "system" | "user";
}

export const STATUS_CHECK_ENDPOINTS: Record<string, { url: string; method: string }> = {
  binance:  { url: "https://api.binance.com/api/v3/ping",           method: "GET" },
  coinbase: { url: "https://api.coinbase.com/v2/time",              method: "GET" },
  kraken:   { url: "https://api.kraken.com/0/public/Time",          method: "GET" },
  bybit:    { url: "https://api.bybit.com/v5/market/time",          method: "GET" },
  okx:      { url: "https://www.okx.com/api/v5/public/time",       method: "GET" },
};

export const STATUS_PAGES: Record<string, string> = {
  binance:  "https://www.binancestatus.com",
  coinbase: "https://status.coinbase.com",
  kraken:   "https://status.kraken.com",
  bybit:    "https://status.bybit.com",
  okx:      "https://www.okxstatus.com",
};

export const STATUS_LABELS: Record<ExchangeStatus["status"], string> = {
  operational:    "Operational",
  degraded:       "Degraded performance",
  partial_outage: "Partial outage",
  major_outage:   "Major outage",
  unknown:        "Unknown",
};

export const STATUS_COLORS: Record<ExchangeStatus["status"], string> = {
  operational:    "#22c55e",
  degraded:       "#f59e0b",
  partial_outage: "#f97316",
  major_outage:   "#ef4444",
  unknown:        "#71717a",
};

// Supabase table schema (run in SQL editor):
export const SCHEMA = `
create table if not exists exchange_status (
  id              text primary key,
  status          text default 'unknown',
  latency_ms      integer,
  last_checked    timestamptz default now(),
  uptime_30d      numeric(5,2) default 100
);

create table if not exists status_incidents (
  id              uuid primary key default gen_random_uuid(),
  exchange_id     text not null,
  title           text not null,
  description     text,
  severity        text check (severity in ('minor','major','critical')),
  started_at      timestamptz default now(),
  resolved_at     timestamptz,
  affected_services text[] default '{}',
  reported_by     text default 'user',
  created_at      timestamptz default now()
);

alter table exchange_status     enable row level security;
alter table status_incidents    enable row level security;
create policy "Public read status"    on exchange_status    for select using (true);
create policy "Public read incidents" on status_incidents   for select using (true);
create policy "Service write status"  on exchange_status    for all using (auth.role() = 'service_role');
create policy "Anyone report incident" on status_incidents  for insert using (true);
`;
