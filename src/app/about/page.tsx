import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { PhotoFrame } from "@/components/about/photo-frame";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { SocialLinks } from "@/components/links/social-links";

export const metadata: Metadata = {
  title: "profile // SOL_DNB",
  description:
    "From sweaty Dutch club basements to a fully digital Drum & Bass command centre — the story of SOL_DNB.",
};

const BIO = [
  {
    head: "de reis",
    body: "Sol begon achter de draaitafels in de zweterige achterzaaltjes en kelderclubs van Nederland — waar het geluid niet uit een scherm kwam maar dwars door je borstkas ging. Jaren van fysieke sets, volle vloeren en directe energie hebben zijn gevoel voor timing gevormd. Toen de clubs stil vielen, bouwde hij die energie opnieuw op — dit keer als een volledig digitaal Drum & Bass commandocentrum, waar de livestream de nieuwe dansvloer is en de chat het publiek.",
  },
  {
    head: "het geluid",
    body: "Geen enkel subgenre is veilig. Van diepe, warme liquid tot beukende dancefloor, van rauwe neurofunk tot springerige jump-up — Sol beweegt binnen één set door het hele spectrum. Hij mixt klassiek vinyl, met de warme ruis van analoge platen, naast kraakheldere digitale signalen, en laat oud en nieuw naadloos in elkaar overlopen.",
  },
  {
    head: "de vibe",
    body: "Overdag staat Sol voor de klas als gymdocent. Die achtergrond — discipline, plezier, en de overtuiging dat iedereen kan groeien — zit ingebakken in elke stream. In zijn kanaal geldt één regel: absoluut respect. Positiviteit, aanmoediging en een beetje persoonlijke groei horen er net zo goed bij als de bass.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 border-t border-[var(--border)] px-4 pt-6 pb-16 sm:px-6">
      <BackdropScrim />
      <BackLink />

      <h1 className="font-departure text-xl uppercase tracking-[0.28em] text-[var(--text)]">
        profile<span className="text-[var(--text-dim)]">{" // sol_dnb"}</span>
      </h1>

      <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:items-start">
        <PhotoFrame />

        <TerminalPanel label="bio.log" bodyClassName="flex flex-col gap-6 p-5 sm:p-6">
          {BIO.map((s) => (
            <section key={s.head} className="flex flex-col gap-2">
              <h2 className="font-departure text-[0.68rem] uppercase tracking-[0.22em] text-[var(--cyan)]">
                {s.head}
              </h2>
              <p className="text-[0.92rem] leading-relaxed text-[var(--text)]">
                {s.body}
              </p>
            </section>
          ))}
        </TerminalPanel>
      </div>

      <section className="w-full">
        <TerminalPanel label="links.socials" interactive bodyClassName="p-5 sm:p-6">
          <SocialLinks size="large" />
        </TerminalPanel>
      </section>
    </div>
  );
}
