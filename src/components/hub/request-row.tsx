"use client";

import { cn } from "@/lib/utils";
import type { TrackRequestView } from "@/types/database";

export function RequestRow({
  rank,
  request,
  canVote,
  busy,
  onUpvote,
}: {
  rank: number;
  request: TrackRequestView;
  canVote: boolean;
  busy: boolean;
  onUpvote: (r: TrackRequestView) => void;
}) {
  const playing = request.status === "playing";
  const played = request.status === "played";

  return (
    <li
      className={cn(
        "flex items-stretch gap-3 rounded-[2px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-2)_55%,transparent)] p-2 transition-colors",
        playing && "border-[var(--cyan)]",
        played && "opacity-40",
      )}
    >
      <span className="w-6 shrink-0 self-center text-center font-departure text-[0.7rem] text-[var(--text-dim)]">
        {String(rank).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1 self-center">
        <p className="truncate text-[0.85rem] text-[var(--text)]">
          {request.title}
        </p>
        <p className="truncate text-[0.72rem] text-[var(--text-dim)]">
          {request.artist}
          {request.requester_name ? ` · ${request.requester_name}` : ""}
        </p>
      </div>

      {playing && (
        <span className="self-center font-departure text-[0.58rem] uppercase tracking-[0.15em] text-[var(--cyan)]">
          on&nbsp;deck
        </span>
      )}

      <button
        type="button"
        onClick={() => onUpvote(request)}
        disabled={busy || !canVote}
        aria-pressed={request.has_voted}
        title={canVote ? "Upvote" : "Sign in to vote"}
        className={cn(
          "flex w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[2px] border font-departure text-[0.7rem] transition-all",
          request.has_voted
            ? "border-[var(--persimmon)] text-[var(--persimmon)]"
            : "border-[var(--border)] text-[var(--text-dim)]",
          canVote &&
            !request.has_voted &&
            "hover:border-[var(--cyan)] hover:text-[var(--cyan)]",
          !canVote && "cursor-not-allowed opacity-50",
          busy && "animate-pulse",
        )}
      >
        <span aria-hidden>▲</span>
        <span className="tabular-nums">{request.vote_count}</span>
      </button>
    </li>
  );
}
