-- Project Sol — production finalisation.
--
-- schedule.is_live      : Sol flags the currently-running broadcast from /admin;
--                         /schedule pulses that row's accent bar.
-- track_requests.avatar : denormalised OAuth avatar (like requester_name), so
--                         the queue can show the requester's Twitch/Discord pic.

alter table public.schedule
  add column if not exists is_live boolean not null default false;

alter table public.track_requests
  add column if not exists avatar_url text
  check (avatar_url is null or char_length(avatar_url) <= 500);
