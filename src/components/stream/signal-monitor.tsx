"use client";

import { useEffect, useState } from "react";
import { useStreamState } from "./stream-state-provider";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { StreamTelemetry } from "@/lib/stream-telemetry";

const POLL_MS = 30_000;

function clock(totalSecs: number): string {
  const s = Math.max(0, Math.floor(totalSecs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return [h, m, s % 60].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Console signal monitor — real broadcast telemetry.
 *
 * Live flag: `stream_state` (admin/OBS toggle, realtime) OR a platform API
 * confirming a broadcast. Viewer count + external uptime + title come from
 * `/api/stream/telemetry` (Twitch Helix + best-effort Kick), polled every 30s.
 * Offline: a clean STANDBY readout with a parked 00:00:00 clock.
 */
export function SignalMonitor() {
  const {
    isLive: flagLive,
    liveSince,
    bitrate,
    fps,
    droppedFrames,
  } = useStreamState();
  const t = useT();
  const [tel, setTel] = useState<StreamTelemetry | null>(null);
  const [nowMs, setNowMs] = useState(0);

  // poll the telemetry endpoint
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/stream/telemetry", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as StreamTelemetry;
        if (active) setTel(data);
      } catch {
        /* keep the last good snapshot */
      }
    };
    void load();
    const id = setInterval(load, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const live = Boolean(tel?.is_live) || flagLive;
  const startedAt = tel?.started_at ?? liveSince;

  // uptime ticker — derived from a captured wall clock, frozen under reduced motion
  useEffect(() => {
    if (!live) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raf = requestAnimationFrame(() => setNowMs(Date.now()));
    if (reduce) return () => cancelAnimationFrame(raf);
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [live]);

  const uptime =
    live && startedAt && nowMs > 0
      ? clock((nowMs - Date.parse(startedAt)) / 1000)
      : "00:00:00";

  const uplink = live ? (tel?.platform && tel.platform !== "NONE" ? tel.platform : "SIGNAL") : "—";
  const viewers =
    live && tel?.configured && tel.viewers > 0
      ? tel.viewers.toLocaleString("en-US")
      : live
        ? "—"
        : "0";
  const title = live ? (tel?.title ?? "—") : "—";

  const rows: Array<[string, string]> = [
    ["UPLINK", uplink],
    ["VIEWERS", viewers],
    ["UPTIME", uptime],
    ["TITLE", title],
  ];

  // OBS encoder telemetry (POST /api/stream/status). Zeroed off air.
  const encBitrate = live ? bitrate : 0;
  const encFps = live ? fps : 0;
  const encLoss = live ? droppedFrames : 0;

  return (
    <div
      className={cn(
        "rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_78%,transparent)] p-4 font-mono text-[0.7rem] sm:p-5",
        live && "shadow-[inset_0_0_34px_-20px_var(--cyan)]",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2 font-departure text-[0.55rem] uppercase tracking-[0.16em]">
        <span className="text-[var(--text-dim)]">[ signal.monitor ]</span>
        <span
          className={cn(
            "flex items-center gap-1.5",
            live ? "text-[var(--cyan)]" : "text-[var(--text-dim)]",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              live ? "animate-pulse bg-[var(--cyan)]" : "bg-[var(--text-dim)]",
            )}
          />
          {live ? "TRANSMITTING // LIVE" : "STANDBY // SIGNAL_LOST"}
        </span>
      </div>

      <dl className="mt-3 flex flex-col gap-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline gap-3">
            <dt className="w-16 shrink-0 font-departure text-[0.5rem] uppercase tracking-[0.14em] text-[var(--text-dim)]">
              {label}
            </dt>
            <dd
              className={cn(
                "min-w-0 flex-1 truncate tabular-nums",
                label === "UPLINK" && live
                  ? "text-[var(--cyan)]"
                  : "text-[var(--text)]",
              )}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-[var(--border)] pt-2 text-[0.6rem] uppercase tracking-[0.08em] text-[var(--text-dim)]">
        <span>
          [ BITRATE:{" "}
          <span className={cn(live && "text-[var(--text)]")}>
            {encBitrate.toLocaleString("en-US")}
          </span>{" "}
          kbps ]
        </span>
        <span>
          [ FPS:{" "}
          <span className={cn(live && "text-[var(--text)]")}>{encFps}</span> ]
        </span>
        <span className={cn(encLoss > 0 && "text-[var(--persimmon)]")}>
          [ LOSS: {encLoss.toLocaleString("en-US")} frames ]
        </span>
      </div>

      <p className="mt-2 text-[0.62rem] text-[var(--text-dim)]">
        <span className="animate-pulse text-[var(--persimmon)]">▊</span>{" "}
        {live ? t.sig_live_sub : t.sig_standby_sub}
      </p>
    </div>
  );
}
