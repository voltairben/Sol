/**
 * Supabase connection values, with hardcoded fallbacks.
 *
 * The Vercel env UI / the Supabase↔Vercel integration won't let us set or
 * correct `NEXT_PUBLIC_SUPABASE_*` on this project, so we can't rely on them:
 *
 *   - URL  — the env value is used only if it's a real `*.supabase.co` origin,
 *            otherwise the fallback (a past integration once injected the
 *            dashboard URL here).
 *   - ANON — the env value is used only if it's a JWT (`eyJ…`). The integration
 *            may inject the newer `sb_publishable_…` key, which silently drops
 *            every Realtime `postgres_changes` event — so anything that isn't a
 *            JWT is rejected in favour of the fallback.
 *
 * Both are public by design: the anon key ships in every client bundle already,
 * and RLS is the actual security boundary. The `service_role` key is NOT here —
 * it stays environment-only (`SUPABASE_SERVICE_ROLE_KEY`).
 *
 * ponytail: fallback JWT is the legacy anon key (valid until ~late 2026).
 * Migrate to Broadcast-from-DB or JWT signing keys before it's retired.
 */

const FALLBACK_URL = "https://qbpeohijqxtldoncjaui.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGVvaGlqcXh0bGRvbmNqYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTYxNTYsImV4cCI6MjEwMTU5MjE1Nn0.WFGnaQ2Kc8wb3r0z6VCKXiC3flcBVdgXkFyWehimm3M";

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
export const SUPABASE_URL =
  envUrl && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(envUrl)
    ? envUrl.replace(/\/+$/, "")
    : FALLBACK_URL;

const envAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
export const SUPABASE_ANON_KEY =
  envAnon && envAnon.startsWith("eyJ") ? envAnon : FALLBACK_ANON_KEY;
