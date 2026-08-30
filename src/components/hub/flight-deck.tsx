"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { togglePlayer } from "@/lib/player-store";
import { playSfx, toggleAudio } from "@/lib/sfx";
import { useT } from "@/lib/i18n";

function isTyping(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  );
}

/**
 * Global power-user keystrokes for the homepage. Ignored while typing in a
 * field or with a modifier held.
 *   K — toggle KICK / TWITCH      S — focus the track suggestion input
 *   M — toggle console audio      H — this shortcuts card
 */
export function FlightDeck() {
  const t = useT();
  const [helpOpen, setHelpOpen] = useState(false);

  const focusSuggest = useCallback(() => {
    const el = document.getElementById("track-suggest-input");
    if (el instanceof HTMLInputElement) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        setHelpOpen(false);
        return;
      }
      if (isTyping(e.target)) return;

      switch (e.key.toLowerCase()) {
        case "k":
          togglePlayer();
          playSfx("switch");
          break;
        case "s":
          e.preventDefault();
          focusSuggest();
          break;
        case "m":
          toggleAudio();
          break;
        case "h":
          setHelpOpen((v) => !v);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusSuggest]);

  const rows: [string, string][] = [
    ["K", t.sc_k],
    ["S", t.sc_s],
    ["M", t.sc_m],
    ["H", t.sc_h],
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setHelpOpen((v) => !v)}
        aria-label={t.sc_title}
        className="fixed bottom-4 right-4 z-40 hidden rounded-[2px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] px-2 py-1 font-departure text-[0.58rem] uppercase tracking-[0.16em] text-[var(--text-dim)] backdrop-blur-sm transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)] sm:block"
      >
        [ H ]
      </button>

      <AnimatePresence>
        {helpOpen && (
          <motion.div
            key="sc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setHelpOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label={t.sc_title}
              className="w-full max-w-sm rounded-[3px] border border-[color-mix(in_oklab,var(--cyan)_35%,transparent)] bg-[var(--surface)] p-5 font-mono shadow-[0_0_40px_-10px_var(--cyan)]"
            >
              <p className="font-departure text-[0.66rem] uppercase tracking-[0.2em] text-[var(--cyan)]">
                [ {t.sc_title} ]
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {rows.map(([k, label]) => (
                  <li
                    key={k}
                    className="flex items-center gap-3 text-[0.74rem] text-[var(--text-dim)]"
                  >
                    <kbd className="w-7 shrink-0 rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 text-center font-departure text-[0.62rem] text-[var(--text)]">
                      {k}
                    </kbd>
                    <span className="uppercase tracking-[0.08em]">{label}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="mt-5 w-full rounded-[2px] border border-[var(--border)] py-1.5 font-departure text-[0.6rem] uppercase tracking-[0.14em] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
              >
                {t.sc_close} [ esc ]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
