/**
 * Absolute site origin, no trailing slash. Priority:
 *   1. NEXT_PUBLIC_SITE_URL     — canonical production URL, set this on Vercel
 *   2. NEXT_PUBLIC_VERCEL_URL   — per-deployment URL Vercel injects (preview builds)
 *   3. http://localhost:3000    — local dev
 *
 * Client components may also just use `window.location.origin`, which is the
 * most reliable value on preview deployments.
 */
export function getSiteURL(): string {
  let raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "http://localhost:3000";
  if (!raw.startsWith("http")) raw = `https://${raw}`;
  return raw.replace(/\/+$/, "");
}

/** Absolute URL of the OAuth callback route, with an optional post-login path. */
export function getAuthCallbackURL(next = "/"): string {
  const url = new URL("/auth/callback", `${getSiteURL()}/`);
  if (next && next !== "/") url.searchParams.set("next", next);
  return url.toString();
}
