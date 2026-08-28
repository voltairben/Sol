"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { DecryptText } from "@/components/effects/decrypt-text";

const BACK_GLOW =
  "radial-gradient(circle, color-mix(in oklab, var(--cyan) 24%, transparent) 0%, color-mix(in oklab, var(--persimmon) 13%, transparent) 42%, transparent 72%)";

export function SolHero() {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex select-none flex-col items-center justify-center py-8 md:py-12">
      {/* Radial back-glow — melts the logo edges into whatever is behind */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 size-[350px] rounded-full blur-3xl md:size-[560px]"
        style={{ backgroundImage: BACK_GLOW }}
        animate={
          reduce
            ? { opacity: 0.7 }
            : { opacity: [0.5, 0.82, 0.5], scale: [1, 1.06, 1] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating logo — no frame, no backdrop. sol-logo.png is the mark with
          its baked-in black knocked out (luminance alpha), so its edges feather
          straight into the background. */}
      <motion.div
        className="relative h-[214px] w-[330px] [filter:drop-shadow(0_0_24px_color-mix(in_oklab,var(--cyan)_28%,transparent))] sm:h-[292px] sm:w-[448px] md:h-[380px] md:w-[584px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          reduce
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: 1, y: [-6, 6, -6] }
        }
        transition={{
          opacity: { duration: 0.8, ease: "easeOut" },
          scale: { duration: 0.8, ease: "easeOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src="/sol-logo.png"
          alt="SOL_DNB"
          fill
          sizes="(max-width: 640px) 330px, (max-width: 768px) 448px, 584px"
          priority
          className="object-contain"
        />
      </motion.div>

      {/* System boot status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-7 font-mono"
      >
        <div className="inline-flex items-center gap-2 rounded-[3px] border border-[color-mix(in_oklab,var(--cyan)_22%,transparent)] bg-[color-mix(in_oklab,var(--surface)_45%,transparent)] px-2.5 py-1 shadow-[0_0_18px_-6px_color-mix(in_oklab,var(--cyan)_45%,transparent)] backdrop-blur-sm">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--cyan)] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--cyan)]" />
          </span>
          <DecryptText
            text="[ SYSTEM_INIT: SUCCESS // AUDIO_DECK: ONLINE ]"
            className="vapor-text whitespace-nowrap text-[0.5rem] font-bold uppercase tracking-[0.1em] text-[var(--cyan)] md:text-[0.72rem] md:tracking-[0.15em]"
          />
        </div>
      </motion.div>
    </div>
  );
}
