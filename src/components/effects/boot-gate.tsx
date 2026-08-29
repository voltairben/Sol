"use client";

import { useState, useSyncExternalStore } from "react";
import { bootPending } from "@/lib/boot-signal";
import { TerminalPreloader } from "./terminal-preloader";

const noop = () => () => {};

/**
 * Wraps the homepage. Plays the terminal boot screen on each full page load,
 * skipped on client-side navigation back to "/" and under reduced motion.
 * Content is always rendered underneath — the preloader is an opaque overlay —
 * so SSR / no-JS still get the full page.
 */
export function BootGate({ children }: { children: React.ReactNode }) {
  const wantsBoot = useSyncExternalStore(noop, bootPending, () => false);
  const [dismissed, setDismissed] = useState(false);
  const show = wantsBoot && !dismissed;

  return (
    <>
      <div className={dismissed ? "boot-reveal" : undefined}>{children}</div>
      {show && <TerminalPreloader onComplete={() => setDismissed(true)} />}
    </>
  );
}
