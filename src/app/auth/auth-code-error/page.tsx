import Link from "next/link";

export default function AuthCodeError() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-4 px-6 font-mono">
      <p className="text-sm text-[--text-dim]">{"> auth error"}</p>
      <h1 className="text-xl">Sign-in didn&apos;t complete</h1>
      <p className="text-sm text-[--text-dim]">
        The link expired or was already used. Head back and try again.
      </p>
      <Link href="/" className="text-sm underline underline-offset-4">
        {"< back to sol"}
      </Link>
    </main>
  );
}
