-- ============================================================
-- cryptoffiliate.com — Supabase database schema
-- Run this in the Supabase SQL editor to create all tables
-- ============================================================

-- Exchanges table (synced from /src/data/exchanges.ts via a cron job)
create table if not exists exchanges (
  id            text primary key,
  slug          text unique not null,
  name          text not null,
  logo          text not null,
  logo_color    text not null,
  tagline       text,
  rating        numeric(3,1),
  reviews       integer,
  maker_fee     numeric(5,3),
  taker_fee     numeric(5,3),
  withdrawal_fee text,
  min_deposit   text,
  coins         integer,
  kyc           text check (kyc in ('required','optional','none')),
  fiat_on_ramp  boolean default true,
  futures       boolean default false,
  staking       boolean default false,
  us_based      boolean default false,
  affiliate_url text,
  bonus         text,
  commission    text,
  badge         text,
  badge_color   text,
  founded       integer,
  headquarters  text,
  promo_code    text,
  last_updated  date,
  created_at    timestamptz default now()
);

-- Reviews table
create table if not exists reviews (
  id              uuid primary key default gen_random_uuid(),
  exchange_id     text references exchanges(id) on delete cascade,
  slug            text unique not null,
  title           text not null,
  summary         text,
  pros            text[] default '{}',
  cons            text[] default '{}',
  verdict         text,
  rating          numeric(3,1),
  fee_rating      numeric(3,1),
  security_rating numeric(3,1),
  ui_rating       numeric(3,1),
  support_rating  numeric(3,1),
  author          text default 'Cryptoffiliate Team',
  published_at    timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Promo codes table (manually curated)
create table if not exists promo_codes (
  id            uuid primary key default gen_random_uuid(),
  exchange_id   text references exchanges(id) on delete cascade,
  code          text not null,
  description   text,
  bonus         text,
  expires_at    timestamptz,
  affiliate_url text,
  verified      boolean default false,
  last_checked  timestamptz default now(),
  created_at    timestamptz default now()
);

-- Affiliate click tracking
create table if not exists affiliate_clicks (
  id            uuid primary key default gen_random_uuid(),
  exchange_id   text references exchanges(id),
  placement     text, -- 'table' | 'review' | 'bonus' | 'calculator'
  referrer      text,
  user_agent    text,
  clicked_at    timestamptz default now()
);

-- Row-level security (public read, no public write)
alter table exchanges    enable row level security;
alter table reviews      enable row level security;
alter table promo_codes  enable row level security;

create policy "Public read exchanges"   on exchanges   for select using (true);
create policy "Public read reviews"     on reviews     for select using (true);
create policy "Public read promo_codes" on promo_codes for select using (true);

-- Service role only for writes (handled server-side)
create policy "Service write exchanges"   on exchanges   for all using (auth.role() = 'service_role');
create policy "Service write reviews"     on reviews     for all using (auth.role() = 'service_role');
create policy "Service write promo_codes" on promo_codes for all using (auth.role() = 'service_role');
create policy "Service write clicks"      on affiliate_clicks for insert using (true);

-- Useful indexes
create index on reviews (exchange_id);
create index on promo_codes (exchange_id);
create index on affiliate_clicks (exchange_id, clicked_at);
