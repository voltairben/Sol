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

function subscribe(cb: () => void): () => void {
  subs.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = read();
      subs.forEach((f) => f());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    subs.delete(cb);
    window.removeEventListener("storage", onStorage);
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
  subs.forEach((f) => f());
}

/** Current UI language, synced across components and browser tabs. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}
