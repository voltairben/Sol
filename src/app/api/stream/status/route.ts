import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/verify-secret";

export const runtime = "nodejs";

/**
 * Machine path for toggling live state (OBS webhook / cron later).
 * Auth: `x-stream-token` header must match `STREAM_STATUS_TOKEN`.
 * Body: `{ "is_live": boolean }`.
 *
 * The human path is the `/admin` page + its server actions — separate secret.
 */
export async function POST(request: Request) {
  const token = request.headers.get("x-stream-token");
  const expected = process.env.STREAM_STATUS_TOKEN;

  if (!expected || !token || !safeEqual(token, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json body" }, { status: 400 });
  }

  const isLive = (body as { is_live?: unknown } | null)?.is_live;
  if (typeof isLive !== "boolean") {
    return NextResponse.json(
      { error: "`is_live` must be a boolean" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("stream_state")
    .update({ is_live: isLive, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
