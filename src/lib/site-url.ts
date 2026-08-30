/**
 * Absolute site origin, no trailing slash.
 *
 * `NEXT_PUBLIC_SITE_URL` cannot be set on this Vercel project (team /
 * integration lock), so the production origin is hardcoded to the launch
 * subdomain below. Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  — honoured if it ever does get set
 *   2. http://localhost:3000 — local dev only
 *   3. PRODUCTION_URL        — the hardcoded fallback for every deployed build
 *
 * Client components should still prefer `window.location.origin` where they
 * can — it is always correct regardless of this value.
 */
const PRODUCTION_URL = "https://soldnb.vercel.app";

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

/** Absolute URL of the OAuth callback route, with an optional post-login path. */
export function getAuthCallbackURL(next = "/"): string {
  const url = new URL("/auth/callback", `${getSiteURL()}/`);
  if (next && next !== "/") url.searchParams.set("next", next);
  return url.toString();
}
