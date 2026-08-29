"use client";

import { useState, useSyncExternalStore } from "react";
import { TerminalPreloader } from "./terminal-preloader";

const noop = () => () => {};

// Reset on every full page load; survives client-side navigation within the
// same runtime. So the boot screen plays on refresh / direct visit, but not
// when you click back to "/" from another page.
let bootedThisLoad = false;

/** Fresh page load, motion allowed → play the boot screen. */
function shouldBoot(): boolean {
  try {
    if (bootedThisLoad) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Wraps the homepage. Plays the terminal boot screen on each full page load,
 * skipped on client-side navigation back to "/" and under reduced motion.
 * Content is always rendered underneath — the preloader is an opaque overlay —
 * so SSR / no-JS still get the full page.
 */
export function BootGate({ children }: { children: React.ReactNode }) {
  const wantsBoot = useSyncExternalStore(noop, shouldBoot, () => false);
  const [dismissed, setDismissed] = useState(false);
  const show = wantsBoot && !dismissed;

  const finish = () => {
    bootedThisLoad = true;
    setDismissed(true);
  };

  return (
    <>
      <div className={dismissed ? "boot-reveal" : undefined}>{children}</div>
      {show && <TerminalPreloader onComplete={finish} />}
    </>
  );
}
