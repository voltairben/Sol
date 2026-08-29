import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { PageHeading } from "@/components/layout/page-heading";
import { PhotoFrame } from "@/components/about/photo-frame";
import { BioLog } from "@/components/about/bio-log";
import { TerminalPanel } from "@/components/ui/terminal-panel";
import { SocialLinks } from "@/components/links/social-links";

export const metadata: Metadata = {
  title: "profile // SOL_DNB",
  description:
    "From club circuits across the south of the Netherlands to a vinyl-driven livestream — the story of SOL_DNB.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pt-8 pb-16 sm:px-6">
      <BackdropScrim />
      <BackLink />

      <PageHeading variant="about" />

      <div className="grid gap-8 md:grid-cols-[18rem_1fr] md:items-start">
        <PhotoFrame />

        <TerminalPanel label="bio.log" bodyClassName="p-5 sm:p-6">
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
