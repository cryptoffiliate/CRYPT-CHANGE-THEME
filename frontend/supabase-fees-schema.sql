-- ============================================================
-- Fee sync tables — add to your existing supabase-schema.sql
-- Run in the Supabase SQL editor
-- ============================================================

-- Live fee storage (one row per exchange, upserted each cron run)
create table if not exists exchange_fees (
  exchange_id   text primary key references exchanges(id),
  maker_fee     numeric(6,4) not null,
  taker_fee     numeric(6,4) not null,
  source        text check (source in ('api', 'fallback')) default 'fallback',
  fetched_at    timestamptz not null,
  error_msg     text,
  updated_at    timestamptz default now()
);

-- Historical fee log (one row per exchange per run — for trend tracking)
create table if not exists exchange_fee_history (
  id            uuid primary key default gen_random_uuid(),
  exchange_id   text references exchanges(id),
  maker_fee     numeric(6,4) not null,
  taker_fee     numeric(6,4) not null,
  source        text check (source in ('api', 'fallback')),
  fetched_at    timestamptz not null,
  created_at    timestamptz default now()
);

-- Cron run log (one row per cron execution)
create table if not exists cron_runs (
  id              uuid primary key default gen_random_uuid(),
  job_name        text not null,
  started_at      timestamptz not null,
  completed_at    timestamptz,
  success         boolean default false,
  updated_count   integer default 0,
  fallback_count  integer default 0,
  errors          text[] default '{}',
  created_at      timestamptz default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table exchange_fees         enable row level security;
alter table exchange_fee_history  enable row level security;
alter table cron_runs             enable row level security;

-- Public can read current fees (used by /api/fees endpoint)
create policy "Public read exchange_fees"
  on exchange_fees for select using (true);

-- Public can read fee history (for trend charts)
create policy "Public read fee_history"
  on exchange_fee_history for select using (true);

-- Only service role can write (cron job uses service role key)
create policy "Service write exchange_fees"
  on exchange_fees for all using (auth.role() = 'service_role');

create policy "Service write fee_history"
  on exchange_fee_history for all using (auth.role() = 'service_role');

create policy "Service write cron_runs"
  on cron_runs for all using (auth.role() = 'service_role');

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index on exchange_fee_history (exchange_id, fetched_at desc);
create index on cron_runs (job_name, started_at desc);

-- ── Trigger: auto-log every fee upsert into history ──────────────────────────
create or replace function log_fee_history()
returns trigger language plpgsql as $$
begin
  insert into exchange_fee_history (exchange_id, maker_fee, taker_fee, source, fetched_at)
  values (NEW.exchange_id, NEW.maker_fee, NEW.taker_fee, NEW.source, NEW.fetched_at);
  return NEW;
end;
$$;

create trigger fee_history_trigger
  after insert or update on exchange_fees
  for each row execute function log_fee_history();

-- ── Seed with current fees (run once to bootstrap) ───────────────────────────
insert into exchange_fees (exchange_id, maker_fee, taker_fee, source, fetched_at)
values
  ('binance',  0.1,  0.1,  'fallback', now()),
  ('coinbase', 0.4,  0.6,  'fallback', now()),
  ('kraken',   0.16, 0.26, 'fallback', now()),
  ('bybit',    0.1,  0.1,  'fallback', now()),
  ('okx',      0.08, 0.1,  'fallback', now())
on conflict (exchange_id) do nothing;
