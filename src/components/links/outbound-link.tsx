"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { playSfx } from "@/lib/sfx";

/** External `<a>` that plays the "outbound transmission" SFX on click. */
export function OutboundLink({
  onClick,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        playSfx("outbound");
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
