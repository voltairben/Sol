"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { clearTrackRequests } from "./actions";

type Phase = "idle" | "confirm" | "wiping";

const LABEL: Record<Phase, string> = {
  idle: "[ PURGE_REQUEST_QUEUE ]",
  confirm: "[ CONFIRM_PURGE_ARE_YOU_SURE? ]",
  wiping: "[ WIPING_GRID... ]",
};

export function RequestQueueControl() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onClick() {
    if (phase === "wiping") return;
    setMsg(null);
    if (phase === "idle") {
      setPhase("confirm");
      return;
    }
    // phase === "confirm" — do it
    setPhase("wiping");
    const res = await clearTrackRequests();
    setPhase("idle");
    setMsg(res.ok ? "✓ QUEUE_CLEARED" : `✗ ${res.error ?? "WIPE_FAILED"}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-[3px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <span className="font-departure text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-dim)]">
        track request control
      </span>
      <p className="text-[0.68rem] leading-relaxed text-[var(--text-dim)]">
        Deletes every track request and its votes. This cannot be undone.
      </p>

      <button
        type="button"
        onClick={onClick}
        onBlur={() => {
          if (phase === "confirm") setPhase("idle");
        }}
        disabled={phase === "wiping"}
        className={cn(
          "rounded-[2px] border px-3 py-3 text-center font-departure text-[0.64rem] uppercase tracking-[0.12em] transition-colors disabled:opacity-60",
          phase === "confirm"
            ? "border-red-500 bg-red-950/40 text-red-300"
            : "border-red-900/60 text-red-500 hover:bg-red-950/20",
        )}
      >
        {LABEL[phase]}
      </button>

      {msg && (
        <p
          className={cn(
            "font-departure text-[0.62rem] uppercase tracking-[0.12em]",
            msg.startsWith("✓") ? "text-[var(--cyan)]" : "text-[var(--persimmon)]",
          )}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
