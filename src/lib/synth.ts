/**
 * Native Web Audio synth — three DnB-flavoured one-shot voices, no assets.
 * `createSynth()` is inert until `play()` (which needs a user gesture to
 * create / resume the AudioContext).
 */

export type SynthPreset = "sub" | "rise" | "ping";

export const SYNTH_PRESETS: { id: SynthPreset; label: string }[] = [
  { id: "sub", label: "01_SUB_DROP" },
  { id: "rise", label: "02_CYBER_RISE" },
  { id: "ping", label: "03_PING_ALERT" },
];

type AudioCtor = typeof AudioContext;

export function createSynth() {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;

  function ensure(): AudioContext {
    if (!ctx) {
      const AC: AudioCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: AudioCtor })
          .webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  function play(preset: SynthPreset) {
    const ac = ensure();
    const out = master!;
    const t = ac.currentTime;

    if (preset === "sub") {
      // sine 55Hz (low A) → lowpass sweep 150→40Hz, exp gain decay to ~0 over 1s
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, t);

      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(150, t);
      lp.frequency.linearRampToValueAtTime(40, t + 0.8);

      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.95, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);

      osc.connect(lp).connect(g).connect(out);
      osc.start(t);
      osc.stop(t + 1.1);
      return;
    }

    if (preset === "rise") {
      // saw 110→440Hz over 1.2s + a decaying feedback delay for spacey echoes
      const osc = ac.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.linearRampToValueAtTime(440, t + 1.2);

      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.26, t + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);

      const delay = ac.createDelay(0.5);
      delay.delayTime.value = 0.17;
      const fb = ac.createGain();
      fb.gain.setValueAtTime(0.34, t);
      fb.gain.linearRampToValueAtTime(0, t + 2.4); // kill the loop so nodes free
      const wet = ac.createGain();
      wet.gain.value = 0.4;

      osc.connect(g);
      g.connect(out);
      g.connect(delay);
      delay.connect(fb).connect(delay);
      delay.connect(wet).connect(out);

      osc.start(t);
      osc.stop(t + 1.5);
      return;
    }

    // ping: triangle 880Hz chirp, exp decay over 0.15s
    const osc = ac.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, t);

    const g = ac.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  return {
    play,
    dispose() {
      void ctx?.close();
      ctx = null;
      master = null;
    },
  };
}

export type Synth = ReturnType<typeof createSynth>;
