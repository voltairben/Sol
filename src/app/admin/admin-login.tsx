"use client";

import { useActionState } from "react";
import { verifyAdminPasscode, type AdminResult } from "./actions";

const INITIAL: AdminResult = { ok: false };

export function AdminLogin() {
  const [state, action, pending] = useActionState(verifyAdminPasscode, INITIAL);

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-[3px] border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <p className="font-departure text-[0.7rem] uppercase tracking-[0.2em] text-[var(--persimmon)]">
        ▸ locked — passcode required
      </p>
      <input
        name="passcode"
        type="password"
        autoFocus
        autoComplete="off"
        placeholder="••••••••"
        className="rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[0.9rem] tracking-[0.2em] text-[var(--text)] outline-none focus:border-[var(--cyan)]"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-[2px] border border-[var(--cyan)] px-3 py-2 font-departure text-[0.72rem] uppercase tracking-[0.16em] text-[var(--cyan)] transition-colors hover:bg-[color-mix(in_oklab,var(--cyan)_12%,transparent)] disabled:opacity-50"
      >
        {pending ? "verifying…" : "authenticate"}
      </button>
      {!state.ok && state.error && (
        <p className="font-departure text-[0.68rem] uppercase tracking-[0.15em] text-[var(--persimmon)]">
          ✗ {state.error}
        </p>
      )}
    </form>
  );
}
