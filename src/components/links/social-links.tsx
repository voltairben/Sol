import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function tone(t: string) {
  return t === "persimmon"
    ? { glow: "var(--accent-persimmon-glow)", line: "var(--persimmon)" }
    : { glow: "var(--accent-blue-glow)", line: "var(--cyan)" };
}

/**
 * Sol's official channels — every item is a real external anchor
 * (target=_blank + rel=noopener,noreferrer).
 *
 * `compact` — hairline list for a sidebar.
 * `large`   — oversized high-contrast grid for a page footer.
 */
export function SocialLinks({
  size = "compact",
}: {
  size?: "compact" | "large";
}) {
  if (size === "large") {
    return (
      <ul className="grid gap-3 sm:grid-cols-3">
        {SOCIAL_LINKS.map((link) => {
          const { glow, line } = tone(link.tone);
          return (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ "--line": line, "--glow": glow } as React.CSSProperties}
                className={cn(
                  "group flex h-full flex-col gap-3 rounded-[3px] border border-[var(--border)] bg-black/20 p-5",
                  "transition-[transform,border-color,box-shadow,background-color] duration-200",
                  "hover:-translate-y-0.5 hover:border-[var(--line)] hover:bg-black/40 hover:shadow-[0_0_22px_-2px_var(--glow)]",
                  "focus-visible:-translate-y-0.5 focus-visible:border-[var(--line)] focus-visible:shadow-[0_0_22px_-2px_var(--glow)] focus-visible:outline-none",
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="font-departure text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text-dim)] transition-colors group-hover:text-[var(--line)]">
                    [ {link.tag} ]
                  </span>
                  <span className="text-[var(--line)] transition-transform group-hover:translate-x-0.5">
                    ↗
                  </span>
                </span>
                <span className="mt-auto font-mono text-[1.05rem] text-[var(--text)]">
                  {link.handle}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {SOCIAL_LINKS.map((link) => {
        const { glow, line } = tone(link.tone);
        return (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ "--glow": glow, "--line": line } as React.CSSProperties}
              className={cn(
                "group flex items-center gap-2 rounded-[2px] border border-[var(--border)] px-2.5 py-1.5",
                "font-mono text-[0.72rem] transition-[border-color,box-shadow] duration-200",
                "hover:border-[var(--line)] hover:shadow-[0_0_12px_var(--glow)]",
                "focus-visible:border-[var(--line)] focus-visible:shadow-[0_0_12px_var(--glow)] focus-visible:outline-none",
              )}
            >
              <span className="text-[var(--line)]">&gt;</span>
              <span className="font-departure text-[0.58rem] uppercase tracking-[0.1em] text-[var(--text-dim)] transition-colors group-hover:text-[var(--line)]">
                [ {link.tag} ]
              </span>
              <span className="ml-auto shrink-0 text-[var(--text-dim)] transition-colors group-hover:text-[var(--text)]">
                {link.handle}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
