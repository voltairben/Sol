-- Policy hygiene. Ad-hoc dashboard SQL had left a second, redundant set of
-- RLS policies on track_requests / upvotes alongside the canonical 0001 set:
--   * duplicate "public read" SELECT policies
--   * duplicate INSERT policies using the deprecated auth.role() form and an
--     un-wrapped auth.uid() (re-evaluated per row)
--   * an unintended user-facing DELETE policy on track_requests (0001 has none —
--     only the service-role admin action clears the queue)
-- None were a security hole (every write still scoped to auth.uid() = user_id),
-- but they tripped the performance linter. Drop the extras; keep 0001's.

drop policy if exists "Allow public read access to track_requests" on public.track_requests;
drop policy if exists "Allow authenticated users to insert requests" on public.track_requests;
drop policy if exists "Allow users to delete their own requests" on public.track_requests;

drop policy if exists "Allow public read access to upvotes" on public.upvotes;
drop policy if exists "Allow authenticated users to insert upvotes" on public.upvotes;
drop policy if exists "Allow authenticated users to delete their upvotes" on public.upvotes;

-- Covering indexes for the user_id foreign keys — RLS predicates and the
-- ON DELETE CASCADE from auth.users both scan these.
create index if not exists track_requests_user_id_idx on public.track_requests (user_id);
create index if not exists upvotes_user_id_idx on public.upvotes (user_id);

-- The board fetches unordered and sorts client-side; nothing queries by
-- created_at, so the 0001 index on it is dead weight.
drop index if exists public.track_requests_created_idx;
