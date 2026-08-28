"use client";

import { useEffect, useRef } from "react";

const BG = "#0B0F19";
const VOID = "#05070B";
const CYAN = "#00F0FF";
const PERSIMMON = "#FF6B35";
const TILT = (-15 * Math.PI) / 180;

interface Particle {
  angle: number;
  distance: number;
  size: number;
  z: number;
  sprite: HTMLCanvasElement;
}
interface Star {
  x: number;
  y: number;
  size: number;
  a: number;
  da: number;
}

/** Pre-baked radial glow so disk particles never touch ctx.shadowBlur. */
function glowSprite(color: string, r = 18): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = cv.height = r * 2;
  const g = cv.getContext("2d")!;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, color);
  grad.addColorStop(0.4, `${color}aa`);
  grad.addColorStop(1, `${color}00`);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(r, r, r, 0, Math.PI * 2);
  g.fill();
  return cv;
}

/**
 * Supermassive lensing black hole. One <canvas>, one rAF loop. Sized to the
 * viewport so the disk blooms past the columns; solid blazing accretion ring
 * (white-hot → cyan → persimmon) tilted -15°. DPR-capped, sprite-blitted,
 * pauses when hidden, static under prefers-reduced-motion, and — once it drops
 * a run of frames — halves its budget AND renders at ~30fps to spare the panel
 * backdrop-blur.
 */
export function BlackHoleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);
    };
    resize();

    const small = Math.min(W, H) < 640;
    const base = () => Math.min(W, H);
    const innerR = () => base() * (small ? 0.15 : 0.12); // singularity radius
    const ringR = () => base() * (small ? 0.2 : 0.165); // ring centreline

    const sprites = {
      cyan: glowSprite(CYAN),
      persimmon: glowSprite(PERSIMMON),
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX - window.innerWidth / 2) * 0.05;
      mouse.ty = (e.clientY - window.innerHeight / 2) * 0.05;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    const maxDist = Math.max(W, H) * 0.72;
    const disk: Particle[] = Array.from(
      { length: small ? 150 : 260 },
      () => {
        const distance =
          Math.pow(Math.random(), 0.8) * (maxDist - innerR() * 1.5) +
          innerR() * 1.5;
        return {
          angle: Math.random() * Math.PI * 2,
          distance,
          size: rand(0.5, 2.2),
          z: rand(0.6, 2.2),
          sprite: Math.random() > 0.42 ? sprites.cyan : sprites.persimmon,
        };
      },
    );

    const stars: Star[] = Array.from({ length: small ? 90 : 150 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: rand(0.3, 1.4),
      a: Math.random(),
      da: rand(0.004, 0.014),
    }));

    let raf = 0;
    let running = true;
    let last = performance.now();
    let slowRun = 0;
    let downgraded = false;
    let tick = 0;

    const frame = (now: number) => {
      if (!downgraded) {
        if (now - last > 22) slowRun++;
        else slowRun = Math.max(0, slowRun - 1);
        if (slowRun > 60) {
          disk.length = Math.max(40, disk.length >> 1);
          stars.length = Math.max(30, stars.length >> 1);
          downgraded = true;
        }
      }
      last = now;
      tick++;

      // downgraded → render every other frame (~30fps) to ease the backdrop-blur
      if (!downgraded || tick % 2 === 0) {
        const cx = W / 2 + (mouse.x += (mouse.tx - mouse.x) * 0.05);
        const cy = H / 2 + (mouse.y += (mouse.ty - mouse.y) * 0.05);
        const inner = innerR();
        const ring = ringR();

        ctx.globalAlpha = 1;
        ctx.fillStyle = reduce ? BG : "rgba(11,15,25,0.3)"; // trail-clear → light trails
        ctx.fillRect(0, 0, W, H);

        // ── stars: twinkle + gravitational pull ──
        ctx.fillStyle = "#dbe6f5";
        for (const s of stars) {
          if (!reduce) {
            s.a += s.da;
            if (s.a > 1 || s.a < 0) s.da = -s.da;
          }
          const dx = cx - s.x;
          const dy = cy - s.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          let px = s.x;
          let py = s.y;
          if (d > 40) {
            const f = ((inner * 0.9) / d) * 2;
            px += (dx / d) * f;
            py += (dy / d) * f;
          }
          ctx.globalAlpha = Math.abs(s.a) * 0.55;
          ctx.fillRect(px, py, s.size, s.size);
        }

        // ── accretion disk (blooms to the viewport edges), tilted ellipse ──
        const ctil = Math.cos(TILT);
        const stil = Math.sin(TILT);
        for (const p of disk) {
          if (!reduce) p.angle -= (0.0016 * 150) / p.distance; // outer = slower
          const rx = Math.cos(p.angle) * p.distance;
          const ry = Math.sin(p.angle) * p.distance * 0.22;
          const x = cx + rx * ctil - ry * stil;
          const y = cy + rx * stil + ry * ctil;
          if (x < -30 || x > W + 30 || y < -30 || y > H + 30) continue;
          const a = Math.min(0.85, p.distance / (inner * 1.6) - 0.12);
          if (a <= 0) continue;
          const dd = p.size * p.z * 5;
          ctx.globalAlpha = a;
          ctx.drawImage(p.sprite, x - dd / 2, y - dd / 2, dd, dd);
        }

        // ── colossal halo bloom ──
        ctx.globalAlpha = 1;
        const haloR = ring + base() * 0.5;
        const halo = ctx.createRadialGradient(
          cx,
          cy,
          inner * 0.6,
          cx,
          cy,
          haloR,
        );
        halo.addColorStop(0, "rgba(0,240,255,0.5)");
        halo.addColorStop(0.12, "rgba(0,240,255,0.26)");
        halo.addColorStop(0.4, "rgba(255,107,53,0.12)");
        halo.addColorStop(1, "rgba(11,15,25,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
        ctx.fill();

        // ── solid blazing ring — tilted + flattened ──
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(TILT);
        ctx.scale(1, 0.22);
        const rg = ctx.createRadialGradient(0, 0, inner, 0, 0, ring * 1.4);
        rg.addColorStop(0, "rgba(255,255,255,1)");
        rg.addColorStop(0.16, "rgba(0,240,255,0.95)");
        rg.addColorStop(0.55, "rgba(255,107,53,0.82)");
        rg.addColorStop(1, "rgba(255,107,53,0)");
        ctx.lineWidth = base() * 0.06;
        ctx.strokeStyle = rg;
        ctx.shadowBlur = 40;
        ctx.shadowColor = CYAN;
        ctx.beginPath();
        ctx.arc(0, 0, ring, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.shadowBlur = 0;

        // ── the singularity ──
        ctx.globalAlpha = 1;
        ctx.fillStyle = VOID;
        ctx.beginPath();
        ctx.arc(cx, cy, inner, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,240,255,0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, inner, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (running && !reduce) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduce) {
        cancelAnimationFrame(raf);
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ background: BG }}
      className="pointer-events-none fixed inset-0 -z-10 block h-full w-full"
    />
  );
}
