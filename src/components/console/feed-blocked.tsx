"use client";

import { useT } from "@/lib/i18n";

/**
 * Fills the player box when the viewer hasn't authorised the external feed.
 * Clicking it grants consent and mounts the real Kick/Twitch iframe.
 */
export function FeedBlocked({ onAuthorize }: { onAuthorize: () => void }) {
  const t = useT();

  return (
    <button
      type="button"
      onClick={onAuthorize}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#07090F] px-6 text-center transition-colors hover:bg-[#0B0F19]"
    >
      <span className="font-departure text-[0.6rem] uppercase tracking-[0.28em] text-[var(--persimmon)]">
        [ {t.feed_blocked} ]
      </span>
      <span className="max-w-xs text-[0.72rem] leading-relaxed text-[var(--text-dim)]">
        {t.feed_blocked_sub}
      </span>
      <span className="mt-1 rounded-[2px] border border-[color-mix(in_oklab,var(--cyan)_45%,transparent)] bg-[color-mix(in_oklab,var(--cyan)_10%,transparent)] px-3 py-1.5 font-departure text-[0.58rem] uppercase tracking-[0.18em] text-[var(--cyan)]">
        {t.feed_blocked_cta}
      </span>
    </button>
  );
}
