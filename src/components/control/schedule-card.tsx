import { createClient } from "@/lib/supabase/server";
import type { ScheduleEvent } from "@/types/database";
import { ScheduleView } from "./schedule-view";

/** Server shell — pulls the live agenda Sol manages from /admin. */
export async function ScheduleCard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("schedule")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return <ScheduleView events={(data ?? []) as ScheduleEvent[]} />;
}
