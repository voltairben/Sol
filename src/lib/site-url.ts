/**
 * Absolute site origin, no trailing slash. Used **server-side only** — for
 * `metadataBase`, robots.txt and sitemap.xml. `NEXT_PUBLIC_SITE_URL` can't be
 * set on this Vercel project, so the production origin is hardcoded.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  — honoured if it ever does get set
 *   2. http://localhost:3000 — local dev only
 *   3. PRODUCTION_URL        — the hardcoded fallback for every deployed build
 *
 * Client-side redirects (OAuth) do NOT use this — they use
 * `window.location.origin`, which is always the live host (see `auth-connect`).
 */
const PRODUCTION_URL = "https://soldnb.com";

function normalize(raw: string): string {
  const withProto = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProto.replace(/\/+$/, "");
}

export function getSiteURL(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalize(explicit);
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return PRODUCTION_URL;
}
