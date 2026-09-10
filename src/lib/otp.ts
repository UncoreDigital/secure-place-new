import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

/**
 * One-time-code helpers for the Secure Score email verification.
 *
 * These live outside actions.ts deliberately. A "use server" module is turned
 * into a table of callable references for the client bundle, and pulling a Node
 * builtin into that module left the generated references broken — the import
 * resolved to undefined in the browser and calling an action threw
 * "startAssessmentVerification is not a function".
 *
 * Keeping node:crypto behind a plain server-only module means the actions file
 * has nothing in it but the actions themselves, which is the shape Next expects.
 */

/** Long enough to find the mail, short enough that a stolen code goes stale. */
export const CODE_TTL_MINUTES = 15;
export const MAX_ATTEMPTS = 5;
export const MAX_RESENDS = 3;
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Six digits, uniformly distributed.
 *
 * randomInt is rejection-sampled, so unlike `Math.floor(Math.random() * n)` it
 * does not bias the low end of the range.
 */
export function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/**
 * Codes are stored only as an HMAC.
 *
 * Peppered with the shared function secret rather than plainly hashed: six
 * digits is a 10^6 space, so an unkeyed hash of a leaked table would fall to a
 * wordlist in seconds. Without the secret the digest cannot be reproduced.
 * The address is part of the input, so a code cannot be replayed against a
 * different one.
 */
export function hashCode(email: string, code: string): string {
  const pepper = process.env.MARKETING_WEBHOOK_SECRET ?? "";
  return createHmac("sha256", pepper).update(`${email}:${code}`).digest("hex");
}

/** Constant-time compare, so a wrong code cannot be narrowed by timing. */
export function sameHash(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
