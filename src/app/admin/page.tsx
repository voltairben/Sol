import type { Metadata } from "next";
import { adminConfigured, getAdminSession } from "@/lib/admin-session";
import { createClient } from "@/lib/supabase/server";
import type { ScheduleEvent } from "@/types/database";
import { AdminLogin } from "./admin-login";
import { AdminConsole } from "./admin-console";
import { RequestQueueControl } from "./request-queue-control";
import { ScheduleManager } from "./schedule-manager";

export const metadata: Metadata = {
  title: "sol // admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!adminConfigured()) return <AdminNotConfigured />;

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
          <div className="grid gap-6 sm:grid-cols-2 sm:items-start">
            <AdminConsole initialLive={initialLive} />
            <RequestQueueControl />
          </div>
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

function AdminNotConfigured() {
  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center gap-4 px-4 py-10 font-mono">
      <p className="font-departure text-[0.7rem] uppercase tracking-[0.2em] text-[var(--persimmon)]">
        [ admin_offline // not_configured ]
      </p>
      <p className="text-[0.8rem] leading-relaxed text-[var(--text-dim)]">
        This deployment has no admin secrets. Set both in the Vercel project
        (Settings → Environment Variables), tick Production, then redeploy:
      </p>
      <ul className="flex flex-col gap-1 text-[0.78rem] text-[var(--text)]">
        <li>
          <span className="text-[var(--persimmon)]">›</span>{" "}
          <code>ADMIN_SESSION_SECRET</code> — 32+ random characters
        </li>
        <li>
          <span className="text-[var(--persimmon)]">›</span>{" "}
          <code>ADMIN_PASSCODE</code> — your login passphrase
        </li>
      </ul>
    </main>
  );
}
