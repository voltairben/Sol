"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, requireAdmin } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/verify-secret";

export type PasscodeState = { ok: boolean; error?: string };

/** Verify the `/admin` passcode server-side and issue the encrypted session cookie. */
export async function verifyAdminPasscode(
  _prev: PasscodeState,
  formData: FormData,
): Promise<PasscodeState> {
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

/** Toggle live state. Re-checks the admin cookie before the service-role write. */
export async function setStreamLive(isLive: boolean): Promise<void> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("stream_state")
    .update({ is_live: isLive, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function logoutAdmin(): Promise<void> {
  const session = await getAdminSession();
  session.destroy();
  revalidatePath("/admin");
}
