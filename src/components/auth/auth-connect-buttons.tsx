"use client";

import { useState } from "react";
import { connectOAuth, type OAuthProvider } from "@/lib/auth-connect";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Literal hex per provider — a `var(--brand)` inside a Tailwind arbitrary
// box-shadow doesn't reliably compile, so the classes are branched instead.
const STYLE: Record<OAuthProvider, string> = {
  twitch:
    "border-[#9146FF] text-[#9146FF] shadow-[0_0_15px_-3px_#9146FF] hover:bg-[color-mix(in_oklab,#9146FF_14%,transparent)] hover:shadow-[0_0_28px_-1px_#9146FF] focus-visible:shadow-[0_0_28px_-1px_#9146FF]",
  discord:
    "border-[#5865F2] text-[#5865F2] shadow-[0_0_15px_-3px_#5865F2] hover:bg-[color-mix(in_oklab,#5865F2_14%,transparent)] hover:shadow-[0_0_28px_-1px_#5865F2] focus-visible:shadow-[0_0_28px_-1px_#5865F2]",
};

/** The two OAuth connect buttons, each with its provider's brand glow. */
export function AuthConnectButtons({ className }: { className?: string }) {
  const t = useT();
  const [pending, setPending] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(provider: OAuthProvider) {
    setPending(provider);
    setError(null);
    const { error: err } = await connectOAuth(provider);
    if (err) {
      setError(err);
      setPending(null);
    }
    // success → the browser is already leaving for the provider
  }

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        {(["twitch", "discord"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            disabled={pending !== null}
            className={cn(
              "flex-1 rounded-[2px] border-2 px-4 py-3 text-center font-departure text-[0.62rem] font-bold uppercase tracking-[0.12em] transition-all focus-visible:outline-none disabled:opacity-50",
              STYLE[p],
            )}
          >
            {pending === p
              ? t.connecting
              : `[ ${p === "twitch" ? t.auth_twitch : t.auth_discord} ]`}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-[0.7rem] text-[var(--persimmon)]">! {error}</p>
      )}
    </div>
  );
}
