"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ScheduleEvent } from "@/types/database";
import {
  saveScheduleEvent,
  deleteScheduleEvent,
  toggleScheduleEvent,
  reorderScheduleEvent,
} from "./actions";

const EMPTY = { title: "", date_string: "", location: "", details: "" };
type FormState = typeof EMPTY;

export function ScheduleManager({
  initialEvents,
}: {
  initialEvents: ScheduleEvent[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const res = await saveScheduleEvent({ id: editId ?? undefined, ...form });
    setBusy(false);
    if (res.ok) {
      setForm(EMPTY);
      setStatus(editId ? "EVENT_UPDATED" : "EVENT_LOGGED_TO_GRID");
      setEditId(null);
      router.refresh();
    } else {
      setStatus(`ERROR: ${res.error ?? "unknown"}`);
    }
  }

  function startEdit(evt: ScheduleEvent) {
    setEditId(evt.id);
    setForm({
      title: evt.title,
      date_string: evt.date_string,
      location: evt.location,
      details: evt.details ?? "",
    });
    setStatus("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY);
    setStatus("");
  }

  async function run(fn: () => Promise<{ ok: boolean; error?: string }>, ok: string) {
    setBusy(true);
    const res = await fn();
    setBusy(false);
    setStatus(res.ok ? ok : `ERROR: ${res.error ?? "?"}`);
    if (res.ok) router.refresh();
  }

  async function remove(id: string) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    setConfirmId(null);
    await run(() => deleteScheduleEvent(id), "EVENT_PURGED_FROM_GRID");
  }

  return (
    <section className="grid gap-5 rounded-[3px] border border-[var(--border)] bg-[var(--surface)] p-4 lg:grid-cols-2">
      {/* ── editor ─────────────────────────────────────────── */}
      <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3">
        <h2 className="font-departure text-[0.68rem] uppercase tracking-[0.2em] text-[var(--persimmon)]">
          [ {editId ? "edit agenda event" : "add agenda event"} ]
        </h2>

        <Field
          label="event title *"
          value={form.title}
          onChange={(v) => set("title", v)}
          placeholder="Tuesday Vinyl Session"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="date string *"
            value={form.date_string}
            onChange={(v) => set("date_string", v)}
            placeholder="TUESDAYS @ 19:00 CET"
          />
          <Field
            label="stream / location *"
            value={form.location}
            onChange={(v) => set("location", v)}
            placeholder="KICK / TWITCH LIVE"
          />
        </div>
        <label className="flex flex-col gap-1">
          <span className="font-departure text-[0.55rem] uppercase tracking-[0.16em] text-[var(--text-dim)]">
            details
          </span>
          <textarea
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="Deep vinyl rollers, requests open, heavy neuro to close."
            className="resize-none rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[0.82rem] text-[var(--text)] outline-none focus:border-[var(--cyan)]"
          />
        </label>
        <p className="text-[0.58rem] text-[var(--text-dim)]">
          new events are added to the bottom — reorder with ↑ ↓ in the list.
        </p>

        {status && (
          <p
            className={cn(
              "rounded-[2px] border px-2 py-1.5 font-mono text-[0.62rem]",
              status.startsWith("ERROR")
                ? "border-[color-mix(in_oklab,var(--persimmon)_40%,transparent)] text-[var(--persimmon)]"
                : "border-[color-mix(in_oklab,var(--cyan)_35%,transparent)] text-[var(--cyan)]",
            )}
          >
            SYSTEM_LOG: {status}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="flex-1 rounded-[2px] border border-[var(--persimmon)] bg-[color-mix(in_oklab,var(--persimmon)_12%,transparent)] px-3 py-2 font-departure text-[0.68rem] uppercase tracking-[0.16em] text-[var(--persimmon)] transition-colors hover:bg-[color-mix(in_oklab,var(--persimmon)_22%,transparent)] disabled:opacity-50"
          >
            {busy ? "…" : editId ? "commit changes" : "commit event to grid"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-[2px] border border-[var(--border)] px-3 py-2 font-departure text-[0.68rem] uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
            >
              cancel
            </button>
          )}
        </div>
      </form>

      {/* ── grid ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <h2 className="font-departure text-[0.68rem] uppercase tracking-[0.2em] text-[var(--cyan)]">
          [ logged events · {initialEvents.length} ]
        </h2>
        <ul className="flex max-h-[26rem] flex-col gap-2 overflow-y-auto pr-1">
          {initialEvents.length === 0 && (
            <li className="text-[0.72rem] text-[var(--text-dim)]">
              no events on the grid yet.
            </li>
          )}
          {initialEvents.map((evt, idx) => (
            <li
              key={evt.id}
              className={cn(
                "flex items-start gap-2 rounded-[2px] border border-[var(--border)] bg-[var(--bg)] p-2.5",
                !evt.is_active && "opacity-45",
              )}
            >
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() =>
                    run(() => reorderScheduleEvent(evt.id, "up"), "ORDER_UPDATED")
                  }
                  disabled={busy || idx === 0}
                  className="rounded-[2px] border border-[var(--border)] px-1.5 py-0.5 text-[0.6rem] text-[var(--text-dim)] transition-colors hover:text-[var(--text)] disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() =>
                    run(
                      () => reorderScheduleEvent(evt.id, "down"),
                      "ORDER_UPDATED",
                    )
                  }
                  disabled={busy || idx === initialEvents.length - 1}
                  className="rounded-[2px] border border-[var(--border)] px-1.5 py-0.5 text-[0.6rem] text-[var(--text-dim)] transition-colors hover:text-[var(--text)] disabled:opacity-25"
                >
                  ↓
                </button>
              </div>

              <div className="min-w-0 flex-1 text-[0.72rem]">
                <p className="font-departure uppercase tracking-[0.08em] text-[var(--text)]">
                  <span className="text-[var(--text-dim)]">
                    {String(idx + 1).padStart(2, "0")}{" "}
                  </span>
                  {evt.title}
                </p>
                <p className="text-[var(--text-dim)]">{evt.date_string}</p>
                <p className="text-[var(--text-dim)]">{evt.location}</p>
                {evt.details && (
                  <p className="mt-1 line-clamp-2 text-[0.66rem] text-[var(--text-dim)]">
                    {evt.details}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-col gap-1 font-departure text-[0.52rem] uppercase tracking-[0.1em]">
                <button
                  type="button"
                  onClick={() => startEdit(evt)}
                  className="rounded-[2px] border border-[var(--border)] px-1.5 py-1 text-[var(--text-dim)] transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
                >
                  edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    run(
                      () => toggleScheduleEvent(evt.id, !evt.is_active),
                      evt.is_active ? "EVENT_HIDDEN" : "EVENT_PUBLISHED",
                    )
                  }
                  disabled={busy}
                  className="rounded-[2px] border border-[var(--border)] px-1.5 py-1 text-[var(--text-dim)] transition-colors hover:text-[var(--text)] disabled:opacity-50"
                >
                  {evt.is_active ? "hide" : "show"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(evt.id)}
                  disabled={busy}
                  className={cn(
                    "rounded-[2px] border px-1.5 py-1 transition-colors disabled:opacity-50",
                    confirmId === evt.id
                      ? "border-[var(--persimmon)] bg-[color-mix(in_oklab,var(--persimmon)_18%,transparent)] text-[var(--persimmon)]"
                      : "border-[color-mix(in_oklab,var(--persimmon)_35%,transparent)] text-[var(--persimmon)] hover:bg-[color-mix(in_oklab,var(--persimmon)_12%,transparent)]",
                  )}
                >
                  {confirmId === evt.id ? "confirm?" : "purge"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-departure text-[0.55rem] uppercase tracking-[0.16em] text-[var(--text-dim)]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-[2px] border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[0.82rem] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--cyan)]"
      />
    </label>
  );
}
