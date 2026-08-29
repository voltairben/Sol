"use client";

import { useT } from "@/lib/i18n";

/** Terminal-style page title: `MAIN // sub`, following the EN/NL toggle. */
export function PageHeading({ variant }: { variant: "about" | "schedule" }) {
  const t = useT();
  const [main, sub] =
    variant === "about"
      ? [t.h_profile, "sol_dnb"]
      : [t.nav_schedule, t.h_broadcasts];

  return (
    <h1 className="font-departure text-xl uppercase tracking-[0.28em] text-[var(--text)]">
      {main}
      <span className="text-[var(--text-dim)]">{` // ${sub}`}</span>
    </h1>
  );
}
