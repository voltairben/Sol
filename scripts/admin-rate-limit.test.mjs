// Pure-logic checks for the /admin passcode brute-force limiter.
// The DB I/O lives in admin/actions.ts; this exercises the decision core.
//   node --test scripts/admin-rate-limit.test.mjs   (or: npm test)
import test from "node:test";
import assert from "node:assert/strict";
import {
  decideRateLimit,
  MAX_FAILS,
  BLOCK_MS,
  WINDOW_MS,
} from "../src/lib/admin-rate-limit.ts";

const NOW = 1_800_000_000_000;
const iso = (ms) => new Date(ms).toISOString();
const row = (over = {}) => ({
  ip_address: "1.2.3.4",
  attempts: 1,
  last_attempt_at: iso(NOW),
  blocked_until: null,
  ...over,
});

test("check with no row → allowed, nothing to persist", () => {
  const d = decideRateLimit(null, "check", NOW);
  assert.equal(d.retryAfterSec, null);
  assert.equal(d.persist.kind, "none");
});

test("first failure records attempts=1", () => {
  const d = decideRateLimit(null, "fail", NOW);
  assert.equal(d.retryAfterSec, null);
  assert.deepEqual(d.persist, { kind: "set", attempts: 1, blocked_until: null });
});

test("the MAX_FAILS-th failure locks the IP for BLOCK_MS", () => {
  const d = decideRateLimit(row({ attempts: MAX_FAILS - 1 }), "fail", NOW);
  assert.equal(d.retryAfterSec, Math.ceil(BLOCK_MS / 1000));
  assert.equal(d.persist.kind, "set");
  assert.equal(d.persist.attempts, MAX_FAILS);
  assert.equal(Date.parse(d.persist.blocked_until), NOW + BLOCK_MS);
});

test("check while blocked → denied, retry-after shrinks, no write", () => {
  const blocked = row({ attempts: MAX_FAILS, blocked_until: iso(NOW + BLOCK_MS) });
  const d = decideRateLimit(blocked, "check", NOW + 60_000);
  assert.equal(d.retryAfterSec, Math.ceil((BLOCK_MS - 60_000) / 1000));
  assert.equal(d.persist.kind, "none");
});

test("a failed try while blocked doesn't extend the block", () => {
  const blocked = row({ attempts: MAX_FAILS, blocked_until: iso(NOW + BLOCK_MS) });
  const d = decideRateLimit(blocked, "fail", NOW + 60_000);
  assert.equal(d.retryAfterSec, Math.ceil((BLOCK_MS - 60_000) / 1000));
  assert.equal(d.persist.kind, "none");
});

test("check after the block expired → allowed, row is cleaned up", () => {
  const expired = row({ attempts: MAX_FAILS, blocked_until: iso(NOW - 1000) });
  const d = decideRateLimit(expired, "check", NOW);
  assert.equal(d.retryAfterSec, null);
  assert.equal(d.persist.kind, "delete");
});

test("a stale counter doesn't carry forward", () => {
  const stale = row({ attempts: 4, last_attempt_at: iso(NOW - WINDOW_MS - 1000) });
  const d = decideRateLimit(stale, "fail", NOW);
  assert.equal(d.retryAfterSec, null);
  assert.deepEqual(d.persist, { kind: "set", attempts: 1, blocked_until: null });
});

test("success clears the row (and no-ops when there's nothing)", () => {
  assert.deepEqual(decideRateLimit(row({ attempts: 3 }), "ok", NOW).persist, {
    kind: "delete",
  });
  assert.deepEqual(decideRateLimit(null, "ok", NOW).persist, { kind: "none" });
});
