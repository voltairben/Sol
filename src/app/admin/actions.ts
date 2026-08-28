"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/verify-secret";

export type AdminResult = { ok: true } | { ok: false; error?: string };

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
