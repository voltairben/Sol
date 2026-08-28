"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitRequest } from "./actions";

export function RequestForm() {
  const [state, action, pending] = useActionState(submitRequest, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-2 rounded-[2px] border border-[var(--border)] p-3"
    >
      <p className="font-departure text-[0.62rem] uppercase tracking-[0.2em] text-[var(--cyan)]">
        ＋ open a request
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="artist"
          placeholder="artist"
          required
          maxLength={200}
          className="min-w-0 flex-1 rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[0.8rem] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--cyan)]"
        />
        <input
          name="title"
          placeholder="track"
          required
          maxLength={200}
          className="min-w-0 flex-1 rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[0.8rem] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--cyan)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-[2px] border border-[var(--cyan)] px-3 py-1.5 font-departure text-[0.7rem] uppercase tracking-[0.15em] text-[var(--cyan)] transition-colors hover:bg-[color-mix(in_oklab,var(--cyan)_12%,transparent)] disabled:opacity-50"
        >
          {pending ? "…" : "queue"}
        </button>
      </div>
      {state && !state.ok && (
        <p className="text-[0.7rem] text-[var(--persimmon)]">! {state.error}</p>
      )}
    </form>
  );
}
