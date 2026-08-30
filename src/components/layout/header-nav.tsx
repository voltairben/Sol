"use client";

import { useT } from "@/lib/i18n";
import { NavLink } from "./nav-link";

/** Primary nav — labels follow the EN/NL toggle. */
export function HeaderNav() {
  const t = useT();
  const items = [
    { href: "/schedule", label: t.nav_schedule },
    { href: "/about", label: t.nav_about },
  ];

  return (
    <nav className="flex items-center gap-5">
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          className="font-departure text-[0.8rem] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
        >
          [ {item.label} ]
        </NavLink>
      ))}
    </nav>
  );
}
