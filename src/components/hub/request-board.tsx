import { createClient } from "@/lib/supabase/server";
import { buildViews } from "@/lib/hub/requests";
import { RequestBoardClient } from "./request-board-client";

/**
 * Server shell: the initial (SSR) snapshot of the queue. The client island
 * takes over for realtime updates and optimistic voting.
 */
export async function RequestBoard() {
  const supabase = await createClient();

  const [requestsRes, upvotesRes, userRes] = await Promise.all([
    supabase.from("track_requests").select("*"),
    supabase.from("upvotes").select("track_id, user_id"),
    supabase.auth.getUser(),
  ]);

  const userId = userRes.data.user?.id ?? null;
  const initial = buildViews(
    requestsRes.data ?? [],
    upvotesRes.data ?? [],
    userId,
  );

  return (
    <RequestBoardClient initialRequests={initial} initialUserId={userId} />
  );
}
