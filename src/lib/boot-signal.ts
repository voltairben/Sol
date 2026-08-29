/**
 * Coordinates the boot preloader (home page only) with the WebGL black-hole
 * background (mounted in the root layout, so it's alive on every route). The
 * background holds off compiling shaders and starting its rAF loop until the
 * preloader is on its way out, so a page load isn't hit with both GPU
 * workloads at once.
 *
 * State is module-level — it resets on every full page load, so the preloader
 * plays on each refresh but never on a client-side navigation.
 */

const EVENT = "sol-boot-complete";

// Decided once per full page load, the first time anything asks: does the
// boot screen play this runtime? Only when the entry route is "/" and motion
// is allowed.
let armed: boolean | null = null;
let done = false;

function isArmed(): boolean {
  if (armed === null) {
    try {
      armed =
        typeof window !== "undefined" &&
        window.location.pathname === "/" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      armed = false;
    }
  }
  return armed;
}

/** Is the boot screen expected on screen right now? */
export function bootPending(): boolean {
  return isArmed() && !done;
}

/** The preloader calls this as it starts fading out. */
export function markBootComplete(): void {
  if (done) return;
  done = true;
  try {
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

/**
 * Run `cb` once the boot screen is gone — immediately if there's no boot
 * screen this load. Returns a cleanup that removes the pending listener.
 */
export function whenBootComplete(cb: () => void): () => void {
  if (!bootPending()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}
