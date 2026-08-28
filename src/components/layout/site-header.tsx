import Link from "next/link";
import { OnAirChip } from "./on-air-chip";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 pt-4 pb-3 sm:px-6">
      <Link href="/" className="flex items-baseline gap-3">
        <span className="font-departure text-lg uppercase tracking-[0.35em] text-[var(--text)]">
          SOL_DNB
        </span>
        <span className="hidden text-[0.7rem] text-[var(--text-dim)] sm:inline">
          {"// terminal club"}
        </span>
      </Link>
      <OnAirChip />
    </header>
  );
}
