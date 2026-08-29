"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "nl";

const KEY = "sol:lang";
const subs = new Set<() => void>();

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "nl" ? "nl" : "en";
  } catch {
    return "en";
  }
}

let current: Lang = typeof window === "undefined" ? "en" : read();

const serverSnapshot = (): Lang => "en";
const getSnapshot = (): Lang => current;

const notify = () => subs.forEach((f) => f());

// One listener for the whole app — cross-tab language changes.
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

export function setLang(next: Lang): void {
  if (next === current) return;
  current = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode */
  }
  notify();
}

/** Current UI language, synced across components and browser tabs. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}
