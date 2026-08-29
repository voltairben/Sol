-- Project Sol — self-service agenda.
--
-- Replaces the timestamp-based `stream_schedule` with a free-text model so Sol
-- can write entries like "TUESDAYS @ 19:00 CET" from the /admin console without
-- a datepicker or a code change.
--
-- Security: public SELECT only. There is deliberately NO insert/update/delete
-- policy — the anon / authenticated keys cannot write. All mutations go through
-- the passcode-gated /admin server actions, which use the service-role client
-- (`createAdminClient()`) after re-checking the iron-session cookie.

drop table if exists public.stream_schedule cascade;

create table public.schedule (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 200),
  date_string text not null check (char_length(date_string) between 1 and 120),
  location    text not null check (char_length(location) between 1 and 120),
  details     text check (char_length(details) <= 600),
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.schedule enable row level security;

-- Read-only at the privilege layer for the public roles; the service-role
-- client keeps full access. (Belt-and-suspenders with the RLS policy below —
-- this project's default privileges grant ALL on new public tables.)
revoke all on public.schedule from anon, authenticated;
grant select on public.schedule to anon, authenticated;
grant all on public.schedule to service_role;

create policy "schedule: public read"
  on public.schedule for select
  to anon, authenticated
  using (true);
-- deliberately no insert/update/delete policy.

insert into public.schedule (title, date_string, location, details, sort_order) values
  ('Tuesday Vinyl Session', 'TUESDAYS @ 19:00 CET', 'KICK / TWITCH LIVE',
   'The weekly home-base set — warm vinyl, deep rollers, requests open.', 0),
  ('Weekend Wildcard', 'WEEKENDS — ANNOUNCED ON DISCORD', 'KICK / TWITCH LIVE',
   'Looser weekend broadcasts. Follow Instagram or the Discord for the go-live ping.', 1);
