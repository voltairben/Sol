// Pure-logic checks for the request board merge/sort. No framework.
//   node --test scripts/hub.test.mjs   (or: npm test)
import test from "node:test";
import assert from "node:assert/strict";
import {
  buildViews,
  compareRequests,
  applyUpvoteEvent,
  applyRequestEvent,
} from "../src/lib/hub/requests.ts";

const req = (id, created_at, over = {}) => ({
  id,
  user_id: "u",
  requester_name: "x",
  title: "t",
  artist: "a",
  status: "pending",
  created_at,
  ...over,
});
const view = (id, vote_count, created_at, over = {}) => ({
  ...req(id, created_at),
  vote_count,
  has_voted: false,
  ...over,
});

test("buildViews tallies votes and flags the viewer's own", () => {
  const views = buildViews(
    [req("a", "2026-01-01"), req("b", "2026-01-02")],
    [
      { track_id: "a", user_id: "me" },
      { track_id: "a", user_id: "other" },
      { track_id: "b", user_id: "other" },
    ],
    "me",
  );
  assert.equal(views[0].id, "a");
  assert.equal(views[0].vote_count, 2);
  assert.equal(views[0].has_voted, true);
  assert.equal(views[1].vote_count, 1);
  assert.equal(views[1].has_voted, false);
});

test("compareRequests: votes desc, ties broken by oldest first", () => {
  const sorted = [
    view("x", 1, "2026-01-03"),
    view("y", 3, "2026-01-02"),
    view("z", 3, "2026-01-01"),
  ].sort(compareRequests);
  assert.deepEqual(
    sorted.map((r) => r.id),
    ["z", "y", "x"],
  );
});

test("applyUpvoteEvent: another user's insert increments the count", () => {
  const start = new Map([["a", view("a", 0, "2026-01-01")]]);
  const after = applyUpvoteEvent(
    start,
    { eventType: "INSERT", new: { track_id: "a", user_id: "other", created_at: "" }, old: {} },
    "me",
  );
  assert.equal(after.get("a").vote_count, 1);
  assert.equal(after.get("a").has_voted, false);
});

test("applyUpvoteEvent: my own echo after an optimistic vote is a no-op", () => {
  const start = new Map([["a", view("a", 1, "2026-01-01", { has_voted: true })]]);
  const after = applyUpvoteEvent(
    start,
    { eventType: "INSERT", new: { track_id: "a", user_id: "me", created_at: "" }, old: {} },
    "me",
  );
  assert.equal(after, start); // same reference — skipped
});

test("applyUpvoteEvent: delete never drops below zero", () => {
  const start = new Map([["a", view("a", 0, "2026-01-01")]]);
  const after = applyUpvoteEvent(
    start,
    { eventType: "DELETE", new: {}, old: { track_id: "a", user_id: "other" } },
    "me",
  );
  assert.equal(after.get("a").vote_count, 0);
});

test("applyRequestEvent: update keeps existing votes, delete removes the row", () => {
  const start = new Map([["a", view("a", 5, "2026-01-01", { has_voted: true })]]);
  const upd = applyRequestEvent(start, {
    eventType: "UPDATE",
    new: req("a", "2026-01-01", { status: "playing" }),
    old: {},
  });
  assert.equal(upd.get("a").status, "playing");
  assert.equal(upd.get("a").vote_count, 5);
  assert.equal(upd.get("a").has_voted, true);

  const del = applyRequestEvent(start, { eventType: "DELETE", new: {}, old: { id: "a" } });
  assert.equal(del.has("a"), false);
});
