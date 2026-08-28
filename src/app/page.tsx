import { TerminalPanel } from "@/components/ui/terminal-panel";
import { SolAsciiHero } from "@/components/hero/sol-ascii-hero";
import { StreamPlayer } from "@/components/console/stream-player";
import { RequestBoard } from "@/components/hub/request-board";
import { ScheduleCard } from "@/components/control/schedule-card";
import { Sol3DVisualAnchor } from "@/components/control/sol-3d-visual-anchor";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { SOCIAL_LINKS } from "@/lib/constants";

/** Placeholder for sections not yet built (about.deck). */
function Wire({ lines = 3, label }: { lines?: number; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="font-departure text-[0.62rem] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          {label}
        </p>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-2 rounded-[2px] bg-[color-mix(in_oklab,var(--text-dim)_24%,var(--surface))]"
          style={{ width: `${92 - i * 11}%` }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col gap-4 border-t border-[var(--border)] px-4 pt-4 pb-6 sm:px-6">
      {/*
       * The deck: hero spans the top; below it three independent column stacks.
       * Columns are separate flex stacks so panel heights never bleed across
       * columns. Mobile collapses to one column, ordered hero → console/about
       * → requests → schedule/3d/links.
       */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr_0.9fr] lg:items-start">
        <div className="lg:col-span-3">
          <TerminalPanel
            label="sol.hero"
            status="ascii://sol"
            bodyClassName="grid min-h-[180px] place-items-center"
          >
            <SolAsciiHero />
          </TerminalPanel>
        </div>

        {/* LEFT — the console */}
        <div className="order-2 flex flex-col gap-4 lg:order-none">
          <TerminalPanel
            label="stream.console"
            status="[_] [口] [x]"
            interactive
          >
            <StreamPlayer />
          </TerminalPanel>

          <TerminalPanel label="about.deck">
            <Wire
              label="netherlands → digital stream specialist"
              lines={5}
            />
          </TerminalPanel>
        </div>

        {/* CENTER — the engagement hub */}
        <div className="order-3 flex flex-col gap-4 lg:order-none">
          <RequestBoard />
        </div>

        {/* RIGHT — the control board */}
        <div className="order-4 flex flex-col gap-4 lg:order-none">
          <ScheduleCard />

          <TerminalPanel
            label="sol.3d_visual_anchor"
            status="lazy"
            tone="persimmon"
            bodyClassName="p-3"
          >
            <Sol3DVisualAnchor />
          </TerminalPanel>

          <TerminalPanel label="links.socials" interactive>
            <div className="flex flex-col gap-3">
              <ul className="flex flex-col gap-1.5 text-[0.8rem]">
                {SOCIAL_LINKS.map((l) => (
                  <li key={l.label} className="flex gap-2">
                    <span className="text-[var(--cyan)]">&gt;</span>
                    <span className="text-[var(--text-dim)]">{l.label}</span>
                    <span className="text-[var(--text)]">{l.value}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[var(--border)] pt-3">
                <NewsletterForm />
              </div>
            </div>
          </TerminalPanel>
        </div>
      </div>
    </div>
  );
}
