/**
 * View models used across components.
 *
 * The generated `Database` type (from `supabase gen types typescript`) is added
 * in Phase 3 once the Supabase project exists; the Supabase clients stay
 * untyped until then.
 */

export interface StreamState {
  id: 1;
  is_live: boolean;
  updated_at: string;
}

export type RequestStatus = "queued" | "played" | "rejected";

export interface TrackRequest {
  id: string;
  created_at: string;
  artist: string;
  title: string;
  note: string | null;
  requested_by: string;
  requested_by_name: string;
  status: RequestStatus;
  vote_count: number;
}

/** A request row plus the current viewer's vote state, assembled client-side. */
export interface TrackRequestView extends TrackRequest {
  has_voted: boolean;
}

export interface RequestVote {
  request_id: string;
  user_id: string;
  created_at: string;
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
}
