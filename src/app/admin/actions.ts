"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/verify-secret";

export type AdminResult = { ok: true } | { ok: false; error?: string };

async function assertAdmin(): Promise<AdminResult | null> {
  const session = await getAdminSession();
  return session.isAdmin
    ? null
    : { ok: false, error: "session expired — reload the page" };
}

/** Verify the passcode server-side and issue the encrypted iron-session cookie. */
export async function verifyAdminPasscode(
  _prev: AdminResult,
  formData: FormData,
): Promise<AdminResult> {
  const passcode = String(formData.get("passcode") ?? "");
  const expected = process.env.ADMIN_PASSCODE;

  if (!expected || !passcode || !safeEqual(passcode, expected)) {
    return { ok: false, error: "ACCESS DENIED" };
  }

  const session = await getAdminSession();
  session.isAdmin = true;
  await session.save();
  revalidatePath("/admin");
  return { ok: true };
}

/** Flip the broadcast flag. Re-checks the admin cookie before the write. */
export async function setStreamLive(isLive: boolean): Promise<AdminResult> {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return { ok: false, error: "session expired — reload the page" };
  }

  const { error } = await createAdminClient()
    .from("stream_state")
    .update({ is_live: isLive, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  const session = await getAdminSession();
  session.destroy();
  revalidatePath("/admin");
}

// ── Self-service agenda ───────────────────────────────────────────
// Every mutation re-checks the iron-session cookie, then writes with the
// service-role client. The `schedule` table has no anon/authenticated write
// policy, so this is the only path that can change it.

const EventInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  date_string: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(120),
  details: z.string().trim().max(600),
  sort_order: z.coerce.number().int().min(0).max(9999),
});

export type EventDraft = z.input<typeof EventInput>;

/** Insert a new event, or update the one named by `input.id`. */
export async function saveScheduleEvent(
  input: EventDraft,
): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const parsed = EventInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "REQUIRED FIELD MISSING OR TOO LONG" };
  }

  const { id, details, ...rest } = parsed.data;
  const row = { ...rest, details: details ? details : null };
  const db = createAdminClient();

  const { error } = id
    ? await db.from("schedule").update(row).eq("id", id)
    : await db.from("schedule").insert(row);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { ok: true };
}

export async function deleteScheduleEvent(id: string): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const { error } = await createAdminClient()
    .from("schedule")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { ok: true };
}

export async function toggleScheduleEvent(
  id: string,
  isActive: boolean,
): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const { error } = await createAdminClient()
    .from("schedule")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { ok: true };
}
