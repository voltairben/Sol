"use client";

import { useStreamState } from "@/components/stream/stream-state-provider";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Header status chip — pulses neon-blue while the broadcast is live. */
export function OnAirChip() {
  const { isLive } = useStreamState();
  const t = useT();

  return (
    <span
      aria-live="polite"
      className={cn(
        "flex items-center gap-2 rounded-[2px] border px-2.5 py-1",
        "font-departure text-[0.7rem] uppercase tracking-[0.16em] transition-colors",
        isLive
          ? "animate-onair border-[var(--cyan)] text-[var(--cyan)]"
          : "border-[var(--border)] text-[var(--text-dim)]",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          isLive ? "bg-[var(--cyan)]" : "bg-[var(--text-dim)]",
        )}
      />
      {isLive ? t.on_air : t.off_air}
    </span>
  );
}
