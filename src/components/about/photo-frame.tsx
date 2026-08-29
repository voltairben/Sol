"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";

const BRACKET =
  "absolute h-5 w-5 border-[var(--cyan)] transition-shadow duration-300 group-hover:shadow-[0_0_10px_var(--cyan)]";

/**
 * Console photo analyzer: greyscale at rest, easing to full colour on hover,
 * with luminous cyan corner brackets, a scanning sweep line, and a scanner
 * status HUD along the bottom.
 */
export function PhotoFrame() {
  const t = useT();
  return (
    <figure className="group relative aspect-[4/5] w-full overflow-hidden rounded-[3px] border border-[var(--border)] bg-black shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--cyan)_30%,transparent)]">
      <Image
        src="/sol-profile.jpg"
        alt={t.photo_alt}
        fill
        sizes="(max-width: 1024px) 100vw, 420px"
        priority
        tabIndex={0}
        className="object-cover object-[center_25%] grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 focus:scale-[1.03] focus:grayscale-0 focus:outline-none"
      />

      <span aria-hidden className="scan-line" />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent"
      />

      {/* corner brackets */}
      <span aria-hidden className={`${BRACKET} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden className={`${BRACKET} right-0 top-0 border-r-2 border-t-2`} />
      <span aria-hidden className={`${BRACKET} bottom-0 left-0 border-b-2 border-l-2`} />
      <span aria-hidden className={`${BRACKET} bottom-0 right-0 border-b-2 border-r-2`} />

      {/* scanner status HUD */}
      <figcaption className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between rounded-[2px] border border-[color-mix(in_oklab,var(--cyan)_22%,transparent)] bg-black/85 px-2 py-1 font-departure text-[0.5rem] uppercase tracking-[0.12em] text-[var(--cyan)]">
        <span className="flex items-center gap-1">
          <span className="size-1 animate-pulse rounded-full bg-[var(--cyan)]" />
          sys_locked: visual_lock_on
        </span>
        <span className="text-[var(--text-dim)]">grid_pos_09</span>
      </figcaption>
    </figure>
  );
}
