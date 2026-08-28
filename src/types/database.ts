/**
 * View models used across components. Mirrors the `supabase/migrations/`.
 *
 * The generated `Database` type (`supabase gen types typescript`) can be added
 * later; the Supabase clients stay untyped until then.
 */

export interface StreamState {
  id: 1;
  is_live: boolean;
  updated_at: string;
}

export type DnbGenre =
  | "Liquid"
  | "Dancefloor"
  | "Neurofunk"
  | "Jungle"
  | "Breakbeat";

export interface StreamSlot {
  id: string;
  starts_at: string;
  ends_at: string | null;
  title: string;
  genre: DnbGenre | null;
  created_at: string;
}

export type RequestStatus = "pending" | "playing" | "played";

export interface TrackRequest {
  id: string;
  user_id: string;
  requester_name: string;
  title: string;
  artist: string;
  status: RequestStatus;
  created_at: string;
}

export interface Upvote {
  track_id: string;
  user_id: string;
  created_at: string;
}

/**
 * A request plus its vote tally and whether the current viewer has voted —
 * assembled client-side from `track_requests` + `upvotes` (no denormalized
 * count column; the audience is small enough to tally in the client).
 */
export interface TrackRequestView extends TrackRequest {
  vote_count: number;
  has_voted: boolean;
}
