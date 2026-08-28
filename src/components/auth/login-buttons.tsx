"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Provider = "twitch" | "discord";
const PROVIDERS: Provider[] = ["twitch", "discord"];

export function LoginButtons({
  next = "/",
  className,
}: {
  next?: string;
  className?: string;
}) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function connect(provider: Provider) {
    setPending(provider);
    setError(null);

    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next && next !== "/") redirectTo.searchParams.set("next", next);

    const { error } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo.toString() },
    });

    if (error) {
      // Provider not enabled yet, network error, etc. — stay on the page.
      setError(error.message);
      setPending(null);
    }
    // On success the browser is already navigating to the provider.
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-2">
        {PROVIDERS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => connect(p)}
            disabled={pending !== null}
            className={cn(
              "rounded-[2px] border border-[var(--cyan)] px-3 py-1.5",
              "font-departure text-[0.68rem] uppercase tracking-[0.14em] text-[var(--cyan)]",
              "transition-colors hover:bg-[color-mix(in_oklab,var(--cyan)_12%,transparent)]",
              "disabled:opacity-50",
            )}
          >
            {pending === p ? "connecting…" : `▸ ${p}`}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-[0.68rem] text-[var(--persimmon)]">! {error}</p>
      )}
    </div>
  );
}
