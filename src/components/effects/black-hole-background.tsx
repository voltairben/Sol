"use client";

import { useEffect, useRef } from "react";

const BG = "#0B0F19";
const CYAN = "#00F0FF";
const PERSIMMON = "#FF6B35";
const EMBER = "#B23B15";

interface Star {
  x: number;
  y: number;
  z: number;
  color: string;
}
interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  sprite: HTMLCanvasElement;
  s: number;
  c: number;
}

/** Pre-baked radial glow so particles never touch ctx.shadowBlur (the slow path). */
function glowSprite(color: string, r = 16): HTMLCanvasElement {
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
 * Gravitationally-lensing black hole background. One <canvas>, one rAF loop,
 * sprite-blitted particles, DPR-capped, pauses when hidden, static under
 * prefers-reduced-motion, and halves its particle/star budget once if a run of
 * frames misses 60fps.
 *
 * ponytail: main-thread rAF. Move to OffscreenCanvas + worker only if a profile
 * shows the frame budget is still blown after the adaptive downgrade.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
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
    const INNER = 92;
    const OUTER = 300;
    const TILT = 0.26; // vertical squash → an angled ring

    const sprites = {
      cyan: glowSprite(CYAN),
      persimmon: glowSprite(PERSIMMON),
      ember: glowSprite(EMBER),
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX - window.innerWidth / 2) * 0.14;
      mouse.ty = (e.clientY - window.innerHeight / 2) * 0.14;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    const stars: Star[] = Array.from({ length: small ? 90 : 150 }, () => {
      const r = Math.random();
      return {
        x: (Math.random() - 0.5) * W * 2,
        y: (Math.random() - 0.5) * H * 2,
        z: rand(200, 1200),
        color: r > 0.86 ? PERSIMMON : r > 0.72 ? CYAN : "#dfe7f2",
      };
    });

    const disk: Particle[] = Array.from({ length: small ? 130 : 240 }, () => {
      const radius = Math.pow(Math.random(), 1.6) * (OUTER - INNER) + INNER;
      const ratio = (radius - INNER) / (OUTER - INNER);
      const sprite =
        ratio < 0.28
          ? sprites.cyan
          : ratio < 0.72
            ? sprites.persimmon
            : sprites.ember;
      return {
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: (rand(0.005, 0.02) * 120) / radius, // inner particles orbit faster
        size: rand(0.6, 2.4),
        alpha: rand(0.28, 0.8),
        sprite,
        s: 0,
        c: 0,
      };
    });

    let raf = 0;
    let running = true;
    let last = performance.now();
    let slowRun = 0;
    let downgraded = false;

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

      ctx.globalAlpha = 1;
      ctx.fillStyle = reduce ? BG : "rgba(11,15,25,0.34)"; // trail-clear → smoky drift
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      const bx = cx + mouse.x;
      const by = cy + mouse.y;
      const eh = Math.min(W, H) * 0.085;
      const eh2 = eh * eh;

      // ── stars, bent by mock gravitational lensing ──────────────
      for (const st of stars) {
        if (!reduce) {
          st.z -= 1.6;
          if (st.z <= 1) {
            st.z = 1200;
            st.x = (Math.random() - 0.5) * W * 2;
            st.y = (Math.random() - 0.5) * H * 2;
          }
        }
        let px = (st.x / st.z) * W + cx;
        let py = (st.y / st.z) * H + cy;
        const dx = px - bx;
        const dy = py - by;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (dist > eh) {
          const warp = eh2 / (dist * 0.9);
          px += (dx / dist) * warp;
          py += (dy / dist) * warp;
        }
        if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
        const sz = Math.max(1, (1300 / st.z) | 0);
        ctx.globalAlpha = Math.min(1, (1200 - st.z) / 500) * 0.8;
        ctx.fillStyle = st.color;
        ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }

      // ── accretion disk — split so it wraps around the void ─────
      for (const p of disk) {
        if (!reduce) p.angle += p.speed;
        p.s = Math.sin(p.angle);
        p.c = Math.cos(p.angle);
      }
      disk.sort((a, b) => a.s * a.radius - b.s * b.radius);

      const blit = (p: Particle) => {
        const d = p.size * 5;
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(
          p.sprite,
          bx + p.c * p.radius - d / 2,
          by + p.s * p.radius * TILT - d / 2,
          d,
          d,
        );
      };

      for (const p of disk) if (p.s < 0) blit(p); // far side

      // ── singularity ──────────────────────────────────────────
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(bx, by, eh, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = CYAN; // Einstein ring
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(bx, by, eh + 0.5, 0, Math.PI * 2);
      ctx.stroke();

      const corona = ctx.createRadialGradient(bx, by, eh, bx, by, eh * 2.1);
      corona.addColorStop(0, "rgba(0,240,255,0.22)");
      corona.addColorStop(0.35, "rgba(255,107,53,0.1)");
      corona.addColorStop(1, "rgba(11,15,25,0)");
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(bx, by, eh * 2.1, 0, Math.PI * 2);
      ctx.fill();

      for (const p of disk) if (p.s >= 0) blit(p); // near side

      ctx.globalAlpha = 1;
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
      className="pointer-events-none fixed inset-0 -z-10 block h-full w-full"
    />
  );
}
