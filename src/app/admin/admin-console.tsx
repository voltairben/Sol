"use client";

import { useState, useTransition } from "react";
import { useStreamState } from "@/components/stream/stream-state-provider";
import { cn } from "@/lib/utils";
import { setStreamLive, logoutAdmin } from "./actions";

export function AdminConsole({ initialLive }: { initialLive: boolean }) {
  const { isLive: realtimeLive, loading } = useStreamState();
  const live = loading ? initialLive : realtimeLive;

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      const res = await setStreamLive(!live);
      if (!res.ok) setError(res.error ?? "update failed");
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-[3px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between">
        <span className="font-departure text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          broadcast state
        </span>
        <span
          className={cn(
            "font-departure text-[0.7rem] uppercase tracking-[0.16em]",
            live ? "text-[var(--cyan)]" : "text-[var(--text-dim)]",
          )}
        >
          {live ? "● on air" : "○ offline"}
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={live}
        className={cn(
          "rounded-[3px] border-2 px-4 py-6 text-center font-departure text-[0.78rem] uppercase tracking-[0.16em] transition-all disabled:opacity-60",
          live
            ? "border-[var(--persimmon)] bg-[color-mix(in_oklab,var(--persimmon)_12%,transparent)] text-[var(--persimmon)] hover:bg-[color-mix(in_oklab,var(--persimmon)_20%,transparent)]"
            : "animate-onair border-[var(--cyan)] bg-[color-mix(in_oklab,var(--cyan)_10%,transparent)] text-[var(--cyan)] hover:bg-[color-mix(in_oklab,var(--cyan)_18%,transparent)]",
        )}
      >
        {pending
          ? "…"
          : live
            ? "[ TERMINATE BROADCAST // GO OFFLINE ]"
            : "[ ACTIVATE BROADCAST // GO LIVE ]"}
      </button>

      {error && (
        <p className="font-departure text-[0.66rem] uppercase tracking-[0.14em] text-[var(--persimmon)]">
          ✗ {error}
        </p>
      )}

      <form action={logoutAdmin}>
        <button
          type="submit"
          className="text-[0.66rem] text-[var(--text-dim)] underline underline-offset-4 transition-colors hover:text-[var(--text)]"
        >
          end admin session
        </button>
      </form>
    </div>
  );
}
