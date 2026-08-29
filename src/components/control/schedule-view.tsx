"use client";

import { LiveBanner } from "@/components/stream/live-banner";
import { useT } from "@/lib/i18n";
import type { ScheduleEvent } from "@/types/database";

export function ScheduleView({ events }: { events: ScheduleEvent[] }) {
  const t = useT();

  return (
    <div className="flex flex-col gap-5">
      <LiveBanner />

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
        <ul className="flex flex-col gap-4">
          {events.map((e) => (
            <li
              key={e.id}
              className="group relative overflow-hidden rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] p-5 pl-6 transition-colors hover:border-[color-mix(in_oklab,var(--persimmon)_55%,transparent)]"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1 bg-[var(--border)] transition-colors group-hover:bg-[var(--persimmon)]"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="w-fit rounded-[2px] border border-[color-mix(in_oklab,var(--persimmon)_25%,transparent)] bg-[color-mix(in_oklab,var(--persimmon)_10%,transparent)] px-2 py-0.5 font-departure text-[0.52rem] uppercase tracking-[0.16em] text-[var(--persimmon)]">
                    {e.location}
                  </span>
                  <h3 className="font-departure text-[0.95rem] uppercase tracking-[0.08em] text-[var(--text)]">
                    {e.title}
                  </h3>
                  {e.details && (
                    <p className="text-[0.78rem] leading-relaxed text-[var(--text-dim)]">
                      {e.details}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[0.78rem] tabular-nums text-[var(--text)] transition-colors group-hover:text-[var(--cyan)] sm:text-right">
                  {e.date_string}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {events.length > 0 && (
        <p className="text-[0.6rem] text-[var(--text-dim)]">{t.sched_tz}</p>
      )}
    </div>
  );
}
