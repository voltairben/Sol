import { cn } from "@/lib/utils";

/**
 * Ambient decorative beams — winding SVG paths with a light pulse travelling
 * along each (pure CSS `stroke-dashoffset`, GPU-cheap). Fixed, click-through,
 * behind everything. Kept at very low opacity so it never fights the cards.
 */

const PATHS = [
  "M-5 20 C 20 5, 35 55, 55 35 S 90 10, 110 30",
  "M-5 45 C 15 60, 40 25, 60 50 S 95 75, 110 55",
  "M-5 70 C 25 85, 45 50, 68 72 S 90 95, 110 78",
  "M-5 8 C 30 25, 50 -5, 72 18 S 95 40, 110 22",
  "M-5 88 C 20 70, 45 100, 65 82 S 95 60, 110 82",
  "M-5 33 C 25 45, 55 15, 78 38 S 100 60, 110 42",
];

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.09]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="beam-cyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00F0FF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#00F0FF" />
            <stop offset="1" stopColor="#00F0FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-persimmon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FF6B35" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FF6B35" />
            <stop offset="1" stopColor="#FF6B35" stopOpacity="0" />
          </linearGradient>
        </defs>
        {PATHS.map((d, i) => (
          <path
            key={d}
            d={d}
            stroke={i % 2 ? "url(#beam-persimmon)" : "url(#beam-cyan)"}
            strokeWidth={i % 2 ? 0.5 : 0.4}
            strokeLinecap="round"
            className="beam-drift"
            style={{
              animationDuration: `${16 + i * 3}s`,
              animationDelay: `${i * -2.5}s`,
            }}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
