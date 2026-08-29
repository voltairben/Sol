import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { ViewTabs } from "@/components/layout/view-tabs";
import { ScheduleCard } from "@/components/control/schedule-card";

export const metadata: Metadata = {
  title: "schedule // SOL_DNB",
  description: "Upcoming SOL_DNB Drum & Bass broadcasts — all times in CET.",
};

export default function SchedulePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pt-8 pb-16">
      <BackdropScrim />

      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <BackLink />
        <ViewTabs active="schedule" />
      </div>

      <header className="flex flex-col gap-1">
        <span className="font-departure text-[0.55rem] uppercase tracking-[0.25em] text-[var(--persimmon)]">
          [ transmission_log ]
        </span>
        <h1 className="font-departure text-lg uppercase tracking-[0.2em] text-[var(--text)] md:text-xl">
          broadcast // schedule
        </h1>
      </header>

      <ScheduleCard />
    </div>
  );
}
