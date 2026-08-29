"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const RequestInput = z.object({
  artist: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
});

function displayNameFrom(meta: Record<string, unknown> | undefined): string {
  const m = meta ?? {};
  return String(
    m.name ?? m.full_name ?? m.user_name ?? m.preferred_username ?? "anon",
  ).slice(0, 120);
}

function avatarFrom(meta: Record<string, unknown> | undefined): string | null {
  const url = (meta ?? {}).avatar_url ?? (meta ?? {}).picture;
  return typeof url === "string" && url.startsWith("https://")
    ? url.slice(0, 500)
    : null;
}

/** Submit a new track request as the signed-in user. */
export async function submitRequest(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = RequestInput.safeParse({
    artist: formData.get("artist"),
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return { ok: false, error: "fields" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const { error } = await supabase.from("track_requests").insert({
    user_id: user.id,
    requester_name: displayNameFrom(user.user_metadata),
    avatar_url: avatarFrom(user.user_metadata),
    artist: parsed.data.artist,
    title: parsed.data.title,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  return { ok: true };
}

/** Add or remove the signed-in user's upvote on a track. */
export async function toggleUpvote(
  trackId: string,
  hasVoted: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const { error } = hasVoted
    ? await supabase
        .from("upvotes")
        .delete()
        .match({ track_id: trackId, user_id: user.id })
    : await supabase
        .from("upvotes")
        .insert({ track_id: trackId, user_id: user.id });

  // 23505 = unique_violation: the vote already exists → treat as success.
  if (error && error.code !== "23505") {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
