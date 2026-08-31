import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { PrivacyManifest } from "@/components/privacy/privacy-manifest";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description:
    "Hoe het SOL_DNB-portal met je gegevens omgaat — privacy-first: geen tracking, alleen essentiële state, embeds van derden geblokkeerd tot je toestemming geeft. Beschikbaar in het Nederlands en Engels.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pt-8 pb-16">
      <BackdropScrim />

      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <BackLink />
      </div>

      <PrivacyManifest />
    </div>
  );
}
