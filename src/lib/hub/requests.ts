import type {
  TrackRequest,
  TrackRequestView,
  Upvote,
} from "@/types/database";

type UpvoteKey = Pick<Upvote, "track_id" | "user_id">;

/**
 * Merge the two raw tables into sorted view models.
 * `currentUserId` is null for logged-out viewers → `has_voted` is always false.
 */
export function buildViews(
  requests: TrackRequest[],
  upvotes: UpvoteKey[],
  currentUserId: string | null,
): TrackRequestView[] {
  const counts = new Map<string, number>();
  const mine = new Set<string>();
  for (const u of upvotes) {
    counts.set(u.track_id, (counts.get(u.track_id) ?? 0) + 1);
    if (currentUserId && u.user_id === currentUserId) mine.add(u.track_id);
  }
  return requests
    .map((r) => ({
      ...r,
      vote_count: counts.get(r.id) ?? 0,
      has_voted: mine.has(r.id),
    }))
    .sort(compareRequests);
}

/** Highest votes first; ties broken by oldest request first (rewards early asks). */
export function compareRequests(
  a: TrackRequestView,
  b: TrackRequestView,
): number {
  if (a.vote_count !== b.vote_count) return b.vote_count - a.vote_count;
  return a.created_at.localeCompare(b.created_at);
}

/** Shape of a Supabase `postgres_changes` payload, narrowed to what we use. */
export type ChangeEvent<T> =
  | { eventType: "INSERT"; new: T; old: Record<string, never> }
  | { eventType: "UPDATE"; new: T; old: Partial<T> }
  | { eventType: "DELETE"; new: Record<string, never>; old: Partial<T> };

/** Apply one `track_requests` change to the row map. Returns a new map. */
export function applyRequestEvent(
  rows: Map<string, TrackRequestView>,
  ev: ChangeEvent<TrackRequest>,
): Map<string, TrackRequestView> {
  const next = new Map(rows);
  if (ev.eventType === "DELETE") {
    if (ev.old.id) next.delete(ev.old.id);
    return next;
  }
  const r = ev.new;
  const existing = next.get(r.id);
  next.set(r.id, {
    ...r,
    vote_count: existing?.vote_count ?? 0,
    has_voted: existing?.has_voted ?? false,
  });
  return next;
}

/**
 * Apply one `upvotes` change to the row map.
 * A viewer's own vote is applied optimistically before the echo arrives, so
 * the matching echo is a no-op (idempotent on `has_voted`).
 */
export function applyUpvoteEvent(
  rows: Map<string, TrackRequestView>,
  ev: ChangeEvent<Upvote>,
  currentUserId: string | null,
): Map<string, TrackRequestView> {
  const rec = ev.eventType === "INSERT" ? ev.new : ev.old;
  const trackId = rec.track_id;
  if (!trackId) return rows;
  const current = rows.get(trackId);
  if (!current) return rows;

  const isMine = currentUserId != null && rec.user_id === currentUserId;
  const next = new Map(rows);

  if (ev.eventType === "INSERT") {
    if (isMine && current.has_voted) return rows; // already counted optimistically
    next.set(trackId, {
      ...current,
      vote_count: current.vote_count + 1,
      has_voted: current.has_voted || isMine,
    });
  } else {
    if (isMine && !current.has_voted) return rows; // already removed optimistically
    next.set(trackId, {
      ...current,
      vote_count: Math.max(0, current.vote_count - 1),
      has_voted: isMine ? false : current.has_voted,
    });
  }
  return next;
}
