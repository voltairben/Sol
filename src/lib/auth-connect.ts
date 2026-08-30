"use client";

import { createClient } from "@/lib/supabase/client";

export type OAuthProvider = "twitch" | "discord";

/**
 * Kick off Supabase OAuth for a provider. Resolves with `{ error }` — `null`
 * on success, by which point the browser is already navigating to the provider.
 * The callback returns through `/auth/callback` on whatever origin we're on.
 */
export async function connectOAuth(
  provider: OAuthProvider,
): Promise<{ error: string | null }> {
  const redirectTo = new URL("/auth/callback", window.location.origin);
  redirectTo.searchParams.set("next", "/");
  const { error } = await createClient().auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectTo.toString() },
  });
  return { error: error?.message ?? null };
}
