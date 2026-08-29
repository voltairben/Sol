import Link from "next/link";

/** Terminal-style return affordance for secondary pages. */
export function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-departure text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-dim)] transition-colors hover:text-[var(--cyan)] focus-visible:text-[var(--cyan)] focus-visible:outline-none"
    >
      <span aria-hidden>&lt;-</span> [ return_to_deck ]
    </Link>
  );
}
