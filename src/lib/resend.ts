import "server-only";
import { Resend } from "resend";

/** Resend client for the email signup. Server-only. */
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}
