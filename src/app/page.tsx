import { TerminalPanel } from "@/components/ui/terminal-panel";
import { BootGate } from "@/components/effects/boot-gate";
import { SolHero } from "@/components/hero/sol-hero";
import { StreamPlayer } from "@/components/console/stream-player";
import { VinylVisualizer } from "@/components/stream/vinyl-visualizer";
import { LiveBanner } from "@/components/stream/live-banner";
import { RequestBoard } from "@/components/hub/request-board";
import { FlightDeck } from "@/components/hub/flight-deck";
import { PlaytoolGadget } from "@/components/control/playtool-gadget";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { SocialLinks } from "@/components/links/social-links";

/**
 * The deck — one prioritised vertical column, every card the same width.
 * 1 logo · 2 stream · 3 live banner · 4 requests · 5 playtool · 6 links
 * Wrapped in BootGate: a one-per-session terminal boot screen.
 */
export default function Home() {
  return (
    <BootGate>
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
        <SolHero />

        <TerminalPanel
          label="stream.console"
          status="[_] [口] [x]"
          interactive
          className="shadow-[0_0_50px_rgba(0,240,255,0.15)]"
          bodyClassName="flex flex-col gap-5 p-6"
        >
          <StreamPlayer />
          <div className="border-t border-[var(--border)] pt-5">
            <VinylVisualizer />
          </div>
        </TerminalPanel>

        {/* Renders only while the broadcast is live. */}
        <LiveBanner />

        <RequestBoard />
        <FlightDeck />

        <PlaytoolGadget />

        <TerminalPanel
          label="links.socials"
          interactive
          bodyClassName="flex flex-col gap-6 p-6"
        >
          <SocialLinks />
          <div className="border-t border-[var(--border)] pt-4">
            <NewsletterForm />
          </div>
        </TerminalPanel>
      </div>
    </BootGate>
  );
}
