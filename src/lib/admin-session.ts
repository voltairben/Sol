import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSession {
  isAdmin?: boolean;
}

type AdminSessionHandle = AdminSession & {
  save: () => Promise<void>;
  destroy: () => void;
};

const EIGHT_HOURS = 60 * 60 * 8;

/**
 * True only when the deployment actually has admin secrets. Both are real
 * secrets with no code fallback — they must be set as Vercel env vars.
 * (`ADMIN_PASSCODE` is checked separately in `verifyAdminPasscode`.)
 */
export function adminConfigured(): boolean {
  return (
    (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32 &&
    Boolean(process.env.ADMIN_PASSCODE)
  );
}

export const adminSessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET ?? "",
  cookieName: "admin_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EIGHT_HOURS,
    path: "/",
  },
};

export async function getAdminSession(): Promise<AdminSessionHandle> {
  // No secret on this deployment → hand back an inert session instead of
  // letting iron-session throw a 500. `/admin` renders a config notice.
  if (!adminConfigured()) {
    return { isAdmin: false, save: async () => {}, destroy: () => {} };
  }
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
