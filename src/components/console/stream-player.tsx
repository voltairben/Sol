"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { LiveBanner } from "@/components/stream/live-banner";
import { KickEmbed } from "./kick-embed";
import { TwitchEmbed } from "./twitch-embed";

type Platform = "kick" | "twitch";
const KEY = "sol:player";

const noop = () => () => {};
function readStored(): Platform {
  try {
    return localStorage.getItem(KEY) === "twitch" ? "twitch" : "kick";
  } catch {
    return "kick";
  }
}

export function StreamPlayer() {
  // Persisted choice, SSR-safe (no hydration mismatch, no setState-in-effect).
  const stored = useSyncExternalStore(noop, readStored, () => "kick" as Platform);
  const [override, setOverride] = useState<Platform | null>(null);
  const platform = override ?? stored;

  function choose(p: Platform) {
    setOverride(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {
      /* private mode */
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">
        {(["kick", "twitch"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => choose(p)}
            data-active={platform === p}
            className={cn(
              "rounded-[2px] border px-2.5 py-1 font-departure text-[0.6rem] uppercase tracking-[0.14em] transition-colors",
              "border-[var(--border)] text-[var(--text-dim)]",
              "data-[active=true]:border-[var(--cyan)] data-[active=true]:bg-[color-mix(in_oklab,var(--cyan)_12%,transparent)] data-[active=true]:text-[var(--cyan)]",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-[2px] border border-[var(--border)] bg-black">
        {platform === "kick" ? <KickEmbed /> : <TwitchEmbed />}
      </div>

      <LiveBanner />
    </div>
  );
}
