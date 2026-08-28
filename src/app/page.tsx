import { TerminalPanel } from "@/components/ui/terminal-panel";
import { SOCIAL_LINKS } from "@/lib/constants";

/* ── wireframe placeholders (Phase 2 only) ──────────────────────── */

function Wire({ lines = 3, label }: { lines?: number; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="font-departure text-[0.62rem] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          {label}
        </p>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-2 rounded-[2px] bg-[color-mix(in_oklab,var(--text-dim)_24%,var(--surface))]"
          style={{ width: `${92 - i * 11}%` }}
        />
      ))}
    </div>
  );
}

function WireBox({
  ratio = "16 / 9",
  note,
  tone = "border",
  className = "",
}: {
  ratio?: string;
  note?: string;
  tone?: "border" | "persimmon";
  className?: string;
}) {
  return (
    <div
      className={
        "grid w-full place-items-center rounded-[2px] border border-dashed bg-[color-mix(in_oklab,var(--surface-2)_40%,transparent)] text-[0.7rem] text-[var(--text-dim)] " +
        (tone === "persimmon"
          ? "border-[color-mix(in_oklab,var(--persimmon)_55%,transparent)] "
          : "border-[var(--border)] ") +
        className
      }
      style={{ aspectRatio: ratio }}
    >
      {note ?? "▮ placeholder"}
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
      <header className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-departure text-lg uppercase tracking-[0.35em] text-[var(--text)]">
            SOL_DNB
          </span>
          <span className="hidden text-[0.7rem] text-[var(--text-dim)] sm:inline">
            {"// terminal club"}
          </span>
        </div>
        <span className="flex items-center gap-2 font-departure text-[0.7rem] uppercase tracking-[0.16em] text-[var(--persimmon)]">
          <span className="size-2 rounded-full bg-[var(--persimmon)]" />
          off air
        </span>
      </header>

      {/*
       * The deck: hero spans the top; below it three independent column stacks.
       * Columns are separate flex stacks so panel heights never bleed across
       * columns. Mobile collapses to one column, ordered hero → console/about
       * → requests → schedule/3d/links.
       */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr_0.9fr] lg:items-start">
        <div className="lg:col-span-3">
          <TerminalPanel
            label="sol.hero"
            status="ascii://sol"
            bodyClassName="grid min-h-[180px] place-items-center"
          >
            <p className="text-center font-departure text-sm leading-relaxed text-[var(--text-dim)]">
              [ ASCII SOL LOGO ]
              <br />
              metallic decrypt-on-mount hero — phase 3
            </p>
          </TerminalPanel>
        </div>

        {/* LEFT — the console */}
        <div className="order-2 flex flex-col gap-4 lg:order-none">
          <TerminalPanel
            label="stream.console"
            status="kick // twitch"
            interactive
          >
            <div className="flex flex-col gap-3">
              <WireBox note="▶ video embed — 16:9" />
              <Wire label="stream diagnostics" lines={4} />
            </div>
          </TerminalPanel>

          <TerminalPanel label="about.deck">
            <Wire
              label="netherlands → digital stream specialist"
              lines={5}
            />
          </TerminalPanel>
        </div>

        {/* CENTER — the engagement hub */}
        <div className="order-3 flex flex-col gap-4 lg:order-none">
          <TerminalPanel
            label="track.requests"
            status="realtime"
            interactive
            bodyClassName="lg:min-h-[520px]"
          >
            <div className="flex flex-col gap-3">
              <WireBox ratio="auto" note="＋ submit a track request" />
              <Wire lines={2} />
              <Wire lines={2} />
              <Wire lines={2} />
              <Wire lines={2} />
            </div>
          </TerminalPanel>
        </div>

        {/* RIGHT — the control board */}
        <div className="order-4 flex flex-col gap-4 lg:order-none">
          <TerminalPanel
            label="broadcast.schedule"
            status="live?"
            tone="persimmon"
          >
            <Wire label="upcoming sets" lines={4} />
          </TerminalPanel>

          <TerminalPanel
            label="sol.3d_visual_anchor"
            status="lazy"
            tone="persimmon"
            scanlines={false}
            bodyClassName="p-3"
          >
            <WireBox
              ratio="4 / 3"
              note="// model slot"
              tone="persimmon"
              className="mx-auto max-h-[300px]"
            />
          </TerminalPanel>

          <TerminalPanel label="links.socials" interactive>
            <ul className="flex flex-col gap-1.5 text-[0.8rem]">
              {SOCIAL_LINKS.map((l) => (
                <li key={l.label} className="flex gap-2">
                  <span className="text-[var(--cyan)]">&gt;</span>
                  <span className="text-[var(--text-dim)]">{l.label}</span>
                  <span className="text-[var(--text)]">{l.value}</span>
                </li>
              ))}
              <li className="flex gap-2">
                <span className="text-[var(--cyan)]">&gt;</span>
                <span className="text-[var(--text-dim)]">email</span>
                <span className="text-[var(--text)]">signup → resend</span>
              </li>
            </ul>
          </TerminalPanel>
        </div>
      </div>
    </div>
  );
}
