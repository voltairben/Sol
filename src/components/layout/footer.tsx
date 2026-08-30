"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { clearConsent } from "@/lib/consent";
import { NavLink } from "./nav-link";
import { SUPABASE_REGION } from "@/lib/constants";
import { useStreamState } from "@/components/stream/stream-state-provider";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Resolved once at module load — a footer copyright year doesn't need to be reactive.
const YEAR = new Date().getFullYear();

/**
 * Site footer, aligned to the max-w-4xl content column. Telemetry is real:
 * live on-air state, a measured round-trip to the origin, the Supabase region
 * the app talks to, and the deploy commit passed down from the server layout.
 */
export function Footer({ commit }: { commit: string | null }) {
  const t = useT();
  const { isLive } = useStreamState();
  const [latency, setLatency] = useState<number | null>(null);

  // Real RTT to a static asset on our own origin, refreshed slowly.
  useEffect(() => {
    let active = true;
    const ping = async () => {
      const start = performance.now();
      try {
        await fetch("/sol-logo.png", { method: "HEAD", cache: "no-store" });
      } catch {
        return;
      }
      if (active) setLatency(Math.round(performance.now() - start));
    };
    void ping();
    const id = setInterval(ping, 30_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  function resetConsent() {
    clearConsent();
    // Deliberate full document load of "/" — the boot gate keeps its "already
    // played" state in module scope, so only a real reload replays the prompt.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/");
  }

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] py-8 font-mono text-[10px] text-[var(--text-dim)]">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 text-center md:flex-row md:justify-between md:text-left">
        {/* identity */}
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="whitespace-nowrap font-departure text-[0.6rem] uppercase tracking-[0.24em] text-[var(--text)]">
            SOL_DNB // {t.footer_core}
          </span>
          <span className="text-[9px] text-[var(--text-dim)]">
            © {YEAR} PROJECT_SOL — {t.footer_tagline}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[9px] text-[var(--text-dim)]">
            {t.footer_designed_by}
            <Image
              src="/voltair-mark.png"
              alt="Voltair"
              width={11}
              height={15}
              className="inline-block translate-y-[0.5px]"
            />
            <span className="font-departure uppercase tracking-[0.16em] text-[var(--persimmon)]">
              voltair_studio
            </span>
          </span>
        </div>

        {/* telemetry — all real */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_45%,transparent)] px-3 py-2">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                isLive
                  ? "animate-pulse bg-[var(--cyan)]"
                  : "bg-[var(--text-dim)]",
              )}
            />
            <span className={isLive ? "text-[var(--cyan)]" : undefined}>
              {(isLive ? t.on_air : t.off_air).toUpperCase()}
            </span>
          </span>
          <span className="uppercase">
            {t.footer_latency}{" "}
            <strong className="font-normal tabular-nums text-[var(--text)]">
              {latency == null ? "—" : `${latency}ms`}
            </strong>
          </span>
          <span className="uppercase">
            {t.footer_node}{" "}
            <strong className="font-normal text-[var(--text)]">
              {SUPABASE_REGION}
            </strong>
          </span>
          <span className="uppercase">
            {t.footer_build}{" "}
            <strong className="font-normal text-[var(--text)]">
              {commit ?? "dev"}
            </strong>
          </span>
        </div>

        {/* links */}
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-departure text-[0.58rem] uppercase tracking-[0.14em] [&_a]:whitespace-nowrap [&_button]:whitespace-nowrap">
          <NavLink
            href="/about"
            className="transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
          >
            [ {t.nav_about} ]
          </NavLink>
          <span className="text-[var(--border)]">|</span>
          <NavLink
            href="/schedule"
            className="transition-colors hover:text-[var(--persimmon)] focus-visible:text-[var(--persimmon)] focus-visible:outline-none"
          >
            [ {t.nav_schedule} ]
          </NavLink>
          <span className="text-[var(--border)]">|</span>
          <NavLink
            href="/privacy"
            className="transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
          >
            [ {t.footer_privacy} ]
          </NavLink>
          <span className="text-[var(--border)]">|</span>
          <button
            type="button"
            onClick={resetConsent}
            className="uppercase transition-colors hover:text-[var(--text)] focus-visible:text-[var(--text)] focus-visible:outline-none"
          >
            [ {t.footer_cookies} ]
          </button>
        </div>
      </div>
    </footer>
  );
}
