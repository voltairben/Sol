import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { ViewTabs } from "@/components/layout/view-tabs";
import { PhotoFrame } from "@/components/about/photo-frame";
import { BioLog } from "@/components/about/bio-log";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { SocialLinks } from "@/components/links/social-links";

export const metadata: Metadata = {
  title: "profile // SOL_DNB",
  description:
    "From club circuits across the south of the Netherlands to a vinyl-driven livestream — the story of SOL_DNB.",
};

const RIG = [
  "Pioneer XDJ-XZ",
  "2× Audio-Technica AT-LP140XP",
  "Pioneer CDJ-2000 NXS",
];

const SPECS = [
  {
    label: "cartridges",
    value: "Ortofon Concorde MkII",
    sub: "on the AT-LP140XP decks",
  },
  {
    label: "capture",
    value: "DJI Osmo Action 4",
    sub: "stream webcam",
  },
  {
    label: "signal_spectrum",
    value: "Liquid / Dancefloor / Neurofunk / Jungle",
    sub: "warm vinyl + high-res digital",
    accent: true,
  },
  {
    label: "core_mission",
    value: "Slowly growing the vinyl collection",
    sub: "community requests go to wax",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pt-8 pb-16">
      <BackdropScrim />

      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <BackLink />
        <ViewTabs active="about" />
      </div>

      <div className="grid gap-8 md:grid-cols-12 md:items-start">
        {/* visual column */}
        <div className="flex flex-col gap-3 md:col-span-5">
          <PhotoFrame />

          <div className="flex justify-between px-1 font-departure text-[0.46rem] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            <span>camera: optical_v2</span>
            <span>lens: core_prime</span>
            <span>focus: inf</span>
          </div>

          <div className="rounded-[3px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_50%,transparent)] p-4">
            <p className="mb-3 border-b border-[var(--border)] pb-2 font-departure text-[0.55rem] uppercase tracking-[0.16em] text-[var(--persimmon)]">
              [ console_telemetry_specs ]
            </p>
            <dl className="flex flex-col gap-3 text-[0.62rem]">
              <div className="flex flex-col gap-1">
                <dt className="font-departure uppercase tracking-[0.14em] text-[var(--text-dim)]">
                  rig_hardware:
                </dt>
                <dd>
                  <ul className="flex flex-col gap-0.5 font-bold text-[var(--text)]">
                    {RIG.map((item) => (
                      <li key={item} className="flex gap-1.5">
                        <span className="text-[var(--persimmon)]">›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              {SPECS.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <dt className="font-departure uppercase tracking-[0.14em] text-[var(--text-dim)]">
                    {s.label}:
                  </dt>
                  <dd
                    className={cn(
                      "font-bold",
                      "accent" in s && s.accent
                        ? "text-[var(--cyan)]"
                        : "text-[var(--text)]",
                    )}
                  >
                    {s.value}
                  </dd>
                  <dd className="text-[0.56rem] text-[var(--text-dim)]">
                    {s.sub}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* narrative column */}
        <div className="flex flex-col gap-5 md:col-span-7">
          <header className="flex flex-col gap-1">
            <span className="font-departure text-[0.55rem] uppercase tracking-[0.25em] text-[var(--persimmon)]">
              [ pilot_manifesto ]
            </span>
            <h1 className="font-departure text-lg uppercase tracking-[0.2em] text-[var(--text)] md:text-xl">
              sol // biography
            </h1>
          </header>

          <BioLog />
        </div>
      </div>

      <section className="w-full">
        <TerminalPanel label="links.socials" interactive bodyClassName="p-5 sm:p-6">
          <SocialLinks />
        </TerminalPanel>
      </section>
    </div>
  );
}
