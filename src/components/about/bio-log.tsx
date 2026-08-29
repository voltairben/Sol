"use client";

import { useLang } from "@/lib/lang-store";
import { cn } from "@/lib/utils";
import { BIO_EN, BIO_NL, type BlockTone } from "./bio-content";

const STATUS_TONE: Record<BlockTone, string> = {
  cyan: "text-[var(--cyan)]",
  persimmon: "text-[var(--persimmon)]",
  green: "text-[#5FBF77]",
  dim: "text-[var(--text-dim)]",
};

export function BioLog() {
  const lang = useLang();
  const bio = lang === "nl" ? BIO_NL : BIO_EN;

  return (
    <div className="flex flex-col gap-3">
      {bio.blocks.map((b) => (
        <section
          key={b.code}
          className="rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_55%,transparent)] p-4 transition-colors hover:border-[color-mix(in_oklab,var(--text)_20%,transparent)]"
        >
          <div className="mb-2 flex items-center justify-between font-departure text-[0.52rem] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            <span>[ system_log: {b.code} ]</span>
            <span className={cn("font-bold", STATUS_TONE[b.tone])}>
              {b.status}
            </span>
          </div>
          <p className="text-[0.82rem] leading-relaxed text-[var(--text)]">
            {b.body}
          </p>
        </section>
      ))}
    </div>
  );
}
