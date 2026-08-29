"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { markBootComplete } from "@/lib/boot-signal";

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  radialSpeed: number;
  size: number;
  color: string;
  alpha: number;
}

const BOOT_STAGES = [
  "INITIALIZING SYSTEM COGNITION...",
  "CONNECTING TO SUPABASE TRANSMISSION GRID...",
  "STABILIZING GARGANTUA QUANTUM SINGULARITY...",
  "CALIBRATING WEB AUDIO OSCILLATORS...",
  "LOADING COCKPIT COMMAND DECK VECTORS...",
  "BOOT SEQUENCE SUCCESSFUL. INJECTING INTERACTION...",
];

const PALETTE = [
  "rgba(0, 240, 255, ", // cyan
  "rgba(255, 107, 53, ", // persimmon
  "rgba(139, 92, 246, ", // transition purple
];

/** Cinematic boot screen — a black-hole vortex + monospace boot diagnostics. */
export function TerminalPreloader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  const stage = Math.min(
    Math.floor((progress / 100) * BOOT_STAGES.length),
    BOOT_STAGES.length - 1,
  );

  // ── progress simulation (~1.5s to full) ───────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(prev + Math.floor(Math.random() * 7) + 4, 100);
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  // ── hand off once the bar fills (~2.4s total) ─────────────────
  useEffect(() => {
    if (progress < 100) return;
    const hold = window.setTimeout(() => {
      setFading(true);
      // let the WebGL background compile + warm up behind the fade
      markBootComplete();
    }, 380);
    const done = window.setTimeout(onComplete, 900);
    return () => {
      clearTimeout(hold);
      clearTimeout(done);
    };
  }, [progress, onComplete]);

  // ── vortex particle field ─────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const count = window.innerWidth < 768 ? 160 : 320;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const span = Math.max(window.innerWidth, window.innerHeight);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * span * 0.6 + 30;
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: (0.015 + Math.random() * 0.02) * (120 / (radius + 20)),
        radialSpeed: 0.8 + Math.random() * 1.5,
        size: Math.random() * 1.8 + 0.6,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    const draw = () => {
      // motion-blur trail
      ctx.fillStyle = "rgba(11, 15, 25, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const rHorizon = window.innerWidth < 768 ? 45 : 70;

      const halo = ctx.createRadialGradient(
        cx,
        cy,
        rHorizon,
        cx,
        cy,
        rHorizon * 2.8,
      );
      halo.addColorStop(0, "rgba(0, 240, 255, 0.12)");
      halo.addColorStop(0.3, "rgba(255, 107, 53, 0.06)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, rHorizon * 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx, cy, rHorizon, 0, Math.PI * 2);
      ctx.fill();

      for (const p of particles) {
        p.angle -= p.speed;
        p.radius -= p.radialSpeed * (1 + (rHorizon * 1.5) / (p.radius + 1));

        if (p.radius <= rHorizon + 2) {
          p.radius = span * 0.5 + Math.random() * 100;
          p.angle = Math.random() * Math.PI * 2;
          p.alpha = Math.random() * 0.8 + 0.2;
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        ctx.beginPath();
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const BAR = 20;
  const filled = Math.floor((progress / 100) * BAR);
  const bar = "█".repeat(filled) + "░".repeat(BAR - filled);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading SOL_DNB"
      className={`fixed inset-0 z-50 flex select-none flex-col items-center justify-center bg-[#0B0F19] font-mono transition-all duration-500 ${
        fading ? "pointer-events-none scale-105 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 mx-4 flex w-full max-w-sm flex-col items-center gap-8 rounded-[6px] border border-[var(--border)] bg-black/40 p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="relative size-28 [animation-duration:3s] animate-pulse [filter:drop-shadow(0_0_20px_color-mix(in_oklab,var(--cyan)_25%,transparent))]">
          <Image
            src="/sol-logo.png"
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full space-y-3">
          <div className="animate-pulse text-[10px] tracking-[0.18em] text-[var(--cyan)]">
            {BOOT_STAGES[stage]}
          </div>

          <div className="text-sm font-bold tracking-widest text-[var(--text-dim)]">
            {bar}
          </div>

          <div className="rounded-[3px] border border-[color-mix(in_oklab,var(--persimmon)_20%,transparent)] bg-[color-mix(in_oklab,var(--persimmon)_10%,transparent)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--persimmon)]">
            [ STAGE COMPLETE // {100 - progress}% REMAINING ]
          </div>
        </div>

        <div className="text-[9px] tracking-widest text-[var(--text-dim)]/60">
          SYS_INIT: COGNITIVE_SEQUENCE_STABLE // BUILD_STABLE
        </div>
      </div>
    </div>
  );
}
