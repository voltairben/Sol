import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Constant-time comparison of two secrets. Both are SHA-256'd first so the
 * `timingSafeEqual` buffers are always equal length (it throws otherwise) and
 * the comparison time never leaks the real secret's length.
 */
export function safeEqual(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}
