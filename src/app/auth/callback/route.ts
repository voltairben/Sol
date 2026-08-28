import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Only relative in-app paths are allowed as the post-login destination. */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

/**
 * OAuth (Twitch / Discord) redirect target — the PKCE `code` exchange.
 *
 * The redirect origin is rebuilt from the proxy headers so preview and
 * production deployments land on the request's own host (Vercel terminates TLS
 * upstream, so `request.url` would otherwise read `http://` on the internal
 * hop). Locally it falls back to the request origin.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const origin =
    process.env.NODE_ENV === "development" || !forwardedHost
      ? url.origin
      : `${forwardedProto}://${forwardedHost}`;

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?reason=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
