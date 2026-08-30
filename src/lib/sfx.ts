"use client";

import { useSyncExternalStore } from "react";

/**
 * Master SFX toggle + synthesised one-shot console sounds. No audio assets —
 * every sound is built from oscillators/noise on a single shared AudioContext
 * that only starts after a user gesture (which is the only time playSfx fires).
 * Preference persists in localStorage (`sol:audio`), default off.
 */

const KEY = "sol:audio";
const subs = new Set<() => void>();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

let enabled = typeof window === "undefined" ? false : read();

const notify = () => subs.forEach((f) => f());

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      enabled = read();
      notify();
    }
  });
}

function subscribe(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

/** Is console audio feedback on? Re-renders when toggled. */
export function useAudioEnabled(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
}

export function setAudioEnabled(next: boolean): void {
  enabled = next;
  try {
    localStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    /* private mode */
  }
  notify();
}

export function toggleAudio(): void {
  setAudioEnabled(!enabled);
}

// ── Web Audio graph ───────────────────────────────────────────
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx || !master) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return { ctx, master };
  } catch {
    return null;
  }
}

function noise(ctx: AudioContext, dur: number): AudioBufferSourceNode {
  const n = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  return src;
}

export type SfxName =
  | "keyClick"
  | "switch"
  | "powerHum"
  | "nav"
  | "outbound";

const VOICES: Record<SfxName, (ctx: AudioContext, dest: AudioNode) => void> = {
  // low-frequency mechanical key-click — request submit / upvote
  keyClick: (ctx, dest) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.05);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.08);

    const tick = noise(ctx, 0.02);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2200;
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(0.25, t);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    tick.connect(hp);
    hp.connect(tg);
    tg.connect(dest);
    tick.start(t);
    tick.stop(t + 0.03);
  },

  // soft hi-fi switch — KICK / TWITCH toggle
  switch: (ctx, dest) => {
    const t = ctx.currentTime;
    for (const { f, at } of [
      { f: 880, at: 0 },
      { f: 1320, at: 0.028 },
    ]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t + at);
      g.gain.setValueAtTime(0.0001, t + at);
      g.gain.exponentialRampToValueAtTime(0.32, t + at + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.045);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + at);
      osc.stop(t + at + 0.06);
    }
  },

  // short futuristic sweep-click — menu links / page transitions
  nav: (ctx, dest) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(1500, t + 0.07);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.26, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.1);

    const tick = noise(ctx, 0.015);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3000;
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(0.16, t);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
    tick.connect(hp);
    hp.connect(tg);
    tg.connect(dest);
    tick.start(t);
    tick.stop(t + 0.02);
  },

  // outbound transmission — a quick descending double-click + faint carrier
  outbound: (ctx, dest) => {
    const t = ctx.currentTime;
    for (const { f, at } of [
      { f: 720, at: 0 },
      { f: 480, at: 0.05 },
    ]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(f, t + at);
      g.gain.setValueAtTime(0.0001, t + at);
      g.gain.exponentialRampToValueAtTime(0.2, t + at + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.04);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + at);
      osc.stop(t + at + 0.05);
    }
    const carrier = ctx.createOscillator();
    const cg = ctx.createGain();
    carrier.type = "sine";
    carrier.frequency.setValueAtTime(1046, t);
    cg.gain.setValueAtTime(0.0001, t);
    cg.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    carrier.connect(cg);
    cg.connect(dest);
    carrier.start(t);
    carrier.stop(t + 0.14);
  },

  // analog power hum + glitch click — boot sequence complete
  powerHum: (ctx, dest) => {
    const t = ctx.currentTime;
    for (const [f, peak] of [
      [55, 0.4],
      [110.3, 0.12],
    ] as const) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      osc.connect(g);
      g.connect(dest);
      osc.start(t);
      osc.stop(t + 0.45);
    }
    const click = noise(ctx, 0.03);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 2;
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.0001, t + 0.14);
    cg.gain.exponentialRampToValueAtTime(0.3, t + 0.15);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    click.connect(bp);
    bp.connect(cg);
    cg.connect(dest);
    click.start(t + 0.14);
    click.stop(t + 0.22);
  },
};

/** Play a console SFX. No-op when audio is off or Web Audio is unavailable. */
export function playSfx(name: SfxName): void {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  try {
    VOICES[name](a.ctx, a.master);
  } catch {
    /* ignore */
  }
}
