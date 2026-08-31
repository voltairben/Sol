/**
 * In-memory brute-force limiter for the /admin passcode.
 *
 * ponytail: per-instance Map. Vercel Fluid Compute reuses instances so it
 * holds against a single-source brute force; an attacker spread across many
 * IPs or cold instances gets more tries. Move the counter into Supabase if
 * the logs ever show that. Clients with no forwarded IP share one `unknown`
 * bucket (fail-closed — they lock each other out, which is fine here).
 */

const WINDOW_MS = 15 * 60_000;
const MAX_FAILS = 5;
const MAX_BUCKETS = 2000;

interface Bucket {
  fails: number;
  firstAt: number;
  blockedUntil: number;
}

const store = new Map<string, Bucket>();

function prune(now: number): void {
  if (store.size < MAX_BUCKETS) return;
  for (const [k, b] of store) {
    if (b.blockedUntil <= now && now - b.firstAt > WINDOW_MS) store.delete(k);
  }
}

/**
 * `check` — before verifying the passcode. `fail` — after a wrong one.
 * `ok` — after a correct one (clears the bucket).
 * Returns seconds until the client may retry, or null when the attempt is
 * allowed. The synchronous body runs to completion between awaits, so
 * concurrent calls can't race past MAX_FAILS.
 */
export function loginRateLimit(
  key: string,
  phase: "check" | "fail" | "ok",
  now: number = Date.now(),
): number | null {
  if (phase === "ok") {
    store.delete(key);
    return null;
  }

  const b = store.get(key);
  if (b && b.blockedUntil > now) {
    return Math.ceil((b.blockedUntil - now) / 1000);
  }

  if (phase === "fail") {
    prune(now);
    if (!b || now - b.firstAt > WINDOW_MS) {
      store.set(key, { fails: 1, firstAt: now, blockedUntil: 0 });
    } else {
      b.fails += 1;
      if (b.fails >= MAX_FAILS) {
        b.blockedUntil = now + WINDOW_MS;
        return Math.ceil(WINDOW_MS / 1000);
      }
    }
  }
  return null;
}

/** Test hook — wipes every bucket. Not referenced by app code. */
export function __resetLoginRateLimit(): void {
  store.clear();
}
