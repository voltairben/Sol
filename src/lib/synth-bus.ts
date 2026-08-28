/** Tiny pub/sub so a synth trigger can pulse the StreamPlayer volume meter. */
export const synthBus = new EventTarget();

export const emitSynthHit = () => synthBus.dispatchEvent(new Event("hit"));
