"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

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
        <Link
          key={item.href}
          href={item.href}
          className="font-departure text-[0.8rem] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
        >
          [ {item.label} ]
        </Link>
      ))}
    </nav>
  );
}
