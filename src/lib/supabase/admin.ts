import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Service-role Supabase client — bypasses RLS. Server-only.
 * Used exclusively by gated paths: the admin server actions and
 * `POST /api/stream/status`. Never import this into a Client Component.
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
