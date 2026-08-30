import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { PrivacyManifest } from "@/components/privacy/privacy-manifest";

export const metadata: Metadata = {
  title: "privacy // SOL_DNB",
  description:
    "How the SOL_DNB portal handles data — privacy-first by design: no tracking, essential state only, third-party embeds blocked until you consent. Available in English and Dutch.",
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
