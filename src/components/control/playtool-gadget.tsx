"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { SYNTH_VOICES, type SynthVoice } from "@/lib/synth";

// Canvas 2D can't read CSS vars — keep the scope colour literal.
const SCOPE_LINE = "#00f0ff";
const SCOPE_IDLE = "rgba(0, 240, 255, 0.38)";

function accentOf(voice: SynthVoice) {
  return voice.tone === "persimmon" ? "var(--persimmon)" : "var(--cyan)";
}

/**
 * Playtool — a native Web Audio one-shot synth. Four DnB voices, each a
 * reactive geometric node; a live oscilloscope traces the output waveform.
 * The AudioContext is created on first press (browsers require a gesture)
 * and closed on unmount.
 */
export function PlaytoolGadget() {
  const t = useT();
  const [active, setActive] = useState<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const play = useCallback((voice: SynthVoice) => {
    let ctx = ctxRef.current;
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
    }
    if (ctx.state === "suspended") void ctx.resume();

    voice.trigger(ctx, analyserRef.current as AnalyserNode);
    setActive(voice.id);
    window.setTimeout(
      () => setActive((cur) => (cur === voice.id ? null : cur)),
      320,
    );
  }, []);

  // ── oscilloscope ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c2d = canvas.getContext("2d");
    if (!c2d) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const buf = new Uint8Array(128);
    let raf = 0;

    const size = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    size();
    window.addEventListener("resize", size);

    const frame = () => {
      const w = canvas.width;
      const h = canvas.height;
      c2d.clearRect(0, 0, w, h);
      const analyser = analyserRef.current;

      if (analyser) {
        analyser.getByteTimeDomainData(buf);
        c2d.lineWidth = 1.5 * dpr;
        c2d.strokeStyle = SCOPE_LINE;
        c2d.beginPath();
        const slice = w / buf.length;
        for (let i = 0; i < buf.length; i++) {
          const y = (buf[i] / 128) * (h / 2);
          if (i === 0) c2d.moveTo(0, y);
          else c2d.lineTo(i * slice, y);
        }
        c2d.stroke();
      } else {
        // rest state — a faint reference grid + centre baseline
        c2d.lineWidth = dpr;
        c2d.strokeStyle = "rgba(0, 240, 255, 0.08)";
        c2d.beginPath();
        for (let gx = 0; gx <= 4; gx++) {
          const x = (w / 4) * gx;
          c2d.moveTo(x, 0);
          c2d.lineTo(x, h);
        }
        c2d.moveTo(0, h / 4);
        c2d.lineTo(w, h / 4);
        c2d.moveTo(0, (h * 3) / 4);
        c2d.lineTo(w, (h * 3) / 4);
        c2d.stroke();

        c2d.lineWidth = 1.5 * dpr;
        c2d.strokeStyle = SCOPE_IDLE;
        c2d.beginPath();
        c2d.moveTo(0, h / 2);
        c2d.lineTo(w, h / 2);
        c2d.stroke();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  // release the AudioContext when the gadget leaves the page
  useEffect(() => () => void ctxRef.current?.close(), []);

  return (
    <div className="terminal-panel mx-auto w-full max-w-2xl gap-6 p-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <span className="font-departure text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-dim)]">
          [ device: playtool_synth_v2 ]
        </span>
        <span className="size-2 animate-pulse rounded-full bg-[var(--cyan)]" />
      </div>

      {/* oscilloscope */}
      <div className="relative h-24 overflow-hidden rounded-[2px] border border-[var(--border)] bg-black/60">
        <canvas ref={canvasRef} className="h-full w-full" />
        <span className="absolute left-2 top-1.5 font-departure text-[0.5rem] uppercase tracking-[0.22em] text-[var(--cyan)]/60">
          {t.pt_waveform}
        </span>
      </div>

      {/* geometric voice nodes */}
      <div className="grid grid-cols-2 gap-4">
        {SYNTH_VOICES.map((voice) => {
          const on = active === voice.id;
          const accent = accentOf(voice);
          return (
            <button
              key={voice.id}
              type="button"
              onPointerDown={() => play(voice)}
              aria-label={voice.label}
              style={
                on
                  ? {
                      borderColor: accent,
                      boxShadow: `0 0 18px -4px ${accent}`,
                    }
                  : undefined
              }
              className={cn(
                "group relative flex h-40 flex-col items-center justify-center gap-3 rounded-[3px] border bg-black/25 p-5 transition-[background-color,border-color,box-shadow] duration-300",
                "hover:bg-black/40 focus-visible:outline-none",
                on
                  ? "bg-black/45"
                  : "border-[var(--border)] hover:border-[color-mix(in_oklab,var(--text)_28%,transparent)]",
              )}
            >
              <VoiceShape shape={voice.shape} accent={accent} active={on} />
              <span className="font-departure text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--text)]">
                {voice.label}
              </span>
              <span className="text-[0.58rem] text-[var(--text-dim)]">
                {(t as Record<string, string>)[`pt_desc_${voice.id}`] ??
                  voice.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VoiceShape({
  shape,
  accent,
  active,
}: {
  shape: SynthVoice["shape"];
  accent: string;
  active: boolean;
}) {
  const stroke = active ? accent : "var(--text-dim)";
  const fill = active ? `color-mix(in oklab, ${accent} 12%, transparent)` : "none";
  const cls = cn(
    "size-11 transition-transform duration-300",
    active && "scale-125",
  );

  if (shape === "circle") {
    return (
      <span
        className={cn(cls, "rounded-full border-2")}
        style={{ borderColor: stroke, background: fill }}
      />
    );
  }
  if (shape === "vector-grid") {
    return (
      <span
        className={cn(cls, "grid grid-cols-2 gap-1", active && "rotate-45")}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="border transition-colors"
            style={{ borderColor: stroke, background: fill }}
          />
        ))}
      </span>
    );
  }

  const points =
    shape === "triangle"
      ? "50,14 14,86 86,86"
      : "50,8 86,29 86,71 50,92 14,71 14,29"; // hexagon
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(cls, active && shape === "triangle" && "rotate-180", active && shape === "hexagon" && "rotate-90")}
      style={{ stroke, fill }}
      strokeWidth={2}
      aria-hidden
    >
      <polygon points={points} />
    </svg>
  );
}
