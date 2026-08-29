"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/components/auth/auth-provider";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import {
  applyRequestEvent,
  applyUpvoteEvent,
  compareRequests,
  type ChangeEvent,
} from "@/lib/hub/requests";
import type { TrackRequest, TrackRequestView, Upvote } from "@/types/database";
import { GateDialog } from "@/components/auth/gate-dialog";
import { RequestRow } from "./request-row";
import { RequestForm } from "./request-form";
import { BoardEmpty } from "./request-board-states";
import { toggleUpvote } from "./actions";

type RowMap = Map<string, TrackRequestView>;
type ConnStatus = "connecting" | "live" | "offline";

export function RequestBoardClient({
  initialRequests,
  initialUserId,
}: {
  initialRequests: TrackRequestView[];
  initialUserId: string | null;
}) {
  const { userId: sessionUserId } = useSession();
  const userId = sessionUserId ?? initialUserId;

  const [rows, setRows] = useState<RowMap>(
    () => new Map(initialRequests.map((r) => [r.id, r])),
  );
  const [status, setStatus] = useState<ConnStatus>("connecting");
  const [gateOpen, setGateOpen] = useState(false);

  // in-flight optimistic vote deltas, keyed by trackId
  const [pending, setPending] = useState<Map<string, 1 | -1>>(new Map());

  // ── realtime read path ──────────────────────────────────────────
  // Re-subscribes on auth change so `applyUpvoteEvent` sees the right user id.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("hub:track-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "track_requests" },
        (payload) =>
          setRows((prev) =>
            applyRequestEvent(
              prev,
              payload as unknown as ChangeEvent<TrackRequest>,
            ),
          ),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "upvotes" },
        (payload) =>
          setRows((prev) =>
            applyUpvoteEvent(
              prev,
              payload as unknown as ChangeEvent<Upvote>,
              userId,
            ),
          ),
      )
      .subscribe((s) => {
        if (s === "SUBSCRIBED") setStatus("live");
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") setStatus("offline");
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  // ── sorted view, optimistic deltas layered on ──────────────────
  // A delta already reflected in `rows` (echo landed) is ignored, so it can
  // linger in `pending` harmlessly until the upvote handler clears it.
  const view = useMemo(() => {
    const list = [...rows.values()].map((r) => {
      const delta = pending.get(r.id);
      if (!delta || r.has_voted === delta > 0) return r;
      return {
        ...r,
        vote_count: Math.max(0, r.vote_count + delta),
        has_voted: delta > 0,
      };
    });
    return list.sort(compareRequests);
  }, [rows, pending]);

  // ── optimistic upvote ──────────────────────────────────────────
  const onUpvote = useCallback(
    async (track: TrackRequestView) => {
      if (!userId) return; // RequestRow renders the locked affordance

      const delta: 1 | -1 = track.has_voted ? -1 : 1;
      setPending((p) => new Map(p).set(track.id, delta));

      const res = await toggleUpvote(track.id, track.has_voted);
      if (!res.ok) console.warn("upvote failed:", res.error);

      // ponytail: fixed 400ms grace, long enough for the realtime echo to land
      // and make `rows` authoritative before the optimistic delta is dropped.
      window.setTimeout(() => {
        setPending((p) => {
          const n = new Map(p);
          n.delete(track.id);
          return n;
        });
      }, 400);
    },
    [userId],
  );

  const statusLabel =
    status === "live" ? "● live" : status === "offline" ? "○ offline" : "…";

  const openGate = useCallback(() => setGateOpen(true), []);

  return (
    <TerminalPanel
      label="track.requests"
      status={statusLabel}
      tone="cyan"
      interactive
      bodyClassName="flex flex-col gap-3 p-6"
    >
      <RequestForm authed={Boolean(userId)} onGate={openGate} />

      {view.length === 0 ? (
        <BoardEmpty locked={!userId} />
      ) : (
        <ul className="flex flex-col gap-2">
          {view.map((r, i) => (
            <RequestRow
              key={r.id}
              rank={i + 1}
              request={r}
              canVote={Boolean(userId)}
              busy={pending.has(r.id)}
              onUpvote={onUpvote}
              onGate={openGate}
            />
          ))}
        </ul>
      )}

      <GateDialog open={gateOpen} onClose={() => setGateOpen(false)} />
    </TerminalPanel>
  );
}
