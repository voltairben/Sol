"use client";

import { useLang } from "@/lib/lang-store";
import {
  PRIVACY_EN,
  PRIVACY_NL,
  type PrivacyTone,
} from "./privacy-content";

const TONE: Record<PrivacyTone, string> = {
  cyan: "text-[var(--cyan)]",
  persimmon: "text-[var(--persimmon)]",
  dim: "text-[var(--text-dim)]",
};

export function PrivacyManifest() {
  const lang = useLang();
  const copy = lang === "nl" ? PRIVACY_NL : PRIVACY_EN;

  return (
    <>
      <header className="flex flex-col gap-1">
        <span className="font-departure text-[0.55rem] uppercase tracking-[0.25em] text-[var(--persimmon)]">
          {copy.eyebrow}
        </span>
        <h1 className="font-departure text-lg uppercase tracking-[0.2em] text-[var(--text)] md:text-xl">
          {copy.title}
        </h1>
        <p className="mt-1 font-mono text-[0.72rem] text-[var(--text-dim)]">
          {copy.lede}
        </p>
      </header>

      <div className="flex flex-col gap-3 font-mono text-[0.8rem] leading-relaxed text-[var(--text)]">
        {copy.blocks.map((b) => (
          <section
            key={b.code}
            className="rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_50%,transparent)] p-4"
          >
            <p
              className={`mb-2 border-b border-[var(--border)] pb-2 font-departure text-[0.58rem] uppercase tracking-[0.16em] ${TONE[b.tone]}`}
            >
              [ {b.code} ]
            </p>
            <div className="flex flex-col gap-1 [&_code]:rounded-[2px] [&_code]:bg-[var(--bg)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.74rem] [&_code]:text-[var(--cyan)]">
              {b.body}
            </div>
          </section>
        ))}

        <p className="pt-2 text-[0.72rem] text-[var(--text-dim)]">
          <span className="animate-pulse">▊</span> {copy.endOfLog}
        </p>
      </div>
    </>
  );
}
