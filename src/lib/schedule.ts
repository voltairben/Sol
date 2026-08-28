import type { StreamSlot } from "@/types/database";

// SOL_DNB broadcasts from the Netherlands — show all times in his timezone
// with an explicit label, so SSR and client render identically.
const DAY_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  weekday: "short",
  day: "2-digit",
  month: "short",
});
const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** ISO timestamp 3h ago — sets slot still count as "now / next". */
export function scheduleWindowStart(): string {
  return new Date(Date.now() - 3 * 3_600_000).toISOString();
}

export function formatSlot(slot: StreamSlot): {
  day: string;
  time: string;
  duration: string | null;
} {
  const start = new Date(slot.starts_at);
  const hours = slot.ends_at
    ? Math.round((Date.parse(slot.ends_at) - start.getTime()) / 3_600_000)
    : null;
  return {
    day: DAY_FMT.format(start).toUpperCase(),
    time: TIME_FMT.format(start),
    duration: hours && hours > 0 ? `${hours}h` : null,
  };
}
