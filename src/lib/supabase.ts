import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase access for the marketing site.
 *
 * Two clients, and the split is deliberate:
 *
 *   readClient()  anon key. Reads published content. RLS on the marketing
 *                 schema already filters to status='published', so the site
 *                 never sends that predicate and a draft cannot leak even if a
 *                 query forgets it.
 *
 *   writeClient() service-role key. Used only by server actions that capture
 *                 leads, assessments and registrations. Those tables carry no
 *                 anon policy at all, so this is the only way in — which is why
 *                 this module is "server-only" and the key is never a
 *                 NEXT_PUBLIC_ variable.
 *
 * Both target the `marketing` schema. Nothing here can reach `public`, where
 * the portal keeps employee and incident data.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const SCHEMA = "marketing";
export const MEDIA_BUCKET = "marketing-media";
export const AUDIO_BUCKET = "marketing-audio";

/** True when the site has enough configuration to talk to Supabase at all. */
export const hasSupabase = Boolean(URL && ANON);

let reader: SupabaseClient | null = null;

export function readClient() {
  if (!hasSupabase) return null;
  reader ??= createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return reader;
}

export function writeClient() {
  if (!URL || !SERVICE_ROLE) return null;
  // Not memoised: a write client is created per action and discarded, so a
  // long-lived module-scope reference to a service-role client never sits
  // around in the server process.
  return createClient(URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Public URL for an object path stored in one of the marketing buckets. */
export function storageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${URL}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * PostgREST puts the useful part of a failure in code/hint, not message —
 * message is empty on any HEAD request and unhelpful on most others.
 */
export function describeError(error: {
  message?: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
}): string {
  return [
    error.code && `[${error.code}]`,
    error.message || "(no message)",
    error.details && `details: ${error.details}`,
    error.hint && `hint: ${error.hint}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * How to behave when Supabase is unreachable or unconfigured.
 *
 * In development, fall back to the bundled fixtures so the site still runs for
 * anyone without credentials. In production, do not: silently serving
 * placeholder articles under the client's byline is worse than an empty
 * section, and an empty section is visible enough to get fixed.
 */
export const allowFixtureFallback = process.env.NODE_ENV !== "production";
