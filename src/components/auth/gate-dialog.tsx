"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Provider = "twitch" | "discord";

const BRAND: Record<Provider, string> = {
  twitch: "#9146FF",
  discord: "#5865F2",
};

/**
 * Auth gate — opens when a logged-out visitor tries to suggest or upvote.
 * Two OAuth buttons; the redirect comes back through /auth/callback.
 */
export function GateDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector("button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function connect(provider: Provider) {
    setPending(provider);
    setError(null);
    const redirectTo = new URL("/auth/callback", window.location.origin);
    redirectTo.searchParams.set("next", "/");
    const { error: err } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo.toString() },
    });
    if (err) {
      setError(err.message);
      setPending(null);
    }
    // on success the browser is already navigating to the provider
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        className="w-full max-w-xs rounded-[3px] border border-[color-mix(in_oklab,var(--cyan)_35%,transparent)] bg-[var(--surface)] p-5 shadow-[0_0_40px_-10px_var(--cyan)]"
      >
        <p
          id="gate-title"
          className="font-departure text-[0.72rem] uppercase tracking-[0.2em] text-[var(--cyan)]"
        >
          [ auth_required ]
        </p>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-[var(--text-dim)]">
          {t.gate_prompt}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {(["twitch", "discord"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => connect(p)}
              disabled={pending !== null}
              style={{ borderColor: BRAND[p], color: BRAND[p] }}
              className={cn(
                "rounded-[2px] border px-3 py-2.5 text-center font-departure text-[0.66rem] uppercase tracking-[0.12em] transition-colors disabled:opacity-50",
                p === "twitch"
                  ? "hover:bg-[color-mix(in_oklab,#9146FF_14%,transparent)]"
                  : "hover:bg-[color-mix(in_oklab,#5865F2_14%,transparent)]",
              )}
            >
              {pending === p ? t.connecting : `[ connect_with_${p} ]`}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-[0.64rem] text-[var(--persimmon)]">! {error}</p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-[0.62rem] text-[var(--text-dim)] underline underline-offset-4 transition-colors hover:text-[var(--text)]"
        >
          cancel
        </button>
      </div>
    </div>
  );
}
