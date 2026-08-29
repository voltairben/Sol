"use client";

import { useT } from "@/lib/i18n";

/** Zero requests in the queue. */
export function BoardEmpty({ locked }: { locked: boolean }) {
  const t = useT();
  return (
    <div className="grid flex-1 place-items-center rounded-[2px] border border-dashed border-[var(--border)] p-6 text-center">
      <div className="flex flex-col gap-1">
        <p className="font-departure text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          {t.queue_empty}
        </p>
        <p className="text-[0.75rem] text-[var(--text-dim)]">
          {locked ? t.empty_locked : t.empty_open}
        </p>
      </div>
    </div>
  );
}
