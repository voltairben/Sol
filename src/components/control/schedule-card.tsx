import { createClient } from "@/lib/supabase/server";
import { scheduleWindowStart } from "@/lib/schedule";
import type { StreamSlot } from "@/types/database";
import { ScheduleView } from "./schedule-view";

export async function ScheduleCard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stream_schedule")
    .select("*")
    .gte("starts_at", scheduleWindowStart())
    .order("starts_at", { ascending: true })
    .limit(5);

  return <ScheduleView slots={(data ?? []) as StreamSlot[]} />;
}
