/**
 * Reading-page scrim: sits over the fixed black-hole canvas (same -z-10 layer,
 * painted later in the DOM) so bio / schedule panels read cleanly. The home
 * deck omits it — there the black hole is the hero.
 */
export function BackdropScrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-[color-mix(in_oklab,var(--bg)_72%,transparent)]"
    />
  );
}
