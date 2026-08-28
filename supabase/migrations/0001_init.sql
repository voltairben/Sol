-- Project Sol — initial schema
--   stream_state   : single-row live flag, service-role writes only
--   track_requests : viewer-submitted tracks, one row per authed user
--   upvotes        : composite PK blocks double-voting
-- Realtime replication is enabled on all three.
--
-- gen_random_uuid() is built into Postgres 13+, so no uuid-ossp extension.

-- ─────────────────────────────────────────────────────────────────
-- 1. stream_state — id is always 1
-- ─────────────────────────────────────────────────────────────────
create table public.stream_state (
  id         integer primary key default 1,
  is_live    boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint stream_state_single_row check (id = 1)
);

insert into public.stream_state (id) values (1) on conflict (id) do nothing;

alter table public.stream_state enable row level security;

-- Public read only. There is deliberately NO write policy: the stream flag is
-- changed exclusively by the service-role key (from /api/stream/status and the
-- admin server actions), and the service role bypasses RLS.
create policy "stream_state: public read"
  on public.stream_state for select
  to anon, authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────────
-- 2. track_requests
-- ─────────────────────────────────────────────────────────────────
create table public.track_requests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  requester_name text not null default '',      -- OAuth display name, copied at submit time
  title          text not null check (char_length(title) between 1 and 200),
  artist         text not null check (char_length(artist) between 1 and 200),
  status         text not null default 'pending'
                   check (status in ('pending', 'playing', 'played')),
  created_at     timestamptz not null default now()
);

create index track_requests_created_idx on public.track_requests (created_at desc);

alter table public.track_requests enable row level security;

create policy "track_requests: public read"
  on public.track_requests for select
  to anon, authenticated
  using (true);

-- Authenticated users may submit, but only as themselves (blocks spoofing
-- another user_id — TO authenticated alone would not).
create policy "track_requests: insert as self"
  on public.track_requests for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- ─────────────────────────────────────────────────────────────────
-- 3. upvotes
-- ─────────────────────────────────────────────────────────────────
create table public.upvotes (
  track_id   uuid not null references public.track_requests(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (track_id, user_id)
);

alter table public.upvotes enable row level security;

create policy "upvotes: public read"
  on public.upvotes for select
  to anon, authenticated
  using (true);

create policy "upvotes: insert as self"
  on public.upvotes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "upvotes: delete own"
  on public.upvotes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ─────────────────────────────────────────────────────────────────
-- 4. Realtime replication
-- ─────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.stream_state;
alter publication supabase_realtime add table public.track_requests;
alter publication supabase_realtime add table public.upvotes;
