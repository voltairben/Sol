"use client";

import { useStreamState } from "@/components/stream/stream-state-provider";

/** Flashing neon-blue alert that replaces the top of the schedule when live. */
export function ScheduleLiveBanner() {
  const { isLive } = useStreamState();
  if (!isLive) return null;

  return (
    <div className="animate-live rounded-[2px] border-2 border-[var(--cyan)] bg-[color-mix(in_oklab,var(--cyan)_10%,transparent)] p-3 text-center shadow-[0_0_28px_-6px_var(--cyan)]">
      <p className="font-departure text-sm uppercase tracking-[0.32em] text-[var(--cyan)]">
        ● live now
      </p>
      <p className="mt-0.5 text-[0.7rem] text-[var(--text-dim)]">
        broadcast in progress — tune in
      </p>
    </div>
  );
}
