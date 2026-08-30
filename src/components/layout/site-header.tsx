import { NavLink } from "./nav-link";
import { OnAirChip } from "./on-air-chip";
import { HeaderNav } from "./header-nav";
import { LangToggle } from "@/components/i18n/lang-toggle";
import { AudioToggle } from "@/components/console/audio-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_82%,transparent)]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-7 gap-y-3 px-4 py-4 sm:px-6 sm:py-5">
        <NavLink href="/" className="flex items-baseline gap-3">
          <span className="font-departure text-xl uppercase tracking-[0.32em] text-[var(--text)] sm:text-2xl">
            SOL_DNB
          </span>
          <span className="hidden text-xs text-[var(--text-dim)] sm:inline">
            {"// terminal club"}
          </span>
        </NavLink>

        <HeaderNav />

        <div className="ml-auto flex items-center gap-3">
          <LangToggle />
          <AudioToggle />
          <OnAirChip />
        </div>
      </div>
    </header>
  );
}
