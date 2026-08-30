"use client";

import { useSyncExternalStore } from "react";

/**
 * Which stream embed is active (KICK / TWITCH). Shared so the console toggle
 * and the [ K ] flight-deck shortcut drive the same state. Persists per browser
 * (`sol:player`) and syncs across tabs. Same store shape as `lang-store`.
 */
export type Platform = "kick" | "twitch";

const KEY = "sol:player";
const subs = new Set<() => void>();

function read(): Platform {
  try {
    return localStorage.getItem(KEY) === "twitch" ? "twitch" : "kick";
  } catch {
    return "kick";
  }
}

let current: Platform = typeof window === "undefined" ? "kick" : read();

const notify = () => subs.forEach((f) => f());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      current = read();
      notify();
    }
  });
}

function subscribe(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function usePlayer(): Platform {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "kick" as Platform,
  );
}

export function setPlayer(next: Platform): void {
  if (next === current) return;
  current = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode */
  }
  notify();
}

export function togglePlayer(): void {
  setPlayer(current === "kick" ? "twitch" : "kick");
}
