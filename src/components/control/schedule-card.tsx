import { createClient } from "@/lib/supabase/server";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { formatSlot, scheduleWindowStart } from "@/lib/schedule";
import type { StreamSlot } from "@/types/database";
import { LiveBanner } from "@/components/stream/live-banner";

export async function ScheduleCard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stream_schedule")
    .select("*")
    .gte("starts_at", scheduleWindowStart())
    .order("starts_at", { ascending: true })
    .limit(5);

  const slots = (data ?? []) as StreamSlot[];

  return (
    <TerminalPanel label="broadcast.schedule" status="next up" tone="persimmon">
      <div className="flex flex-col gap-3">
        <LiveBanner />

        {slots.length === 0 ? (
          <p className="text-[0.75rem] text-[var(--text-dim)]">
            no sets scheduled — check back soon.
          </p>
        ) : (
          <ol className="flex flex-col divide-y divide-[var(--border)]">
            {slots.map((slot) => {
              const f = formatSlot(slot);
              return (
                <li key={slot.id} className="flex flex-col gap-0.5 py-2.5 first:pt-0">
                  <div className="flex items-center gap-2 text-[0.58rem]">
                    <span className="font-departure uppercase tracking-[0.12em] text-[var(--text-dim)]">
                      {f.day}
                    </span>
                    <span className="font-mono tabular-nums text-[var(--text-dim)]">
                      {f.time}
                      {f.duration ? ` · ${f.duration}` : ""}
                    </span>
                    {slot.genre && (
                      <span className="ml-auto font-departure uppercase tracking-[0.1em] text-[var(--persimmon)]">
                        {slot.genre}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.85rem] text-[var(--text)]">{slot.title}</p>
                </li>
              );
            })}
          </ol>
        )}

        <p className="text-[0.6rem] text-[var(--text-dim)]">
          times in CET · europe/amsterdam
        </p>
      </div>
    </TerminalPanel>
  );
}
