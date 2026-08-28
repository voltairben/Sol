"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { createSynth, SYNTH_PRESETS, type SynthPreset } from "@/lib/synth";
import { emitSynthHit } from "@/lib/synth-bus";
import { SolLogoFallback } from "./sol-logo-fallback";
import type { HitState } from "./core-3d";

const Core3D = dynamic(() => import("./core-3d").then((m) => m.Core3D), {
  ssr: false,
  loading: () => <BiosBoot />,
});

function BiosBoot() {
  return (
    <div className="grid aspect-square w-full place-items-center rounded-[2px] border border-dashed border-[color-mix(in_oklab,var(--persimmon)_45%,transparent)]">
      <p className="font-mono text-[0.7rem] text-[var(--text-dim)]">
        BOOTING CORE_3D.EXE... <span className="text-[var(--cyan)]">…</span>
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
 * Lazy 3D brand ornament, re-cast as a tactile cyber-synth: pointer-down on the
 * deck triggers a native Web Audio voice + a reactive pulse on the wireframe
 * core, and pings the StreamPlayer VU meter. IO-gated so `three` isn't in the
 * initial bundle; static logo fallback when WebGL is missing / the canvas throws.
 */
export function Sol3DVisualAnchor() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "canvas" | "fallback">("idle");
  const [preset, setPreset] = useState<SynthPreset>("sub");

  const synthRef = useRef<ReturnType<typeof createSynth> | null>(null);
  const hitRef = useRef<HitState>({ at: 0 });

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
    return () => {
      io.disconnect();
      synthRef.current?.dispose();
    };
  }, []);

  function trigger(p: SynthPreset) {
    synthRef.current ??= createSynth();
    synthRef.current.play(p);
    hitRef.current.at = performance.now();
    emitSynthHit();
  }

  return (
    <div ref={ref} className="mx-auto w-full max-w-[300px]">
      {phase === "idle" && <BiosBoot />}
      {phase === "fallback" && <SolLogoFallback />}

      {phase === "canvas" && (
        <div className="flex flex-col gap-2">
          <div
            role="button"
            tabIndex={0}
            aria-label="Play synth"
            onPointerDown={() => trigger(preset)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") trigger(preset);
            }}
            className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-[3px] border-2 border-[var(--cyan)] shadow-[inset_0_0_0_1px_var(--persimmon),0_0_26px_-6px_var(--cyan),0_0_34px_-10px_var(--persimmon)] transition-shadow active:shadow-[inset_0_0_0_1px_var(--cyan),0_0_38px_-4px_var(--persimmon),0_0_48px_-8px_var(--cyan)]"
          >
            <span className="pointer-events-none absolute left-2 top-2 z-10 font-departure text-[0.52rem] uppercase tracking-[0.12em] text-[var(--cyan)] drop-shadow-[0_0_6px_var(--cyan)]">
              [ touch deck to play ]
            </span>
            <Boundary fallback={<SolLogoFallback />}>
              <Core3D hitRef={hitRef} />
            </Boundary>
          </div>

          <div className="flex gap-1.5">
            {SYNTH_PRESETS.map((pr) => (
              <button
                key={pr.id}
                type="button"
                onClick={() => {
                  setPreset(pr.id);
                  trigger(pr.id);
                }}
                data-active={preset === pr.id}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-[2px] border px-0.5 py-1 text-center font-departure text-[0.44rem] uppercase tracking-[0.02em] transition-colors",
                  "border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)]",
                  "data-[active=true]:border-[var(--persimmon)] data-[active=true]:text-[var(--persimmon)]",
                )}
              >
                [ {pr.label} ]
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
