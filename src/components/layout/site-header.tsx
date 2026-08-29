import Link from "next/link";
import { OnAirChip } from "./on-air-chip";

const NAV = [
  { href: "/schedule", label: "schedule" },
  { href: "/about", label: "about" },
];

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-2 px-4 pt-4 pb-3 sm:px-6">
      <Link href="/" className="flex items-baseline gap-3">
        <span className="font-departure text-lg uppercase tracking-[0.35em] text-[var(--text)]">
          SOL_DNB
        </span>
        <span className="hidden text-[0.7rem] text-[var(--text-dim)] sm:inline">
          {"// terminal club"}
        </span>
      </Link>

      <nav className="flex items-center gap-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-departure text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
          >
            [ {item.label} ]
          </Link>
        ))}
      </nav>

      <div className="ml-auto">
        <OnAirChip />
      </div>
    </header>
  );
}
