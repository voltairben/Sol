"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";

/**
 * Console-analyzer photo frame: greyscale at rest, resolves to full colour on
 * hover/focus, with luminous cyan corner brackets and a scanning sweep line.
 */
export function PhotoFrame() {
  const t = useT();
  return (
    <figure className="group relative aspect-[4/5] w-full overflow-hidden rounded-[3px] border border-[var(--border)] bg-black">
      <Image
        src="/sol-profile.jpg"
        alt={t.photo_alt}
        fill
        sizes="(max-width: 640px) 100vw, 384px"
        priority
        tabIndex={0}
        className="object-cover object-[center_25%] grayscale transition-[filter] duration-700 ease-out group-hover:grayscale-0 focus:grayscale-0 focus:outline-none"
      />

      <span aria-hidden className="scan-line" />

      {/* bottom fade — lifts the caption + corner brackets off the image */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 to-transparent"
      />

      {/* corner brackets */}
      <span aria-hidden className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[var(--cyan)]" />
      <span aria-hidden className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[var(--cyan)]" />
      <span aria-hidden className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[var(--cyan)]" />
      <span aria-hidden className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[var(--cyan)]" />

      <figcaption className="pointer-events-none absolute bottom-2 left-2 font-departure text-[0.5rem] uppercase tracking-[0.2em] text-[color-mix(in_oklab,var(--cyan)_70%,transparent)]">
        [ subject: sol_dnb // signal locked ]
      </figcaption>
    </figure>
  );
}
