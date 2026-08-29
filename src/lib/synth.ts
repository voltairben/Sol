/**
 * Native Web Audio synth voices — four DnB-flavoured one-shots, no assets.
 * Each `trigger` builds its graph from the passed `ctx` and connects to `dest`
 * (an AnalyserNode in the Playtool, so the oscilloscope sees the output).
 * The caller owns the AudioContext and its lifecycle / user-gesture resume.
 */

export type SynthShape = "circle" | "hexagon" | "triangle" | "vector-grid";
export type SynthTone = "cyan" | "persimmon";

export interface SynthVoice {
  id: string;
  label: string;
  description: string;
  shape: SynthShape;
  tone: SynthTone;
  trigger: (ctx: AudioContext, dest: AudioNode) => void;
}

export const SYNTH_VOICES: SynthVoice[] = [
  {
    id: "sub_drop",
    label: "SUB-BASS DROP",
    description: "Deep 80→30Hz sub rumble",
    shape: "circle",
    tone: "cyan",
    trigger: (ctx, dest) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(dest);

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    },
  },
  {
    id: "wobble",
    label: "D&B WOBBLE",
    description: "LFO-modulated heavy square",
    shape: "hexagon",
    tone: "persimmon",
    trigger: (ctx, dest) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.connect(gain);
      gain.connect(dest);

      osc.type = "square";
      osc.frequency.setValueAtTime(65, ctx.currentTime);

      lfo.type = "sine";
      lfo.frequency.setValueAtTime(6.5, ctx.currentTime); // 6.5 Hz wobble
      lfoGain.gain.setValueAtTime(25, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);

      lfo.start();
      osc.start();
      lfo.stop(ctx.currentTime + 1.1);
      osc.stop(ctx.currentTime + 1.1);
    },
  },
  {
    id: "sweep",
    label: "FILTER SWEEP",
    description: "Sawtooth bandpass sweep",
    shape: "triangle",
    tone: "cyan",
    trigger: (ctx, dest) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, ctx.currentTime);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.8);
      filter.Q.setValueAtTime(5, ctx.currentTime);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);

      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    },
  },
  {
    id: "riser",
    label: "STELLAR RISER",
    description: "Ascending cosmic sweep",
    shape: "vector-grid",
    tone: "persimmon",
    trigger: (ctx, dest) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(dest);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.6);

      osc.start();
      osc.stop(ctx.currentTime + 1.7);
    },
  },
];
