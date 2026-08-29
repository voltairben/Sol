import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { PhotoFrame } from "@/components/about/photo-frame";
import { BioLog } from "@/components/about/bio-log";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { SocialLinks } from "@/components/links/social-links";

export const metadata: Metadata = {
  title: "profile // SOL_DNB",
  description:
    "From club circuits across the south of the Netherlands to a vinyl-driven livestream — the story of SOL_DNB.",
};

const SPECS = [
  { label: "console_input", value: "1210 MK7 TURNTABLES", tone: "text" },
  { label: "media_formats", value: "WET VINYL // DIGITAL FLUID", tone: "cyan" },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pt-8 pb-16 sm:px-6">
      <BackdropScrim />
      <BackLink />

      <div className="grid gap-8 md:grid-cols-12 md:items-start">
        <div className="flex flex-col gap-4 md:col-span-5">
          <PhotoFrame />

          <dl className="flex flex-col gap-3 rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_50%,transparent)] p-4 text-[0.62rem]">
            <p className="font-departure text-[0.55rem] uppercase tracking-[0.2em] text-[var(--persimmon)]">
              [ rig_status ]
            </p>
            {SPECS.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <dt className="font-departure uppercase tracking-[0.14em] text-[var(--text-dim)]">
                  {s.label}:
                </dt>
                <dd
                  className={
                    s.tone === "cyan"
                      ? "font-bold text-[var(--cyan)]"
                      : "font-bold text-[var(--text)]"
                  }
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <TerminalPanel
          label="bio.log"
          className="md:col-span-7"
          bodyClassName="flex flex-col gap-6 p-5 sm:p-6"
        >
          <header className="flex flex-col gap-1">
            <h1 className="font-departure text-lg uppercase tracking-[0.22em] text-[var(--persimmon)]">
              [ artist_biography // sol ]
            </h1>
            <p className="font-departure text-[0.58rem] uppercase tracking-[0.16em] text-[var(--text-dim)]">
              [ spectrum: liquid // dancefloor // neurofunk // jungle ]
            </p>
          </header>

          <BioLog />
        </TerminalPanel>
      </div>

      <section className="w-full">
        <TerminalPanel label="links.socials" interactive bodyClassName="p-5 sm:p-6">
          <SocialLinks />
        </TerminalPanel>
      </section>
    </div>
  );
}
