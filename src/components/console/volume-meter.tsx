"use client";

const BARS = 18;

/** Mock waveform — CSS-animated bars, cyan with a persimmon peak zone. */
export function VolumeMeter({ active }: { active: boolean }) {
  return (
    <div className="flex h-6 items-end gap-[2px]" aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          className={active ? "vu-bar w-[3px]" : "w-[3px]"}
          style={{
            height: active ? undefined : "35%",
            background: i >= BARS - 4 ? "var(--persimmon)" : "var(--cyan)",
            animationDuration: `${0.5 + (i % 4) * 0.16}s`,
            animationDelay: `${(i % 6) * -0.14}s`,
          }}
        />
      ))}
    </div>
  );
}
