"use client";

import { useT } from "@/lib/i18n";
import { AuthConnectButtons } from "./auth-connect-buttons";

/**
 * Shown in place of the track-suggest form for logged-out viewers. Makes the
 * two OAuth buttons the first thing a new visitor sees, no click-to-discover.
 */
export function AuthRequiredCard() {
  const t = useT();

  return (
    <div
      id="auth-required"
      className="flex flex-col gap-4 rounded-[3px] border border-[color-mix(in_oklab,var(--persimmon)_45%,transparent)] bg-[color-mix(in_oklab,var(--persimmon)_7%,transparent)] p-5 shadow-[inset_0_0_34px_-18px_var(--persimmon)]"
    >
      <div className="flex flex-col gap-1.5">
        <p className="font-departure text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[var(--persimmon)]">
          [ access_denied // authentication_required ]
        </p>
        <p className="text-[0.8rem] leading-relaxed text-[var(--text-dim)]">
          {t.auth_card_body}
        </p>
      </div>

      <AuthConnectButtons />
    </div>
  );
}
