"use client";

import { LiveBanner } from "@/components/stream/live-banner";
import { useStreamState } from "@/components/stream/stream-state-provider";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ScheduleEvent } from "@/types/database";

function StatCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 px-2 py-2 text-center">
      <span className="font-departure text-[0.48rem] uppercase tracking-[0.16em] text-[var(--text-dim)]">
        {label}
      </span>
      <span
        className={cn(
          "truncate font-mono text-[0.7rem] tabular-nums",
          accent ? "text-[var(--persimmon)]" : "text-[var(--text)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function ScheduleView({ events }: { events: ScheduleEvent[] }) {
  const t = useT();
  const { isLive } = useStreamState();

  const nextTx =
    events.find((e) => !e.is_live)?.date_string ?? events[0]?.date_string ?? "—";

  return (
    <TerminalPanel
      label="broadcast.grid"
      status={isLive ? "● on air" : "next up"}
      tone="persimmon"
      bodyClassName="flex flex-col gap-5 p-5 sm:p-6"
    >
      <LiveBanner />

      {/* grid telemetry strip */}
      <div className="grid grid-cols-3 divide-x divide-[var(--border)] rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_45%,transparent)]">
        <StatCell label="logged" value={String(events.length).padStart(2, "0")} />
        <StatCell label="next_tx" value={nextTx} accent />
        <StatCell label="tz" value="CET" />
      </div>

      {events.length === 0 ? (
        <div className="rounded-[3px] border border-dashed border-[var(--border)] bg-black/20 p-10 text-center">
          <p className="font-departure text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            {t.sched_empty}
          </p>
          <p className="mt-1.5 text-[0.7rem] text-[var(--text-dim)]">
            {t.sched_empty_sub}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((e, i) => (
            <li
              key={e.id}
              className={cn(
                "group relative flex gap-3 overflow-hidden rounded-[3px] border bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] p-4 pl-5",
                e.is_live
                  ? "border-[color-mix(in_oklab,var(--persimmon)_60%,transparent)]"
                  : "border-[var(--border)] transition-colors hover:border-[color-mix(in_oklab,var(--persimmon)_55%,transparent)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-1",
                  e.is_live
                    ? "live-bar"
                    : "bg-[var(--border)] transition-colors group-hover:bg-[var(--persimmon)]",
                )}
              />

              <span className="shrink-0 pt-0.5 font-departure text-[0.6rem] tabular-nums text-[var(--text-dim)]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {e.is_live && (
                    <span className="animate-onair rounded-[2px] border border-[var(--persimmon)] px-2 py-0.5 font-departure text-[0.5rem] uppercase tracking-[0.18em] text-[var(--persimmon)]">
                      ● {t.sched_live}
                    </span>
                  )}
                  <span className="rounded-[2px] border border-[color-mix(in_oklab,var(--persimmon)_25%,transparent)] bg-[color-mix(in_oklab,var(--persimmon)_10%,transparent)] px-2 py-0.5 font-departure text-[0.5rem] uppercase tracking-[0.16em] text-[var(--persimmon)]">
                    {e.location}
                  </span>
                  <span className="ml-auto font-mono text-[0.74rem] tabular-nums text-[var(--text)] transition-colors group-hover:text-[var(--cyan)]">
                    {e.date_string}
                  </span>
                </div>
                <h3 className="font-departure text-[0.92rem] uppercase tracking-[0.06em] text-[var(--text)]">
                  {e.title}
                </h3>
                {e.details && (
                  <p className="text-[0.76rem] leading-relaxed text-[var(--text-dim)]">
                    {e.details}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {events.length > 0 && (
        <p className="border-t border-[var(--border)] pt-3 text-[0.58rem] text-[var(--text-dim)]">
          {t.sched_tz}
        </p>
      )}
    </TerminalPanel>
  );
}
