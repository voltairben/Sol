"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

interface StreamTelemetry {
  bitrate: number;
  fps: number;
  droppedFrames: number;
}

interface StreamStateValue extends StreamTelemetry {
  isLive: boolean;
  /** When `is_live` last changed — ~broadcast start time while live. */
  liveSince: string | null;
  loading: boolean;
}

const ZERO_TELEMETRY: StreamTelemetry = {
  bitrate: 0,
  fps: 0,
  droppedFrames: 0,
};

const StreamStateContext = createContext<StreamStateValue>({
  isLive: false,
  liveSince: null,
  loading: true,
  ...ZERO_TELEMETRY,
});

/** Live broadcast flag + OBS encoder telemetry, shared across the deck. */
export const useStreamState = () => useContext(StreamStateContext);

type StreamRow = {
  is_live?: boolean;
  updated_at?: string;
  bitrate?: number | null;
  fps?: number | null;
  dropped_frames?: number | null;
};

function readTelemetry(row: StreamRow | null | undefined): StreamTelemetry {
  return {
    bitrate: row?.bitrate ?? 0,
    fps: row?.fps ?? 0,
    droppedFrames: row?.dropped_frames ?? 0,
  };
}

export function StreamStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLive, setIsLive] = useState(false);
  const [liveSince, setLiveSince] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<StreamTelemetry>(ZERO_TELEMETRY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase
      .from("stream_state")
      .select("is_live, updated_at, bitrate, fps, dropped_frames")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (!active) return;
        const row = data as StreamRow | null;
        setIsLive(Boolean(row?.is_live));
        setLiveSince(row?.updated_at ?? null);
        setTelemetry(readTelemetry(row));
        setLoading(false);
      });

    const channel = supabase
      .channel("stream-state")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "stream_state" },
        (payload) => {
          const row = payload.new as StreamRow;
          setIsLive(Boolean(row.is_live));
          setLiveSince(row.updated_at ?? null);
          setTelemetry(readTelemetry(row));
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const value = useMemo(
    () => ({ isLive, liveSince, loading, ...telemetry }),
    [isLive, liveSince, loading, telemetry],
  );

  return (
    <StreamStateContext.Provider value={value}>
      {children}
    </StreamStateContext.Provider>
  );
}
