"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function AuthCodeError() {
  const t = useT();
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-4 px-6 font-mono">
      <p className="text-sm text-[--text-dim]">{`> ${t.autherr_kicker}`}</p>
      <h1 className="text-xl">{t.autherr_title}</h1>
      <p className="text-sm text-[--text-dim]">{t.autherr_body}</p>
      <Link href="/" className="text-sm underline underline-offset-4">
        {`< ${t.autherr_back}`}
      </Link>
    </main>
  );
}
