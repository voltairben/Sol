import Link from "next/link";
import { OnAirChip } from "./on-air-chip";
import { LangToggle } from "@/components/i18n/lang-toggle";

const NAV = [
  { href: "/schedule", label: "schedule" },
  { href: "/about", label: "about" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_82%,transparent)]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-7 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-departure text-xl uppercase tracking-[0.32em] text-[var(--text)] sm:text-2xl">
            SOL_DNB
          </span>
          <span className="hidden text-xs text-[var(--text-dim)] sm:inline">
            {"// terminal club"}
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-departure text-[0.8rem] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
            >
              [ {item.label} ]
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <LangToggle />
          <OnAirChip />
        </div>
      </div>
    </header>
  );
}
