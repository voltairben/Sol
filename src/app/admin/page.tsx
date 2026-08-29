import type { Metadata } from "next";
import { getAdminSession } from "@/lib/admin-session";
import { createClient } from "@/lib/supabase/server";
import type { ScheduleEvent } from "@/types/database";
import { AdminLogin } from "./admin-login";
import { AdminConsole } from "./admin-console";
import { ScheduleManager } from "./schedule-manager";

export const metadata: Metadata = {
  title: "sol // admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAdminSession();

  let initialLive = false;
  let events: ScheduleEvent[] = [];

  if (session.isAdmin) {
    const supabase = await createClient();
    const [liveRes, schedRes] = await Promise.all([
      supabase.from("stream_state").select("is_live").eq("id", 1).single(),
      supabase
        .from("schedule")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);
    initialLive = Boolean(liveRes.data?.is_live);
    events = (schedRes.data ?? []) as ScheduleEvent[];
  }

  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center gap-2 font-departure text-[0.7rem] uppercase tracking-[0.22em] text-[var(--text-dim)]">
        <span className="text-[var(--persimmon)]">▪</span> sol.control
      </div>

      {session.isAdmin ? (
        <>
          <AdminConsole initialLive={initialLive} />
          <ScheduleManager initialEvents={events} />
        </>
      ) : (
        <div className="mx-auto w-full max-w-md">
          <AdminLogin />
        </div>
      )}
    </main>
  );
}
