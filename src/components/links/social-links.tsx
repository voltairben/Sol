import { SOCIAL_LINKS } from "@/lib/constants";
import { BRAND_ICONS } from "./brand-icons";
import { cn } from "@/lib/utils";

/**
 * Sol's official channels — each a real external anchor
 * (target=_blank + rel=noopener,noreferrer) with its platform's brand mark
 * and signature glow on hover.
 */
export function SocialLinks() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {SOCIAL_LINKS.map((link) => {
        const Icon = BRAND_ICONS[link.id];
        return (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ "--brand": link.brand } as React.CSSProperties}
              className={cn(
                "group flex h-full items-center gap-4 rounded-[3px] border border-[var(--border)] bg-black/20 p-4",
                "transition-[transform,border-color,box-shadow,background-color] duration-200",
                "hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-black/40",
                "hover:shadow-[0_0_20px_color-mix(in_oklab,var(--brand)_22%,transparent)]",
                "focus-visible:-translate-y-0.5 focus-visible:border-[var(--brand)] focus-visible:shadow-[0_0_20px_color-mix(in_oklab,var(--brand)_22%,transparent)] focus-visible:outline-none",
              )}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-md border border-[var(--border)] text-[var(--text-dim)] transition-colors group-hover:border-[var(--brand)] group-hover:text-[var(--brand)]">
                {Icon && <Icon className="size-6" />}
              </span>

              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-departure text-[0.62rem] uppercase tracking-[0.14em] text-[var(--text-dim)] transition-colors group-hover:text-[var(--brand)]">
                  [ {link.tag} ]
                </span>
                <span className="truncate font-mono text-[0.9rem] text-[var(--text)]">
                  {link.handle}
                </span>
              </span>

              <span className="ml-auto shrink-0 text-[var(--text-dim)] transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-[var(--brand)]">
                ↗
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
