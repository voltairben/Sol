import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Sol's official channels — every item is a real external anchor
 * (target=_blank + rel=noopener,noreferrer). Hairline border resting,
 * sharp cyan / persimmon glow on hover + focus.
 */
export function SocialLinks() {
  return (
    <ul className="flex flex-col gap-1.5">
      {SOCIAL_LINKS.map((link) => {
        const glow =
          link.tone === "persimmon"
            ? "var(--accent-persimmon-glow)"
            : "var(--accent-blue-glow)";
        const line =
          link.tone === "persimmon"
            ? "var(--persimmon)"
            : "var(--cyan)";
        return (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={
                {
                  "--glow": glow,
                  "--line": line,
                } as React.CSSProperties
              }
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
