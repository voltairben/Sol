"use client";

import { createClient } from "@/lib/supabase/client";

export type OAuthProvider = "twitch" | "discord";

/**
 * Kick off Supabase OAuth for a provider. Resolves with `{ error }` — `null`
 * on success, by which point the browser is already navigating to the provider.
 *
 * `redirectTo` is `<current origin>/auth/callback` with no query string, so it
 * matches a plain Supabase redirect-URL allow-list entry exactly. The callback
 * route defaults the post-login destination to "/".
 */
export async function connectOAuth(
  provider: OAuthProvider,
): Promise<{ error: string | null }> {
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await createClient().auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  return { error: error?.message ?? null };
}
