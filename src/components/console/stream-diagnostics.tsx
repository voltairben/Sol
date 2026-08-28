"use client";

import { useEffect, useRef, useState } from "react";
import { useStreamState } from "@/components/stream/stream-state-provider";
import { VolumeMeter } from "./volume-meter";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="w-[7.5rem] shrink-0 text-[var(--text-dim)]">{k}</span>
      <span className="min-w-0 text-[var(--text)]">{v}</span>
    </div>
  );
}

// ponytail: simulated telemetry — swap the interval body for a real stats
// source (OBS stats API / stream ingest) behind this same component.
export function StreamDiagnostics() {
  const { isLive } = useStreamState();
  const [bitrate, setBitrate] = useState(8200);
  const [uptime, setUptime] = useState(0);
  const started = useRef(0);

  useEffect(() => {
    started.current = Date.now();
    const id = setInterval(() => {
      setBitrate(8200 + Math.round((Math.random() - 0.5) * 160));
      setUptime(Math.floor((Date.now() - started.current) / 1000));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const clock = [
    Math.floor(uptime / 3600),
    Math.floor((uptime % 3600) / 60),
    uptime % 60,
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");

  return (
    <div className="rounded-[2px] border border-[var(--border)] bg-[var(--bg)] p-2.5 font-mono text-[0.68rem] leading-relaxed">
      <Row
        k="STREAM_STATUS"
        v={
          <span
            className={
              isLive
                ? "animate-pulse text-[var(--cyan)]"
                : "text-[var(--text-dim)]"
            }
          >
            {isLive ? "ONLINE" : "STANDBY"}
          </span>
        }
      />
      <Row k="INPUT_BITRATE" v={`${bitrate} Kbps (STABLE)`} />
      <Row k="VIDEO_CODEC" v="H.264 (AVC1.64002A)" />
      <Row k="FRAMERATE" v="60.0 FPS / AUDIO AAC-LC 320K" />
      <Row k="UPTIME" v={clock} />
      <div className="mt-2 flex items-center gap-2">
        <span className="w-[7.5rem] shrink-0 text-[var(--text-dim)]">
          OUTPUT_LEVEL
        </span>
        <VolumeMeter active={isLive} />
      </div>
    </div>
  );
}
