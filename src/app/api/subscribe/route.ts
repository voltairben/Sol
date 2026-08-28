import { NextResponse } from "next/server";
import { z } from "zod";
import { getResend } from "@/lib/resend";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().trim().email().max(254),
  company: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "enter a valid email" }, { status: 400 });
  }

  // Honeypot filled → pretend it worked, do nothing.
  if (parsed.data.company) return NextResponse.json({ ok: true });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "signup is not wired up yet" },
      { status: 503 },
    );
  }

  const { error } = await getResend().emails.send({
    from: process.env.RESEND_FROM ?? "SOL_DNB <onboarding@resend.dev>",
    to: parsed.data.email,
    subject: "[SOL_PORTAL] CONNECTION_ESTABLISHED",
    text: "Access granted. You are now registered to receive Sol live notifications and custom vinyl-set drops.",
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "send failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
