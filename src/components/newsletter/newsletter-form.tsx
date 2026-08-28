"use client";

import { useEffect, useState } from "react";

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
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "request failed");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("network error");
    }
  }

  if (status === "done") {
    return <TypeOut text="ACCESS GRANTED. VERIFY INBOX_" />;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 font-mono text-[0.75rem]">
        <span className="shrink-0 text-[var(--text-dim)]">
          guest@sol_portal:~$
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
          placeholder="enter email"
          aria-label="email address"
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
          ! {error}
        </p>
      )}
    </form>
  );
}
