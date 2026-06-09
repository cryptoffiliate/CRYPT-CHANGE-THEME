-- ============================================================
-- Email subscriber tables — add to Supabase SQL editor
-- ============================================================

create table if not exists email_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  first_name      text,
  preferences     text[] default '{all}',
  subscribed_at   timestamptz default now(),
  unsubscribed_at timestamptz,
  ip_hash         text,
  source          text default 'website'  -- 'website' | 'quiz' | 'bonuses_page'
);

-- RLS
alter table email_subscribers enable row level security;

-- Only service role can read/write (email addresses are PII)
create policy "Service role only on email_subscribers"
  on email_subscribers for all
  using (auth.role() = 'service_role');

-- Indexes
create index on email_subscribers (email);
create index on email_subscribers (subscribed_at desc);
create index on email_subscribers (unsubscribed_at)
  where unsubscribed_at is not null;

-- View: active subscribers (for internal dashboards)
create or replace view active_subscribers as
  select
    id, email, first_name, preferences, subscribed_at, source
  from email_subscribers
  where unsubscribed_at is null;
