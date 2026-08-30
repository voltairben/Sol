"use client";

import { useActionState, useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";
import { playSfx } from "@/lib/sfx";
import { submitRequest } from "./actions";

export function RequestForm({
  authed,
  onGate,
}: {
  authed: boolean;
  onGate: () => void;
}) {
  const t = useT();
  const [state, action, pending] = useActionState(submitRequest, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const errorText =
    state && !state.ok
      ? state.error === "fields"
        ? t.err_request_fields
        : state.error === "auth"
          ? t.err_request_auth
          : state.error
      : null;

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        if (!authed) {
          e.preventDefault();
          onGate();
          return;
        }
        playSfx("keyClick");
      }}
      className="flex flex-col gap-2 rounded-[2px] border border-[var(--border)] p-3"
    >
      <p className="font-departure text-[0.62rem] uppercase tracking-[0.2em] text-[var(--cyan)]">
        ＋ {t.open_request}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="track-suggest-input"
          name="artist"
          placeholder={t.ph_artist}
          required={authed}
          maxLength={200}
          className="min-w-0 flex-1 rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[0.8rem] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--cyan)]"
        />
        <input
          name="title"
          placeholder={t.ph_track}
          required={authed}
          maxLength={200}
          className="min-w-0 flex-1 rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[0.8rem] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--cyan)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-[2px] border border-[var(--cyan)] px-3 py-1.5 font-departure text-[0.7rem] uppercase tracking-[0.15em] text-[var(--cyan)] transition-colors hover:bg-[color-mix(in_oklab,var(--cyan)_12%,transparent)] disabled:opacity-50"
        >
          {pending ? "…" : t.submit_queue}
        </button>
      </div>
      {errorText && (
        <p className="text-[0.7rem] text-[var(--persimmon)]">! {errorText}</p>
      )}
    </form>
  );
}
