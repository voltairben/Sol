"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01x";
const redact = (t: string) => t.replace(/\S/g, "#");

/** Resolves each character from random glyphs — a "decrypt" boot reveal. */
export function DecryptText({
  text,
  className,
  durationMs = 850,
}: {
  text: string;
  className?: string;
  durationMs?: number;
}) {
  const reduce = useReducedMotion();
  const [animated, setAnimated] = useState(() => redact(text));
  const raf = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const solid = Math.floor(progress * text.length);
      let s = text.slice(0, solid);
      for (let i = solid; i < text.length; i++) {
        s +=
          text[i] === " "
            ? " "
            : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "#");
      }
      setAnimated(s);
      if (progress < 1) raf.current = requestAnimationFrame(step);
      else setAnimated(text);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [text, durationMs, reduce]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{reduce ? text : animated}</span>
    </span>
  );
}
