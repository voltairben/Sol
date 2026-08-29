"use client";

import { cn } from "@/lib/utils";
import { setLang, useLang, type Lang } from "@/lib/lang-store";

const OPTIONS: Lang[] = ["en", "nl"];

/** EN / NL switch. Persists per browser; only the biography reads it today. */
export function LangToggle() {
  const lang = useLang();

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-[2px] border border-[var(--border)] font-departure text-[0.72rem] uppercase tracking-[0.16em]"
    >
      {OPTIONS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "px-2 py-1 transition-colors first:rounded-l-[1px] last:rounded-r-[1px]",
            lang === l
              ? "bg-[color-mix(in_oklab,var(--cyan)_14%,transparent)] text-[var(--cyan)]"
              : "text-[var(--text-dim)] hover:text-[var(--text)]",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
