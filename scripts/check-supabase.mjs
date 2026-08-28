/**
 * Validates the local Supabase wiring end to end.
 *
 *   node --env-file=.env.local scripts/check-supabase.mjs
 *   (or)  npm run db:check
 *
 * Checks: env vars present · anon key is a JWT · anon can read the three tables ·
 * seed row exists · service role can write stream_state · anon canNOT (RLS) ·
 * realtime subscribes AND actually delivers an event.
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

let failed = 0;
const pass = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const fail = (m) => {
  console.log(`  \x1b[31m✗\x1b[0m ${m}`);
  failed++;
};

const check = (cond, good, bad) => (cond ? pass(good) : fail(bad));

console.log("\nenv:");
check(URL, `NEXT_PUBLIC_SUPABASE_URL = ${URL}`, "NEXT_PUBLIC_SUPABASE_URL missing");
check(ANON, "NEXT_PUBLIC_SUPABASE_ANON_KEY set", "NEXT_PUBLIC_SUPABASE_ANON_KEY missing");
check(
  !ANON || ANON.startsWith("eyJ"),
  "anon key is a JWT (required for Realtime postgres_changes)",
  "anon key is NOT a JWT — Realtime events will be dropped. Use the legacy anon key.",
);

if (failed) {
  console.log("\nfill in .env.local and re-run.\n");
  process.exit(1);
}
if (!SERVICE) {
  console.log("  \x1b[33m•\x1b[0m SUPABASE_SERVICE_ROLE_KEY not set — skipping the service-role write check");
}

const anon = createClient(URL, ANON, { auth: { persistSession: false } });
const svc = SERVICE ? createClient(URL, SERVICE, { auth: { persistSession: false } }) : null;

console.log("\nanon reads:");
for (const t of ["stream_state", "track_requests", "upvotes"]) {
  const { error } = await anon.from(t).select("*").limit(1);
  check(!error, `${t}: readable`, `${t}: ${error?.message}`);
}

console.log("\nseed row:");
{
  const { data, error } = await anon
    .from("stream_state")
    .select("*")
    .eq("id", 1)
    .single();
  check(
    !error,
    `stream_state id=1 present (is_live=${data?.is_live})`,
    `${error?.message}`,
  );
}

if (svc) {
  console.log("\nservice-role write:");
  const { data: before } = await svc
    .from("stream_state")
    .select("is_live")
    .eq("id", 1)
    .single();
  const { error } = await svc
    .from("stream_state")
    .update({ is_live: !before.is_live, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) {
    fail(`service role blocked: ${error.message}`);
  } else {
    pass("service role can update stream_state");
    await svc
      .from("stream_state")
      .update({ is_live: before.is_live, updated_at: new Date().toISOString() })
      .eq("id", 1);
  }
}

console.log("\nanon write is blocked by RLS:");
{
  // With no UPDATE policy, PostgREST returns success + 0 rows (no error),
  // so verify by reading the value back.
  const { data: before } = await anon
    .from("stream_state")
    .select("is_live")
    .eq("id", 1)
    .single();
  await anon
    .from("stream_state")
    .update({ is_live: !before.is_live })
    .eq("id", 1);
  const { data: after } = await anon
    .from("stream_state")
    .select("is_live")
    .eq("id", 1)
    .single();
  check(
    after.is_live === before.is_live,
    "anon cannot change stream_state",
    "anon CHANGED stream_state — RLS hole!",
  );
}

console.log("\nrealtime:");
await new Promise((resolve) => {
  let got = false;
  const done = () => {
    if (!got && svc) fail("realtime: no event received within 12s (JWT key?)");
    anon.removeChannel(ch);
    resolve();
  };
  const timer = setTimeout(done, 12_000);

  const ch = anon
    .channel("db-check")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "stream_state" },
      (payload) => {
        got = true;
        pass(`event received: ${payload.eventType} stream_state`);
        clearTimeout(timer);
        done();
      },
    )
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        pass("subscribed to stream_state changes");
        if (svc) {
          // trigger a harmless change and expect the echo above
          await svc
            .from("stream_state")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", 1);
        } else {
          console.log("  \x1b[33m•\x1b[0m no service key — can't trigger a change to verify delivery");
          clearTimeout(timer);
          done();
        }
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        fail(`realtime: ${status}`);
        clearTimeout(timer);
        done();
      }
    });
});

console.log(
  failed ? `\n\x1b[31m${failed} check(s) failed\x1b[0m\n` : "\n\x1b[32mall checks passed\x1b[0m\n",
);
process.exit(failed ? 1 : 0);
