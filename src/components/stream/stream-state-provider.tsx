"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StreamStateValue {
  isLive: boolean;
  loading: boolean;
}

const StreamStateContext = createContext<StreamStateValue>({
  isLive: false,
  loading: true,
});

/** Live broadcast flag, shared by the header chip and the schedule card. */
export const useStreamState = () => useContext(StreamStateContext);

export function StreamStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase
      .from("stream_state")
      .select("is_live")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setIsLive(Boolean(data?.is_live));
        setLoading(false);
      });

    const channel = supabase
      .channel("stream-state")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "stream_state" },
        (payload) =>
          setIsLive(Boolean((payload.new as { is_live?: boolean }).is_live)),
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <StreamStateContext.Provider value={{ isLive, loading }}>
      {children}
    </StreamStateContext.Provider>
  );
}
