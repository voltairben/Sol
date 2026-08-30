-- Live OBS encoder telemetry, pushed to POST /api/stream/status alongside
-- is_live and shown in the console signal monitor. All three reset to 0
-- whenever the broadcast flips off. stream_state is already in the
-- supabase_realtime publication (0001) — new columns ride the existing
-- UPDATE events, and the public SELECT policy already covers every column.

alter table public.stream_state
  add column if not exists bitrate        integer not null default 0,
  add column if not exists fps            integer not null default 0,
  add column if not exists dropped_frames integer not null default 0;
