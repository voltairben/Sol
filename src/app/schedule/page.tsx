import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { ScheduleCard } from "@/components/control/schedule-card";

export const metadata: Metadata = {
  title: "schedule // SOL_DNB",
  description: "Upcoming SOL_DNB Drum & Bass broadcasts — all times in CET.",
};

export default function SchedulePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 border-t border-[var(--border)] px-4 pt-6 pb-16 sm:px-6">
      <BackdropScrim />
      <BackLink />

      <h1 className="font-departure text-xl uppercase tracking-[0.28em] text-[var(--text)]">
        schedule<span className="text-[var(--text-dim)]">{" // broadcasts"}</span>
      </h1>

      <ScheduleCard />
    </div>
  );
}
