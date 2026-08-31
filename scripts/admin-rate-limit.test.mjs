// Pure-logic checks for the /admin passcode brute-force limiter.
//   node --test scripts/admin-rate-limit.test.mjs   (or: npm test)
import test from "node:test";
import assert from "node:assert/strict";
import {
  loginRateLimit,
  __resetLoginRateLimit,
} from "../src/lib/admin-rate-limit.ts";

const WINDOW_S = 15 * 60;

test("attempts under the limit are allowed", () => {
  __resetLoginRateLimit();
  const t = 1_000_000;
  for (let i = 0; i < 4; i++) {
    assert.equal(loginRateLimit("1.1.1.1", "check", t), null);
    assert.equal(loginRateLimit("1.1.1.1", "fail", t), null);
  }
  assert.equal(loginRateLimit("1.1.1.1", "check", t), null);
});

test("5th failure locks the client for the window", () => {
  __resetLoginRateLimit();
  const t = 2_000_000;
  let tripped = null;
  for (let i = 0; i < 5; i++) tripped = loginRateLimit("2.2.2.2", "fail", t);
  assert.equal(tripped, WINDOW_S);

  // still locked a minute later, retry-after shrinks
  assert.equal(loginRateLimit("2.2.2.2", "check", t + 60_000), WINDOW_S - 60);
  // a further failed try while locked doesn't extend it
  assert.equal(loginRateLimit("2.2.2.2", "fail", t + 60_000), WINDOW_S - 60);
});

test("counter resets once the window passes", () => {
  __resetLoginRateLimit();
  const t = 3_000_000;
  for (let i = 0; i < 4; i++) loginRateLimit("3.3.3.3", "fail", t);
  const later = t + 16 * 60_000;
  assert.equal(loginRateLimit("3.3.3.3", "fail", later), null);
  assert.equal(loginRateLimit("3.3.3.3", "check", later), null);
});

test("a correct passcode clears the bucket", () => {
  __resetLoginRateLimit();
  const t = 4_000_000;
  for (let i = 0; i < 4; i++) loginRateLimit("4.4.4.4", "fail", t);
  loginRateLimit("4.4.4.4", "ok", t);
  for (let i = 0; i < 4; i++) {
    assert.equal(loginRateLimit("4.4.4.4", "fail", t), null);
  }
});

test("buckets are isolated per client key", () => {
  __resetLoginRateLimit();
  const t = 5_000_000;
  for (let i = 0; i < 5; i++) loginRateLimit("a", "fail", t);
  assert.equal(loginRateLimit("a", "check", t), WINDOW_S);
  assert.equal(loginRateLimit("b", "check", t), null);
});
