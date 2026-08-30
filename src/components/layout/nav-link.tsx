"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { playSfx } from "@/lib/sfx";

/** Drop-in `next/link` that plays the console nav SFX on click. */
export function NavLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        playSfx("nav");
        onClick?.(e);
      }}
    />
  );
}
