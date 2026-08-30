"use server";

import { createHash } from "node:crypto";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/verify-secret";

// TEMP diagnostic — remove after the admin-login issue is resolved.
function shape(label: string, v: string | undefined) {
  if (v == null) return `${label}: <unset>`;
  const sha8 = createHash("sha256").update(v).digest("hex").slice(0, 8);
  const wrap =
    (/^["' ]/.test(v) ? "L" : "") + (/["' ]$/.test(v) ? "T" : "") || "-";
  return `${label}: len=${v.length} sha8=${sha8} edges=${wrap}`;
}

export type AdminResult = { ok: true } | { ok: false; error?: string };

async function assertAdmin(): Promise<AdminResult | null> {
  const session = await getAdminSession();
  return session.isAdmin
    ? null
    : { ok: false, error: "session expired — reload the page" };
}

const isUuid = (v: unknown): v is string =>
  z.string().uuid().safeParse(v).success;

/** Verify the passcode server-side and issue the encrypted iron-session cookie. */
export async function verifyAdminPasscode(
  _prev: AdminResult,
  formData: FormData,
): Promise<AdminResult> {
  const passcode = String(formData.get("passcode") ?? "");
  const expected = process.env.ADMIN_PASSCODE;

  const match = Boolean(expected && passcode && safeEqual(passcode, expected));
  console.warn(
    `[admin-login] ${shape("typed", passcode)} | ${shape("env", expected)} | ` +
      `secret_len=${process.env.ADMIN_SESSION_SECRET?.length ?? 0} match=${match}`,
  );

  if (!match) {
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
  details: z.string().trim().max(600).optional().default(""),
});

export type EventDraft = z.input<typeof EventInput>;

/** Turn the first Zod issue into a message that names the field and the problem. */
function fieldError(error: z.ZodError): string {
  const i = error.issues[0];
  const field = String(i?.path[0] ?? "input").replaceAll("_", " ");
  let why = "is invalid";
  if (i?.code === "too_small") why = "is required";
  else if (i?.code === "too_big") why = `is too long (max ${i.maximum})`;
  return `${field} ${why}`.toUpperCase();
}

/** Insert a new event (appended to the end), or update the one named by `id`. */
export async function saveScheduleEvent(
  input: EventDraft,
): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const parsed = EventInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: fieldError(parsed.error) };
  }

  const { id, details, ...rest } = parsed.data;
  const fields = { ...rest, details: details ? details : null };
  const db = createAdminClient();

  if (id) {
    const { error } = await db.from("schedule").update(fields).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data: last } = await db
      .from("schedule")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const next = ((last?.sort_order as number | undefined) ?? -1) + 1;
    const { error } = await db
      .from("schedule")
      .insert({ ...fields, sort_order: next });
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { ok: true };
}

// ponytail: renumbers every row on each reorder — trivial for a schedule of a
// handful of events. Swap for a two-row sort_order swap if it ever grows large.
export async function reorderScheduleEvent(
  id: string,
  dir: "up" | "down",
): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;
  if (!isUuid(id) || (dir !== "up" && dir !== "down")) {
    return { ok: false, error: "bad request" };
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("schedule")
    .select("id")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) return { ok: false, error: error.message };

  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return { ok: true };

  [ids[i], ids[j]] = [ids[j], ids[i]];

  for (let k = 0; k < ids.length; k++) {
    const { error: e } = await db
      .from("schedule")
      .update({ sort_order: k })
      .eq("id", ids[k]);
    if (e) return { ok: false, error: e.message };
  }

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { ok: true };
}

export async function deleteScheduleEvent(id: string): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;
  if (!isUuid(id)) return { ok: false, error: "bad request" };

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
  if (!isUuid(id)) return { ok: false, error: "bad request" };

  const { error } = await createAdminClient()
    .from("schedule")
    .update({ is_active: Boolean(isActive) })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { ok: true };
}

/** Flag the currently-running broadcast. Clears the flag on every other row. */
export async function setScheduleEventLive(
  id: string,
  isLive: boolean,
): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;
  if (!isUuid(id)) return { ok: false, error: "bad request" };

  const db = createAdminClient();
  // one LIVE row at a time — clear the rest first
  if (isLive) {
    const { error: clearErr } = await db
      .from("schedule")
      .update({ is_live: false })
      .neq("id", id);
    if (clearErr) return { ok: false, error: clearErr.message };
  }

  const { error } = await db
    .from("schedule")
    .update({ is_live: Boolean(isLive) })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/schedule");
  return { ok: true };
}

// ── Track request queue ──────────────────────────────────────────

/**
 * Wipe every track request. `upvotes` has `on delete cascade`, so the votes
 * go with them. Active homepage boards empty in realtime (one postgres_changes
 * DELETE per row); revalidatePath covers fresh loads.
 */
export async function clearTrackRequests(): Promise<AdminResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  // `id is not null` matches every row (id is the primary key).
  const { error } = await createAdminClient()
    .from("track_requests")
    .delete()
    .not("id", "is", null);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}
