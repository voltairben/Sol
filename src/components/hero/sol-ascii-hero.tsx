"use client";

import { motion, useReducedMotion } from "motion/react";
import { VaporText } from "@/components/effects/vapor-text";

// "SOL" — ANSI Shadow figlet. Kept as one string so the columns line up.
const SOL = String.raw`
███████╗ ██████╗ ██╗
██╔════╝██╔═══██╗██║
███████╗██║   ██║██║
╚════██║██║   ██║██║
███████║╚██████╔╝███████╗
╚══════╝ ╚═════╝ ╚══════╝
`
  .replace(/^\n/, "")
  .replace(/\n$/, "")
  .split("\n");

export function SolAsciiHero() {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <motion.pre
        aria-label="SOL"
        className="overflow-x-auto font-mono text-[0.5rem] leading-none text-[var(--persimmon)] [text-shadow:0_0_18px_color-mix(in_oklab,var(--persimmon)_45%,transparent)] sm:text-[0.7rem] md:text-sm"
        initial={reduce ? undefined : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      >
        {SOL.map((line, i) => (
          <motion.span
            key={i}
            className="block"
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
            }}
          >
            {line}
          </motion.span>
        ))}
      </motion.pre>

      <motion.div
        initial={reduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.7 }}
      >
        <VaporText>[SYSTEM_INIT: SUCCESS // AUDIO_DECK: ONLINE]</VaporText>
      </motion.div>
    </div>
  );
}
