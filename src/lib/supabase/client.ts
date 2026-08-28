import { createBrowserClient } from "@supabase/ssr";

// ponytail: uses the anon JWT, not the sb_publishable_ key — Realtime
// postgres_changes silently drops events for non-JWT keys. Migrate to Broadcast
// (or JWT signing keys) if/when the legacy anon key is retired.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
