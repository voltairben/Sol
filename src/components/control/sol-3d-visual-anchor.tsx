"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SolLogoFallback } from "./sol-logo-fallback";

const Core3D = dynamic(
  () => import("./core-3d").then((m) => m.Core3D),
  { ssr: false, loading: () => <BiosBoot done={false} /> },
);

function BiosBoot({ done }: { done: boolean }) {
  return (
    <div className="grid aspect-square w-full place-items-center rounded-[2px] border border-dashed border-[color-mix(in_oklab,var(--persimmon)_45%,transparent)]">
      <p className="font-mono text-[0.7rem] text-[var(--text-dim)]">
        BOOTING CORE_3D.EXE...{" "}
        <span className="text-[var(--cyan)]">{done ? "[OK]" : "…"}</span>
      </p>
    </div>
  );
}

class Boundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      c.getContext("webgl2") ||
        c.getContext("webgl") ||
        c.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Lazy 3D brand ornament. Not even imported until scrolled near; renders the
 * static logo when WebGL is unavailable or the canvas throws. The box keeps a
 * fixed square aspect the whole time, so no layout shift.
 */
export function Sol3DVisualAnchor() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "canvas" | "fallback">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPhase(hasWebGL() ? "canvas" : "fallback");
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto w-full max-w-[300px]">
      {phase === "idle" && <BiosBoot done={false} />}
      {phase === "fallback" && <SolLogoFallback />}
      {phase === "canvas" && (
        <Boundary fallback={<SolLogoFallback />}>
          <div className="aspect-square w-full overflow-hidden rounded-[2px] border border-[color-mix(in_oklab,var(--persimmon)_40%,transparent)]">
            <Core3D />
          </div>
        </Boundary>
      )}
    </div>
  );
}
