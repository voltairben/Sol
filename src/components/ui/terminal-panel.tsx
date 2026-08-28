import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "persimmon";

interface TerminalPanelProps extends React.ComponentProps<"section"> {
  /** Titlebar label. Rendered in Departure Mono, uppercase, tracked. */
  label?: string;
  /** Right-aligned status text in the titlebar (e.g. "LIVE", "LOCKED"). */
  status?: React.ReactNode;
  /** Glow colour. cyan = interactive zones, persimmon = status / locked zones. */
  tone?: Tone;
  /** Adds a hover glow (use for panels the viewer acts on). */
  interactive?: boolean;
  bodyClassName?: string;
}

/**
 * The shared container for every card on the deck: thin monospaced border,
 * Departure Mono titlebar, and a glow on hover / focus-within. The CRT
 * scanline texture is applied globally via `<body class="crt">`.
 */
export function TerminalPanel({
  label,
  status,
  tone = "cyan",
  interactive = false,
  className,
  bodyClassName,
  children,
  ...props
}: TerminalPanelProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "terminal-panel",
        interactive && "is-interactive",
        className,
      )}
      {...props}
    >
      {label != null && (
        <header className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-1.5">
          <span
            aria-hidden
            className="text-[0.7rem] leading-none text-[var(--panel-tone)]"
          >
            ▪
          </span>
          <h2 className="font-departure text-[0.7rem] uppercase tracking-[0.22em] text-[var(--text-dim)]">
            {label}
          </h2>
          {status != null && (
            <span className="ml-auto font-departure text-[0.7rem] uppercase tracking-[0.16em] text-[var(--panel-tone)]">
              {status}
            </span>
          )}
        </header>
      )}
      <div className={cn("relative flex-1 p-4", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}
