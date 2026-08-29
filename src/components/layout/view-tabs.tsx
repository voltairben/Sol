"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** `[ about ] [ schedule ]` view markers for the secondary pages. */
export function ViewTabs({ active }: { active: "about" | "schedule" }) {
  const t = useT();
  const tabs = [
    { key: "about", href: "/about", label: t.nav_about },
    { key: "schedule", href: "/schedule", label: t.nav_schedule },
  ] as const;

  return (
    <div className="flex gap-4 font-departure text-[0.6rem] uppercase tracking-[0.16em]">
      {tabs.map((tab) =>
        tab.key === active ? (
          <span
            key={tab.key}
            aria-current="page"
            className="text-[var(--cyan)] [text-shadow:0_0_8px_color-mix(in_oklab,var(--cyan)_55%,transparent)]"
          >
            [ {tab.label} ]
          </span>
        ) : (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "text-[var(--persimmon)] transition-colors hover:text-[var(--text)]",
              "focus-visible:text-[var(--text)] focus-visible:outline-none",
            )}
          >
            [ {tab.label} ]
          </Link>
        ),
      )}
    </div>
  );
}
