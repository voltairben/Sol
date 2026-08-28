-- Project Sol — stream_schedule (upcoming sets). Plain public-read table,
-- not realtime (it changes rarely; the LIVE overlay uses stream_state).

create table public.stream_schedule (
  id         uuid primary key default gen_random_uuid(),
  starts_at  timestamptz not null,
  ends_at    timestamptz,
  title      text not null check (char_length(title) between 1 and 120),
  genre      text check (genre in ('Liquid','Dancefloor','Neurofunk','Jungle','Breakbeat')),
  created_at timestamptz not null default now()
);

create index stream_schedule_starts_idx on public.stream_schedule (starts_at);

alter table public.stream_schedule enable row level security;

create policy "stream_schedule: public read"
  on public.stream_schedule for select
  to anon, authenticated
  using (true);
-- writes: service-role only (no schedule admin UI in v1)

-- Seed rows, relative to apply time — replace with real dates in the SQL editor.
insert into public.stream_schedule (starts_at, ends_at, title, genre) values
  (now() + interval '1 day'  + interval '5 hours', now() + interval '1 day'  + interval '7 hours', 'Neurofunk Pressure', 'Neurofunk'),
  (now() + interval '3 days' + interval '6 hours', now() + interval '3 days' + interval '9 hours', 'Liquid Rollers',     'Liquid'),
  (now() + interval '5 days' + interval '4 hours', now() + interval '5 days' + interval '6 hours', 'Jungle Throwback',   'Jungle'),
  (now() + interval '8 days' + interval '5 hours', now() + interval '8 days' + interval '8 hours', 'Dancefloor Assault', 'Dancefloor'),
  (now() + interval '12 days'+ interval '5 hours', now() + interval '12 days'+ interval '7 hours', 'Breakbeat Special',  'Breakbeat');
