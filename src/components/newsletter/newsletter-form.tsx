"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

type Status = "idle" | "sending" | "done" | "error";

function TypeOut({ text }: { text: string }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => setN((v) => v + 1), 45);
    return () => clearTimeout(id);
  }, [n, text.length]);

  return (
    <p className="font-mono text-[0.75rem] text-[var(--cyan)]">
      {text.slice(0, n)}
      <span className="animate-pulse">_</span>
    </p>
  );
}

export function NewsletterForm() {
  const t = useT();
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errorCode, setErrorCode] = useState<string>("");

  const errorText =
    (
      {
        invalid: t.err_sub_invalid,
        email: t.err_sub_email,
        unconfigured: t.err_sub_unconfigured,
        failed: t.err_sub_failed,
        network: t.err_network,
      } as Record<string, string>
    )[errorCode] ?? errorCode;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorCode("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = (await res.json()) as { ok?: boolean; code?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorCode(data.code ?? "failed");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorCode("network");
    }
  }

  if (status === "done") {
    return <TypeOut text={t.newsletter_ok} />;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 font-mono text-[0.75rem]">
        <span className="shrink-0 text-[var(--text-dim)]">guest@sol_portal</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
          placeholder={t.ph_email}
          aria-label={t.email_label}
          className="min-w-0 flex-1 border-0 border-b-2 border-[var(--border)] bg-transparent pb-0.5 text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[var(--persimmon)]"
        />
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 font-departure text-[0.62rem] uppercase tracking-[0.12em] text-[var(--cyan)] transition-opacity disabled:opacity-50"
        >
          {status === "sending" ? "…" : "↵"}
        </button>
      </div>
      {status === "error" && (
        <p className="font-mono text-[0.68rem] text-[var(--persimmon)]">
          ! {errorText}
        </p>
      )}
    </form>
  );
}
