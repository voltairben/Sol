"use client";

import { useSyncExternalStore } from "react";

/**
 * `granted` — the viewer authorised the external Kick/Twitch feed (which sets
 * its own third-party cookies). `local` — run the site without the embedded
 * player. `null` — not chosen yet; the feed stays blocked until it is.
 *
 * The choice is made in the boot preloader (or the stream placeholder / footer)
 * and mirrors `sol-consent` in localStorage. Same store shape as `lang-store`.
 */
export type Consent = "granted" | "local";

const KEY = "sol_consent";
const subs = new Set<() => void>();

function read(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "local" ? v : null;
  } catch {
    return null;
  }
}

let current: Consent | null = typeof window === "undefined" ? null : read();

const getSnapshot = (): Consent | null => current;
const serverSnapshot = (): Consent | null => null;
const notify = () => subs.forEach((f) => f());

// One listener for the whole app — cross-tab consent changes.
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

/** Current consent choice; `null` until the viewer decides. */
export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}

export function setConsent(next: Consent): void {
  current = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode — choice lasts for this page only */
  }
  notify();
}

/** Footer "[ COOKIES ]" reset — clears the choice so the boot gate asks again. */
export function clearConsent(): void {
  current = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  notify();
}
