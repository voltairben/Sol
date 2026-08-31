/**
 * Decision logic for the /admin passcode brute-force limiter. Pure — no I/O,
 * no Next/Supabase imports — so it stays unit-testable. The DB round-trips
 * (Supabase `admin_login_attempts`, service-role) live in admin/actions.ts.
 *
 * Serverless-safe: the state is a Postgres row per client IP, shared across
 * every Vercel function instance. The old version was an in-memory Map that
 * ephemeral instances couldn't share.
 */

export const MAX_FAILS = 5;
export const BLOCK_MS = 15 * 60_000;
/** Failures older than this don't count toward the limit. */
export const WINDOW_MS = 15 * 60_000;

export interface AttemptRow {
  ip_address: string;
  attempts: number;
  last_attempt_at: string;
  blocked_until: string | null;
}

export type Persist =
  | { kind: "none" }
  | { kind: "delete" }
  | { kind: "set"; attempts: number; blocked_until: string | null };

export interface RateDecision {
  /** null when the attempt is allowed; otherwise seconds until retry. */
  retryAfterSec: number | null;
  persist: Persist;
}

/**
 * `check` runs before the passcode compare, `fail` / `ok` after it.
 * `row` is the current DB row for this IP, or null.
 */
export function decideRateLimit(
  row: AttemptRow | null,
  phase: "check" | "fail" | "ok",
  now: number,
): RateDecision {
  const blockedUntil = row?.blocked_until ? Date.parse(row.blocked_until) : 0;
  const fresh = row
    ? Date.parse(row.last_attempt_at) >= now - WINDOW_MS
    : false;

  if (phase === "ok") {
    return {
      retryAfterSec: null,
      persist: row ? { kind: "delete" } : { kind: "none" },
    };
  }

  if (blockedUntil > now) {
    return {
      retryAfterSec: Math.ceil((blockedUntil - now) / 1000),
      persist: { kind: "none" },
    };
  }

  if (phase === "check") {
    // an expired block or a stale counter → tidy the row away, else leave it
    const dirty = Boolean(row) && (blockedUntil > 0 || !fresh);
    return {
      retryAfterSec: null,
      persist: dirty ? { kind: "delete" } : { kind: "none" },
    };
  }

  // phase === "fail"
  const attempts = (fresh ? row!.attempts : 0) + 1;
  if (attempts >= MAX_FAILS) {
    return {
      retryAfterSec: Math.ceil(BLOCK_MS / 1000),
      persist: {
        kind: "set",
        attempts,
        blocked_until: new Date(now + BLOCK_MS).toISOString(),
      },
    };
  }
  return {
    retryAfterSec: null,
    persist: { kind: "set", attempts, blocked_until: null },
  };
}
