"use client";

import { useState, useSyncExternalStore } from "react";
import { TerminalPreloader } from "./terminal-preloader";

const KEY = "sol:booted";
const noop = () => () => {};

/** First visit of the session, motion allowed → play the boot screen. */
function shouldBoot(): boolean {
  try {
    if (sessionStorage.getItem(KEY) === "1") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Wraps the homepage. Plays the terminal boot screen once per browser session
 * on the first visit; skipped on repeat navigation and under reduced motion.
 * Content is always rendered underneath — the preloader is an opaque overlay —
 * so SSR / no-JS still get the full page.
 */
export function BootGate({ children }: { children: React.ReactNode }) {
  const wantsBoot = useSyncExternalStore(noop, shouldBoot, () => false);
  const [dismissed, setDismissed] = useState(false);
  const show = wantsBoot && !dismissed;

  const finish = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <>
      <div className={dismissed ? "boot-reveal" : undefined}>{children}</div>
      {show && <TerminalPreloader onComplete={finish} />}
    </>
  );
}
