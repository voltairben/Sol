import type { Metadata } from "next";
import { BackdropScrim } from "@/components/layout/backdrop-scrim";
import { BackLink } from "@/components/layout/back-link";
import { PageHeading } from "@/components/layout/page-heading";
import { ScheduleCard } from "@/components/control/schedule-card";

export const metadata: Metadata = {
  title: "schedule // SOL_DNB",
  description: "Upcoming SOL_DNB Drum & Bass broadcasts — all times in CET.",
};

export default function SchedulePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pt-8 pb-16 sm:px-6">
      <BackdropScrim />
      <BackLink />

      <PageHeading variant="schedule" />

      <ScheduleCard />
    </div>
  );
}
