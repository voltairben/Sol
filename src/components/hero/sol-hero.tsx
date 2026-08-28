"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { DecryptText } from "@/components/effects/decrypt-text";

const CRT_LINES =
  "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.15) 50%)";

export function SolHero() {
  return (
    <div className="flex select-none flex-col items-center justify-center py-2">
      {/* Terminal monitor bezel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="group relative aspect-[16/10] w-full max-w-[440px] overflow-hidden rounded-md border border-[color-mix(in_oklab,var(--cyan)_28%,transparent)] bg-[var(--surface)] shadow-[0_0_26px_-2px_color-mix(in_oklab,var(--cyan)_28%,transparent),0_0_48px_-12px_color-mix(in_oklab,var(--persimmon)_24%,transparent)] transition-all duration-300 hover:border-[color-mix(in_oklab,var(--cyan)_55%,transparent)] hover:shadow-[0_0_32px_-2px_color-mix(in_oklab,var(--cyan)_40%,transparent),0_0_56px_-10px_color-mix(in_oklab,var(--persimmon)_32%,transparent)]"
      >
        {/* CRT scanlines + centre glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-50"
          style={{ backgroundImage: CRT_LINES, backgroundSize: "100% 4px" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--cyan)_7%,transparent),transparent_70%)]"
        />

        {/* Corner brand tags */}
        <span className="absolute left-3 top-2 z-20 font-mono text-[9px] tracking-[0.2em] text-[color-mix(in_oklab,var(--cyan)_60%,transparent)]">
          [ CODENAME: SOL_CORE ]
        </span>
        <span className="absolute right-3 top-2 z-20 font-mono text-[9px] tracking-[0.2em] text-[color-mix(in_oklab,var(--persimmon)_60%,transparent)]">
          [ V1.1_SECURE ]
        </span>

        {/* The logo */}
        <div className="relative h-full w-full p-7">
          <Image
            src="/SolLogoDef1.1.png"
            alt="SOL_DNB"
            fill
            sizes="440px"
            priority
            className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        {/* Bottom LED */}
        <div className="absolute bottom-2 left-3 z-20 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[8px] tracking-wider text-[var(--text-dim)]">
            LINK: ESTABLISHED
          </span>
        </div>
      </motion.div>

      {/* System boot subheader */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="vapor-text mt-4 text-center font-departure text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--persimmon)] sm:text-[0.72rem]"
      >
        <DecryptText text="[SYSTEM_INIT: SUCCESS // AUDIO_DECK: ONLINE]" />
        <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-[var(--persimmon)] animate-pulse" />
      </motion.p>
    </div>
  );
}
