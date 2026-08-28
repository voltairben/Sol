import { cn } from "@/lib/utils";

/** Glowing, breathing system text with a blinking cursor. */
export function VaporText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "vapor-text font-departure text-[0.58rem] uppercase tracking-[0.18em] text-[var(--cyan)] sm:text-[0.7rem]",
        className,
      )}
    >
      {children}
      <span className="animate-pulse">_</span>
    </p>
  );
}
