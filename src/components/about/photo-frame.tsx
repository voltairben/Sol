"use client";

import Image from "next/image";
import { useT } from "@/lib/i18n";

/**
 * Console-analyzer photo frame: greyscale at rest, resolves to full colour and
 * eases in on hover/focus, with luminous cyan corner brackets, a scanning
 * sweep line, and an optical-lock telemetry tag.
 */
export function PhotoFrame() {
  const t = useT();
  return (
    <figure className="group relative aspect-[4/5] w-full overflow-hidden rounded-[3px] border border-[var(--border)] bg-black shadow-[0_0_25px_-8px_color-mix(in_oklab,var(--cyan)_30%,transparent)]">
      <Image
        src="/sol-profile.jpg"
        alt={t.photo_alt}
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        priority
        tabIndex={0}
        className="object-cover object-[center_25%] grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 focus:scale-105 focus:grayscale-0 focus:outline-none"
      />

      <span aria-hidden className="scan-line" />

      {/* bottom fade — lifts the tag + corner brackets off the image */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 to-transparent"
      />

      {/* corner brackets */}
      <span aria-hidden className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[var(--cyan)]" />
      <span aria-hidden className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[var(--cyan)]" />
      <span aria-hidden className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[var(--cyan)]" />
      <span aria-hidden className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[var(--cyan)]" />

      <figcaption className="pointer-events-none absolute bottom-2 left-2 rounded-[2px] border border-[color-mix(in_oklab,var(--cyan)_20%,transparent)] bg-black/80 px-2 py-0.5 font-departure text-[0.5rem] uppercase tracking-[0.18em] text-[var(--cyan)]">
        [ sys_analysis: optical_lock ]
      </figcaption>
    </figure>
  );
}
