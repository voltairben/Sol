import type { Metadata } from "next";
import { getAdminSession } from "@/lib/admin-session";
import { createClient } from "@/lib/supabase/server";
import { AdminLogin } from "./admin-login";
import { AdminConsole } from "./admin-console";

export const metadata: Metadata = {
  title: "sol // admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAdminSession();

  let initialLive = false;
  if (session.isAdmin) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("stream_state")
      .select("is_live")
      .eq("id", 1)
      .single();
    initialLive = Boolean(data?.is_live);
  }

  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-md flex-col justify-center gap-5 px-4 py-10">
      <div className="flex items-center gap-2 font-departure text-[0.7rem] uppercase tracking-[0.22em] text-[var(--text-dim)]">
        <span className="text-[var(--persimmon)]">▪</span> sol.control
      </div>
      {session.isAdmin ? (
        <AdminConsole initialLive={initialLive} />
      ) : (
        <AdminLogin />
      )}
    </main>
  );
}
