"use client";

import { useStreamState } from "./stream-state-provider";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Vector turntable tied to the live broadcast flag. Off air: the record rests.
 * The moment `stream_state.is_live` flips true (realtime), the platter spins at
 * 33⅓ rpm and the card casts a pulsing cyan ambient glow.
 */
export function VinylVisualizer() {
  const { isLive } = useStreamState();
  const t = useT();

  return (
    <div
      className={cn(
        "relative flex items-center gap-5 overflow-hidden rounded-[3px] border-2 border-[var(--persimmon)] bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] p-4 transition-shadow duration-500 sm:p-5",
        isLive && "vinyl-live-glow",
      )}
    >
      {/* platter + record + tonearm */}
      <div className="relative size-24 shrink-0 sm:size-28">
        <div className="absolute inset-0 rounded-full bg-[var(--surface-2)] shadow-[inset_0_0_14px_rgba(0,0,0,0.55)]" />
        <div
          className={cn(
            "absolute inset-[6px] rounded-full",
            "[background:repeating-radial-gradient(circle_at_center,#0c1017_0px,#0c1017_2px,#151c29_3px,#0c1017_4px)]",
            isLive && "vinyl-spin",
          )}
        >
          {/* label */}
          <div className="absolute inset-[36%] rounded-full bg-[var(--persimmon)]" />
          {/* spindle */}
          <div className="absolute inset-[46%] rounded-full bg-[var(--bg)]" />
          {/* index mark so the rotation reads */}
          <span className="absolute left-1/2 top-[5px] h-4 w-px -translate-x-1/2 bg-[color-mix(in_oklab,var(--cyan)_55%,transparent)]" />
        </div>

        {/* tonearm */}
        <span className="absolute right-[3px] top-[2px] z-10 block size-[11px] rounded-full border border-[var(--text-dim)] bg-[var(--surface)]" />
        <div
          aria-hidden
          className={cn(
            "absolute right-[8px] top-[7px] z-10 h-[2px] w-[62%] origin-top-right rounded-full bg-[var(--text-dim)] transition-transform duration-700",
            isLive ? "rotate-[38deg]" : "rotate-[15deg]",
          )}
        >
          <span className="absolute -bottom-[3px] left-0 block size-2 rounded-[1px] bg-[var(--persimmon)]" />
        </div>
      </div>

      {/* readout + pitch fader */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-2 font-departure text-[0.55rem] uppercase tracking-[0.16em]">
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              isLive ? "animate-pulse bg-[var(--cyan)]" : "bg-[var(--text-dim)]",
            )}
          />
          <span
            className={cn(
              "truncate",
              isLive ? "text-[var(--cyan)]" : "text-[var(--text-dim)]",
            )}
          >
            {isLive ? t.vinyl_live : t.vinyl_idle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-departure text-[0.48rem] uppercase tracking-[0.12em] text-[var(--text-dim)]">
            pitch
          </span>
          <div
            aria-hidden
            className="relative h-1 flex-1 rounded-full bg-[var(--border)]"
          >
            <span className="absolute left-1/2 top-1/2 h-3.5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-[var(--text-dim)]" />
          </div>
          <span className="font-mono text-[0.48rem] tabular-nums text-[var(--text-dim)]">
            0.0%
          </span>
        </div>
      </div>
    </div>
  );
}
