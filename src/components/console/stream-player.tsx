"use client";

import { cn } from "@/lib/utils";
import { setPlayer, usePlayer } from "@/lib/player-store";
import { playSfx } from "@/lib/sfx";
import { setConsent, useConsent } from "@/lib/consent";
import { KickEmbed } from "./kick-embed";
import { TwitchEmbed } from "./twitch-embed";
import { FeedBlocked } from "./feed-blocked";

export function StreamPlayer() {
  const platform = usePlayer();
  const consent = useConsent();

  function choose(p: typeof platform) {
    if (p === platform) return;
    setPlayer(p);
    playSfx("switch");
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
        {consent === "granted" ? (
          platform === "kick" ? (
            <KickEmbed />
          ) : (
            <TwitchEmbed />
          )
        ) : (
          <FeedBlocked onAuthorize={() => setConsent("granted")} />
        )}
      </div>
    </div>
  );
}
