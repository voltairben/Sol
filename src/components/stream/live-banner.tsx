"use client";

import { useEffect, useState } from "react";
import { useStreamState } from "./stream-state-provider";
import { useT } from "@/lib/i18n";

function elapsed(iso: string | null, nowMs: number): string | null {
  if (!iso) return null;
  const secs = Math.floor((nowMs - Date.parse(iso)) / 1000);
  if (!Number.isFinite(secs) || secs < 0) return null;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Neon-blue broadcast alert. Renders nothing when off air; while live it
 * shows a running timer counting from `stream_state.updated_at` (the moment
 * the broadcast was flipped on — real data, not simulated).
 */
export function LiveBanner() {
  const { isLive, liveSince } = useStreamState();
  const t = useT();
  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    if (!isLive) return;
    // rAF paints the first value next frame; the interval keeps it ticking.
    const raf = requestAnimationFrame(() => setNowMs(Date.now()));
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [isLive]);

  if (!isLive) return null;
  const clock = nowMs > 0 ? elapsed(liveSince, nowMs) : null;

  return (
    <div className="animate-live rounded-[2px] border-2 border-[var(--cyan)] bg-[color-mix(in_oklab,var(--cyan)_10%,transparent)] p-3 text-center shadow-[0_0_28px_-6px_var(--cyan)]">
      <p className="font-departure text-sm uppercase tracking-[0.32em] text-[var(--cyan)]">
        ● {t.live_now}
        {clock && (
          <span className="ml-2 font-mono tracking-[0.1em] tabular-nums">
            {clock}
          </span>
        )}
      </p>
      <p className="mt-0.5 text-[0.7rem] text-[var(--text-dim)]">{t.live_sub}</p>
    </div>
  );
}
