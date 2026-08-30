import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeEqual } from "@/lib/verify-secret";

export const runtime = "nodejs";

/**
 * Machine path for toggling live state + pushing OBS encoder telemetry.
 * Auth: `x-stream-token` header must match `STREAM_STATUS_TOKEN`.
 * Body: `{ "is_live": boolean, "bitrate"?, "fps"?, "dropped_frames"? }`.
 * Telemetry is stored while live and zeroed the moment `is_live` is false.
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

  const payload = (body ?? {}) as {
    is_live?: unknown;
    bitrate?: unknown;
    fps?: unknown;
    dropped_frames?: unknown;
  };

  const isLive = payload.is_live;
  if (typeof isLive !== "boolean") {
    return NextResponse.json(
      { error: "`is_live` must be a boolean" },
      { status: 400 },
    );
  }

  // Encoder telemetry (OBS). Optional; only meaningful while live. Anything
  // non-finite / negative / absurd collapses to 0 rather than erroring.
  const clampInt = (v: unknown, max: number): number => {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(Math.round(n), max);
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("stream_state")
    .update({
      is_live: isLive,
      bitrate: isLive ? clampInt(payload.bitrate, 100_000) : 0,
      fps: isLive ? clampInt(payload.fps, 500) : 0,
      dropped_frames: isLive ? clampInt(payload.dropped_frames, 2_000_000_000) : 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
