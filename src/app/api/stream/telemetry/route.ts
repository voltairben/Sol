import { NextResponse } from "next/server";
import { CHANNELS } from "@/lib/constants";
import {
  OFFLINE_TELEMETRY,
  type StreamTelemetry,
  type TelemetryPlatform,
} from "@/lib/stream-telemetry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live viewer / uptime / title readout for the console signal monitor.
 *
 * Twitch: Client-Credentials app token → Helix /streams.
 * Kick:   best-effort public channel API — Cloudflare 403s it from serverless
 *         often enough that a blocked fetch is treated as "offline", not an error.
 *
 * Bitrate / FPS are deliberately absent: no public API on either platform
 * reports them. If Sol wants encoder stats, OBS can POST them separately.
 */

const TWITCH_LOGIN = CHANNELS.twitch; // sol_dnb1
const KICK_SLUG = CHANNELS.kick.toLowerCase(); // sol_dnb
const FETCH_TIMEOUT = 4000;
const CACHE_TTL = 30_000;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

interface PlatformSnapshot {
  isLive: boolean;
  viewers: number;
  title: string;
  startedAt: string | null;
}
const OFFLINE: PlatformSnapshot = {
  isLive: false,
  viewers: 0,
  title: "",
  startedAt: null,
};

// ── Twitch ────────────────────────────────────────────────────────────
let twitchToken: { value: string; expiresAt: number } | null = null;

async function getTwitchToken(
  id: string,
  secret: string,
): Promise<string | null> {
  if (twitchToken && Date.now() < twitchToken.expiresAt) return twitchToken.value;
  try {
    const res = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: id,
        client_secret: secret,
        grant_type: "client_credentials",
      }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!json.access_token) return null;
    twitchToken = {
      value: json.access_token,
      // refresh a minute early
      expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000 - 60_000,
    };
    return json.access_token;
  } catch {
    return null;
  }
}

async function fetchTwitch(): Promise<PlatformSnapshot> {
  const id = process.env.TWITCH_CLIENT_ID?.trim();
  const secret = process.env.TWITCH_CLIENT_SECRET?.trim();
  if (!id || !secret) return OFFLINE;

  try {
    const token = await getTwitchToken(id, secret);
    if (!token) return OFFLINE;

    const res = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(TWITCH_LOGIN)}`,
      {
        headers: { "Client-Id": id, Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
        cache: "no-store",
      },
    );
    if (res.status === 401) twitchToken = null; // force refresh next call
    if (!res.ok) return OFFLINE;

    const json = (await res.json()) as {
      data?: Array<{
        type?: string;
        viewer_count?: number;
        title?: string;
        started_at?: string;
      }>;
    };
    const stream = json.data?.[0];
    if (!stream || stream.type !== "live") return OFFLINE;

    return {
      isLive: true,
      viewers: stream.viewer_count ?? 0,
      title: stream.title?.trim() ?? "",
      startedAt: stream.started_at ?? null,
    };
  } catch {
    return OFFLINE;
  }
}

// ── Kick ──────────────────────────────────────────────────────────────
async function fetchKick(): Promise<PlatformSnapshot> {
  try {
    const res = await fetch(
      `https://kick.com/api/v2/channels/${encodeURIComponent(KICK_SLUG)}`,
      {
        headers: { accept: "application/json", "user-agent": UA },
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
        cache: "no-store",
      },
    );
    // Cloudflare challenge pages come back 200 with an HTML body.
    if (!res.ok || !res.headers.get("content-type")?.includes("json")) {
      return OFFLINE;
    }
    const json = (await res.json()) as {
      livestream?: {
        is_live?: boolean;
        viewer_count?: number;
        session_title?: string;
        start_time?: string;
        created_at?: string;
      } | null;
    };
    const ls = json.livestream;
    if (!ls || ls.is_live === false) return OFFLINE;

    return {
      isLive: true,
      viewers: ls.viewer_count ?? 0,
      title: ls.session_title?.trim() ?? "",
      startedAt: ls.start_time ?? ls.created_at ?? null,
    };
  } catch {
    return OFFLINE;
  }
}

// ── aggregate + cache ─────────────────────────────────────────────────
// ponytail: per-instance memory cache. Fluid Compute reuses instances so it
// mostly holds; the s-maxage response header is the real cross-instance shield.
let cache: { data: StreamTelemetry; at: number } | null = null;

async function buildTelemetry(): Promise<StreamTelemetry> {
  const configured = Boolean(
    process.env.TWITCH_CLIENT_ID?.trim() &&
      process.env.TWITCH_CLIENT_SECRET?.trim(),
  );

  const [twitch, kick] = await Promise.all([fetchTwitch(), fetchKick()]);

  const is_live = twitch.isLive || kick.isLive;
  const platform: TelemetryPlatform =
    twitch.isLive && kick.isLive
      ? "BOTH"
      : twitch.isLive
        ? "TWITCH"
        : kick.isLive
          ? "KICK"
          : "NONE";

  const starts = [twitch.startedAt, kick.startedAt].filter(
    (v): v is string => Boolean(v),
  );

  return {
    is_live,
    platform,
    viewers: twitch.viewers + kick.viewers,
    title: twitch.isLive
      ? twitch.title || null
      : kick.isLive
        ? kick.title || null
        : null,
    started_at: starts.length ? starts.sort()[0] : null,
    configured,
    ts: Date.now(),
  };
}

export async function GET() {
  const now = Date.now();
  if (!cache || now - cache.at >= CACHE_TTL) {
    try {
      cache = { data: await buildTelemetry(), at: now };
    } catch {
      cache = { data: { ...OFFLINE_TELEMETRY, ts: now }, at: now };
    }
  }
  return NextResponse.json(cache.data, {
    headers: {
      "cache-control": "public, s-maxage=30, stale-while-revalidate=30",
    },
  });
}
