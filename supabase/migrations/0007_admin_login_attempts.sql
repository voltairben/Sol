-- Serverless-safe brute-force limiter for the /admin passcode. One row per
-- client IP, written only by verifyAdminPasscode via the service-role client.
-- Replaces a per-instance in-memory Map that Vercel's ephemeral function
-- instances couldn't share.
--
-- The table was first created out-of-band with a policy targeting role
-- "public" (USING true) + full anon/authenticated grants — which let any
-- browser client wipe the limiter. service_role bypasses RLS and needs
-- neither, so this drops both: RLS on, zero policies, no anon/auth grants —
-- the same shape as public.schedule / stream_state writes.

create table if not exists public.admin_login_attempts (
  ip_address      text primary key,
  attempts        integer not null default 1,
  last_attempt_at timestamptz not null default timezone('utc', now()),
  blocked_until   timestamptz
);

alter table public.admin_login_attempts enable row level security;

drop policy if exists "Allow service role all on rate limits" on public.admin_login_attempts;
revoke all on public.admin_login_attempts from anon, authenticated;
