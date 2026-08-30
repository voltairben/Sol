/**
 * Shared shape for the live stream telemetry the `/api/stream/telemetry`
 * route returns and `<SignalMonitor>` consumes.
 *
 * Only fields the Twitch Helix and Kick public APIs actually expose are here.
 * Neither platform reports encoder bitrate or FPS over a public API — those
 * would have to come from OBS itself (see scripts/obs-stream-sync.py).
 */
export type TelemetryPlatform = "TWITCH" | "KICK" | "BOTH" | "NONE";

export interface StreamTelemetry {
  /** A platform API confirmed an active broadcast. */
  is_live: boolean;
  /** Which platform(s) reported live. */
  platform: TelemetryPlatform;
  /** Combined viewer count across live platforms. */
  viewers: number;
  /** Current stream title from the live platform, or null. */
  title: string | null;
  /** ISO start time (earliest across platforms) — drives the uptime clock. */
  started_at: string | null;
  /** True once Twitch credentials are set; false = viewer counts unavailable. */
  configured: boolean;
  /** Server timestamp (ms) this snapshot was built. */
  ts: number;
}

export const OFFLINE_TELEMETRY: StreamTelemetry = {
  is_live: false,
  platform: "NONE",
  viewers: 0,
  title: null,
  started_at: null,
  configured: false,
  ts: 0,
};
