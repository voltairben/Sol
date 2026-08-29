import { TerminalPanel } from "@/components/ui/terminal-panel";
import { SolHero } from "@/components/hero/sol-hero";
import { StreamPlayer } from "@/components/console/stream-player";
import { RequestBoard } from "@/components/hub/request-board";
import { PlaytoolGadget } from "@/components/control/playtool-gadget";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { SocialLinks } from "@/components/links/social-links";

/**
 * The deck — a single cinematic vertical flow: the logo, the stream front and
 * centre, then the controls stacked beneath it like a cockpit.
 */
export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-12 px-4 pt-8 pb-16 sm:px-6">
      <SolHero />

      {/* Stream — the immediate focal point */}
      <section className="w-full max-w-5xl">
        <TerminalPanel
          label="stream.console"
          status="[_] [口] [x]"
          interactive
          className="shadow-[0_0_50px_rgba(0,240,255,0.15)]"
        >
          <StreamPlayer />
        </TerminalPanel>
      </section>

      {/* Track requests — the dashboard controller docked under the feed */}
      <section className="w-full max-w-3xl">
        <RequestBoard />
      </section>

      {/* Playtool — the interactive synth deck */}
      <section className="w-full">
        <PlaytoolGadget />
      </section>

      {/* Channels + signal list */}
      <section className="w-full max-w-4xl">
        <TerminalPanel label="links.socials" interactive bodyClassName="flex flex-col gap-5 p-5 sm:p-6">
          <SocialLinks />
          <div className="border-t border-[var(--border)] pt-4">
            <NewsletterForm />
          </div>
        </TerminalPanel>
      </section>
    </div>
  );
}
