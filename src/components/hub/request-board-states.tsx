"use client";

import { LoginButtons } from "@/components/auth/login-buttons";
import { useT } from "@/lib/i18n";

/** Shown in place of the submit form when there's no session. */
export function ConsoleLocked({ loading }: { loading: boolean }) {
  const t = useT();
  return (
    <div className="relative overflow-hidden rounded-[2px] border border-[color-mix(in_oklab,var(--persimmon)_45%,transparent)] bg-[color-mix(in_oklab,var(--persimmon)_6%,transparent)] p-3">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--persimmon)_10%,transparent)_0_10px,transparent_10px_20px)]"
      />
      <div className="relative flex flex-col gap-2">
        <p className="font-departure text-[0.7rem] uppercase tracking-[0.2em] text-[var(--persimmon)]">
          ▸ {t.console_locked}
        </p>
        <p className="text-[0.78rem] text-[var(--text-dim)]">
          {loading ? t.checking_session : t.auth_prompt}
        </p>
        {!loading && <LoginButtons />}
      </div>
    </div>
  );
}

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
