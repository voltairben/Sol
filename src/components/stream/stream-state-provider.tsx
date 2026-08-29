"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StreamStateValue {
  isLive: boolean;
  /** When `is_live` last changed — ~broadcast start time while live. */
  liveSince: string | null;
  loading: boolean;
}

const StreamStateContext = createContext<StreamStateValue>({
  isLive: false,
  liveSince: null,
  loading: true,
});

/** Live broadcast flag, shared by the header chip, live banner, schedule. */
export const useStreamState = () => useContext(StreamStateContext);

export function StreamStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLive, setIsLive] = useState(false);
  const [liveSince, setLiveSince] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase
      .from("stream_state")
      .select("is_live, updated_at")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setIsLive(Boolean(data?.is_live));
        setLiveSince((data?.updated_at as string | undefined) ?? null);
        setLoading(false);
      });

    const channel = supabase
      .channel("stream-state")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "stream_state" },
        (payload) => {
          const row = payload.new as {
            is_live?: boolean;
            updated_at?: string;
          };
          setIsLive(Boolean(row.is_live));
          setLiveSince(row.updated_at ?? null);
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <StreamStateContext.Provider value={{ isLive, liveSince, loading }}>
      {children}
    </StreamStateContext.Provider>
  );
}
