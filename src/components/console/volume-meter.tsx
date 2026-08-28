"use client";

import { useEffect, useState } from "react";
import { synthBus } from "@/lib/synth-bus";

const BARS = 18;

/**
 * Mock waveform — CSS-animated bars, cyan with a persimmon peak zone.
 * Slams every bar to max (persimmon) for a beat when the synth fires.
 */
export function VolumeMeter({ active }: { active: boolean }) {
  const [peak, setPeak] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onHit = () => {
      setPeak(true);
      clearTimeout(t);
      t = setTimeout(() => setPeak(false), 380);
    };
    synthBus.addEventListener("hit", onHit);
    return () => {
      synthBus.removeEventListener("hit", onHit);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="flex h-6 items-end gap-[2px]" aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          className={!peak && active ? "vu-bar w-[3px]" : "w-[3px]"}
          style={{
            height: peak ? "100%" : active ? undefined : "35%",
            background:
              peak || i >= BARS - 4 ? "var(--persimmon)" : "var(--cyan)",
            transition: "height 90ms ease-out",
            animationDuration: `${0.5 + (i % 4) * 0.16}s`,
            animationDelay: `${(i % 6) * -0.14}s`,
          }}
        />
      ))}
    </div>
  );
}
