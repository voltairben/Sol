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
  /** OBS encoder telemetry — pushed via POST /api/stream/status, 0 when off air. */
  bitrate: number;
  fps: number;
  dropped_frames: number;
}

/** A row Sol manages himself from /admin. Free-text date + location. */
export interface ScheduleEvent {
  id: string;
  title: string;
  date_string: string;
  location: string;
  details: string | null;
  is_active: boolean;
  is_live: boolean;
  sort_order: number;
  created_at: string;
}

export type RequestStatus = "pending" | "playing" | "played";

export interface TrackRequest {
  id: string;
  user_id: string;
  requester_name: string;
  avatar_url: string | null;
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
