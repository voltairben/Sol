"use client";

import { useLang } from "@/lib/lang-store";
import { BIO_EN, BIO_NL } from "./bio-content";

export function BioLog() {
  const lang = useLang();
  const bio = lang === "nl" ? BIO_NL : BIO_EN;

  return (
    <div className="flex flex-col gap-6">
      <p className="font-departure text-[0.82rem] uppercase tracking-[0.16em] text-[var(--text)]">
        {bio.lead}
      </p>
      {bio.blocks.map((b) => (
        <section key={b.kicker} className="flex flex-col gap-2">
          <h2 className="font-departure text-[0.68rem] uppercase tracking-[0.22em] text-[var(--cyan)]">
            {b.kicker}
          </h2>
          <p className="text-[0.92rem] leading-relaxed text-[var(--text)]">
            {b.body}
          </p>
        </section>
      ))}
    </div>
  );
}
