"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface SessionValue {
  session: Session | null;
  /** Convenience — the auth user id, or null when logged out. */
  userId: string | null;
  /** Display name from the OAuth provider (Twitch/Discord), best effort. */
  displayName: string | null;
  loading: boolean;
}

const SessionContext = createContext<SessionValue>({
  session: null,
  userId: null,
  displayName: null,
  loading: true,
});

export const useSession = () => useContext(SessionContext);

function nameFrom(session: Session | null): string | null {
  const m = (session?.user?.user_metadata ?? {}) as Record<
    string,
    string | undefined
  >;
  return (
    m.name ??
    m.full_name ??
    m.user_name ??
    m.preferred_username ??
    session?.user?.email ??
    null
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      session,
      userId: session?.user?.id ?? null,
      displayName: nameFrom(session),
      loading,
    }),
    [session, loading],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
