import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSession {
  isAdmin?: boolean;
}

const EIGHT_HOURS = 60 * 60 * 8;

export const adminSessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET!,
  cookieName: "admin_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EIGHT_HOURS,
    path: "/",
  },
};

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), adminSessionOptions);
}

/** Throws if the caller has no valid admin cookie. Call at the top of every admin mutation. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
