"use client";

import { useT } from "@/lib/i18n";
import { NavLink } from "./nav-link";

/** Terminal-style return affordance for secondary pages. */
export function BackLink() {
  const t = useT();
  return (
    <NavLink
      href="/"
      className="inline-flex items-center gap-2 font-departure text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-dim)] transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
    >
      <span aria-hidden>&lt;-</span> [ {t.return_to_deck} ]
    </NavLink>
  );
}
