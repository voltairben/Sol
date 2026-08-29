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
    return NextResponse.json({ code: "invalid" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ code: "email" }, { status: 400 });
  }

  // Honeypot filled → pretend it worked, do nothing.
  if (parsed.data.company) return NextResponse.json({ ok: true });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ code: "unconfigured" }, { status: 503 });
  }

  const resend = getResend();
  const { email } = parsed.data;

  // Add to Sol's audience (list) when one is configured. A duplicate is fine —
  // don't fail the request over it.
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    const { error: contactErr } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (contactErr && !/exist/i.test(contactErr.message)) {
      console.warn("resend contact:", contactErr.message);
    }
  }

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "SOL_DNB <onboarding@resend.dev>",
    to: email,
    subject: "[SOL_PORTAL] CONNECTION_ESTABLISHED",
    text: "Access granted. You are now on the list for SOL_DNB go-live notifications and vinyl-set drops.",
  });

  if (error) {
    return NextResponse.json({ code: "failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
