"use client";

import { cn } from "@/lib/utils";
import { toggleAudio, useAudioEnabled } from "@/lib/sfx";

/** Master console-SFX switch. Preference persists per browser. */
export function AudioToggle() {
  const on = useAudioEnabled();

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-pressed={on}
      className={cn(
        "rounded-[2px] border px-2 py-1 font-departure text-[0.6rem] uppercase tracking-[0.16em] transition-colors",
        on
          ? "border-[color-mix(in_oklab,var(--cyan)_45%,transparent)] bg-[color-mix(in_oklab,var(--cyan)_12%,transparent)] text-[var(--cyan)]"
          : "border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)]",
      )}
    >
      [ audio: {on ? "on" : "off"} ]
    </button>
  );
}
