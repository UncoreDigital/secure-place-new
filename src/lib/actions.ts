"use server";

import { writeClient, describeError, SCHEMA } from "@/lib/supabase";
import {
  generateCode,
  hashCode,
  sameHash,
  CODE_TTL_MINUTES,
  MAX_ATTEMPTS,
  MAX_RESENDS,
  RESEND_COOLDOWN_SECONDS,
} from "@/lib/otp";

/**
 * Inbound capture: contact, demo, Secure Score, workshop registration.
 *
 * These run on the server with the service-role key because the inbound tables
 * carry no anon policy at all — a leaked anon key cannot stuff the leads table
 * or read anyone's submission. That is the whole reason writes never happen
 * from the browser.
 *
 * Inserting a row is what triggers the notification email; the database webhook
 * fires on INSERT, so nothing here sends mail directly.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR =
  "Something went wrong sending that. Please try again, or email us directly.";

const clean = (v: FormDataEntryValue | null) => String(v ?? "").trim();

/** Accepts what a real address looks like without trying to fully validate one. */
const looksLikeEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v);

function unavailable(label: string): { ok: false; error: string } {
  console.error(`[actions] ${label}: Supabase is not configured on this deployment.`);
  return { ok: false, error: GENERIC_ERROR };
}

/* ------------------------------ enquiries ------------------------------- */

export async function submitLead(formData: FormData): Promise<ActionResult> {
  const db = writeClient();
  if (!db) return unavailable("submitLead");

  const name = clean(formData.get("name"));
  const email = clean(formData.get("email"));
  const message = clean(formData.get("message"));
  const source = clean(formData.get("source")) || "contact";

  if (!name || !looksLikeEmail(email)) {
    return { ok: false, error: "Please enter your name and a valid work email." };
  }

  const { error } = await db
    .schema(SCHEMA)
    .from("leads")
    .insert({
      name,
      email,
      company: clean(formData.get("company")) || null,
      phone: clean(formData.get("phone")) || null,
      job_title: clean(formData.get("jobTitle")) || null,
      message: message || null,
      source,
      source_ref: clean(formData.get("sourceRef")) || null,
      utm: readUtm(formData),
    });

  if (error) {
    console.error("[actions] submitLead failed:", describeError(error));
    return { ok: false, error: GENERIC_ERROR };
  }

  return { ok: true };
}

/* ----------------------------- secure score ----------------------------- */

/**
 * The Secure Score no longer shows a result on the page.
 *
 * A visitor could previously type any address — a colleague's, a competitor's,
 * a fake one — and both the report and the sales notification went out on that
 * word alone. Now the address is proven with a one-time code before either
 * happens, and the report is emailed rather than displayed.
 *
 * Three steps:
 *   startAssessmentVerification  writes the answers, emails a code
 *   verifyAssessmentOtp          checks the code, emails the report
 *   resendAssessmentOtp          issues a fresh code, rate limited
 *
 * The answers are written on submit rather than held until verification, so an
 * abandoned attempt is still recorded (with verified_at NULL) instead of lost.
 * The team is not notified until verified_at is set — that is wired in the
 * database triggers, not here.
 */

export type ScorePayload = {
  name: string;
  email: string;
  company: string;
  industry: string;
  employeeBand: string;
  siteCount: string;
  answers: Record<string, number>;
  pillarScores: Record<string, number>;
  totalScore: number;
  band: string;
  engineVersion: string;
};

export type StartResult =
  | { ok: true; verificationId: string; email: string }
  | { ok: false; error: string };

async function sendMail(payload: Record<string, unknown>): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const secret = process.env.MARKETING_WEBHOOK_SECRET;

  if (!url || !key || !secret) {
    console.error("[actions] mailer is not configured; no email sent.");
    return false;
  }

  try {
    const response = await fetch(`${url}/functions/v1/marketing-assessment-mailer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "x-webhook-secret": secret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      console.error(
        `[actions] mailer returned ${response.status}:`,
        (await response.text()).slice(0, 300),
      );
      return false;
    }
    return true;
  } catch (cause) {
    console.error("[actions] mailer request failed:", cause);
    return false;
  }
}

/**
 * Emails the report for one assessment and records that it went.
 *
 * The figures are read here and passed to the mailer rather than the mailer
 * reading them itself: the service-role key injected into the edge function
 * environment could not select from marketing.assessments ("permission denied
 * for table assessments"), while this key can. Keeping the database work on
 * this side also means report_sent_at is stamped by the same code that knows
 * the send succeeded.
 */
async function sendReportFor(
  db: NonNullable<ReturnType<typeof writeClient>>,
  assessmentId: string,
): Promise<boolean> {
  const { data, error } = await db
    .schema(SCHEMA)
    .from("assessments")
    .select("id, company, total_score, band, pillar_scores, leads ( name, email )")
    .eq("id", assessmentId)
    .single();

  if (error || !data) {
    console.error("[actions] could not load assessment for report:", describeError(error as never));
    return false;
  }

  const lead = (data as { leads?: { name?: string; email?: string } | null }).leads;
  const to = lead?.email;
  if (!to) {
    console.error("[actions] assessment", assessmentId, "has no address to send to.");
    return false;
  }

  const sent = await sendMail({
    action: "report",
    to,
    name: lead?.name ?? "",
    company: data.company ?? null,
    totalScore: data.total_score,
    band: data.band,
    pillarScores: data.pillar_scores ?? {},
  });

  if (!sent) return false;

  await db
    .schema(SCHEMA)
    .from("assessments")
    .update({ report_sent_at: new Date().toISOString() })
    .eq("id", assessmentId);

  return true;
}

export async function startAssessmentVerification(
  payload: ScorePayload,
): Promise<StartResult> {
  const db = writeClient();
  if (!db) return unavailable("startAssessmentVerification");

  const name = payload.name?.trim();
  // Lowercased so a resend cannot be split across casings of one address.
  const email = payload.email?.trim().toLowerCase();
  if (!name || !looksLikeEmail(email)) {
    return { ok: false, error: "Please enter your name and a valid work email." };
  }

  // Order matters. Lead first so the assessment can reference it.
  const { data: lead, error: leadError } = await db
    .schema(SCHEMA)
    .from("leads")
    .insert({
      name,
      email,
      company: payload.company?.trim() || null,
      source: "secure_score",
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    console.error("[actions] lead insert failed:", describeError(leadError as never));
    return { ok: false, error: GENERIC_ERROR };
  }

  const site = Number(payload.siteCount);

  const { data: assessment, error: assessmentError } = await db
    .schema(SCHEMA)
    .from("assessments")
    .insert({
      lead_id: lead.id,
      company: payload.company?.trim() || null,
      industry: payload.industry || null,
      employee_band: payload.employeeBand || null,
      site_count: Number.isFinite(site) && site > 0 ? site : null,
      answers: payload.answers,
      pillar_scores: payload.pillarScores,
      total_score: payload.totalScore,
      band: payload.band,
      engine_version: payload.engineVersion,
    })
    .select("id")
    .single();

  if (assessmentError || !assessment) {
    console.error("[actions] assessment insert failed:", describeError(assessmentError as never));
    return { ok: false, error: GENERIC_ERROR };
  }

  const code = generateCode();

  const { data: verification, error: verificationError } = await db
    .schema(SCHEMA)
    .from("assessment_verifications")
    .insert({
      assessment_id: assessment.id,
      lead_id: lead.id,
      email,
      code_hash: hashCode(email, code),
      expires_at: new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString(),
      max_attempts: MAX_ATTEMPTS,
    })
    .select("id")
    .single();

  if (verificationError || !verification) {
    console.error("[actions] verification insert failed:", describeError(verificationError as never));
    return { ok: false, error: GENERIC_ERROR };
  }

  const sent = await sendMail({
    action: "otp",
    email,
    name,
    code,
    expiresMinutes: CODE_TTL_MINUTES,
  });

  if (!sent) {
    return {
      ok: false,
      error:
        "We could not send the verification code just now. Please try again in a moment.",
    };
  }

  return { ok: true, verificationId: verification.id, email };
}

export async function verifyAssessmentOtp(
  verificationId: string,
  code: string,
): Promise<ActionResult> {
  const db = writeClient();
  if (!db) return unavailable("verifyAssessmentOtp");

  const entered = String(code ?? "").replace(/\D/g, "");
  if (!verificationId || entered.length !== 6) {
    return { ok: false, error: "Enter the six-digit code from your email." };
  }

  const { data: row, error } = await db
    .schema(SCHEMA)
    .from("assessment_verifications")
    .select("id, assessment_id, lead_id, email, code_hash, expires_at, attempts, max_attempts, verified_at")
    .eq("id", verificationId)
    .single();

  if (error || !row) {
    console.error("[actions] verification lookup failed:", describeError(error as never));
    return { ok: false, error: "That verification has expired. Please start again." };
  }

  // Already verified. A double submit should read as success — but if the
  // report never actually went (the send can fail after the code is accepted),
  // returning ok here would strand them on a confirmation for an email that
  // does not exist. Retry the send instead.
  if (row.verified_at) {
    const { data: existing } = await db
      .schema(SCHEMA)
      .from("assessments")
      .select("report_sent_at")
      .eq("id", row.assessment_id)
      .single();

    if (existing?.report_sent_at) return { ok: true };

    return (await sendReportFor(db, row.assessment_id))
      ? { ok: true }
      : {
          ok: false,
          error:
            "Your email is confirmed, but the report could not be sent just now. " +
            "Try again in a moment, or contact us and we will send it across.",
        };
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "That code has expired. Send yourself a new one." };
  }

  if (row.attempts >= row.max_attempts) {
    return {
      ok: false,
      error: "Too many incorrect attempts. Send yourself a new code to continue.",
    };
  }

  if (!sameHash(row.code_hash, hashCode(row.email, entered))) {
    // Count the failure before returning, or the limit means nothing.
    await db
      .schema(SCHEMA)
      .from("assessment_verifications")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id);

    const left = row.max_attempts - (row.attempts + 1);
    return {
      ok: false,
      error:
        left > 0
          ? `That code is not right. ${left} attempt${left === 1 ? "" : "s"} left.`
          : "That code is not right, and you are out of attempts. Send yourself a new code.",
    };
  }

  const now = new Date().toISOString();

  await db
    .schema(SCHEMA)
    .from("assessment_verifications")
    .update({ verified_at: now })
    .eq("id", row.id);

  // These two updates are what release the team notification: the triggers fire
  // on verified_at going from NULL to a value.
  await db.schema(SCHEMA).from("assessments").update({ verified_at: now }).eq("id", row.assessment_id);
  if (row.lead_id) {
    await db.schema(SCHEMA).from("leads").update({ verified_at: now }).eq("id", row.lead_id);
  }

  const sent = await sendReportFor(db, row.assessment_id);

  if (!sent) {
    // The address is proven and the score is stored, so this is recoverable:
    // pressing verify again retries the send rather than making them answer
    // twenty questions over.
    return {
      ok: false,
      error:
        "Your email is confirmed, but the report could not be sent just now. " +
        "Press verify again to retry, or contact us and we will send it across.",
    };
  }

  return { ok: true };
}

export async function resendAssessmentOtp(verificationId: string): Promise<ActionResult> {
  const db = writeClient();
  if (!db) return unavailable("resendAssessmentOtp");
  if (!verificationId) return { ok: false, error: GENERIC_ERROR };

  const { data: row, error } = await db
    .schema(SCHEMA)
    .from("assessment_verifications")
    .select("id, email, lead_id, verified_at, resend_count, last_sent_at")
    .eq("id", verificationId)
    .single();

  if (error || !row) {
    return { ok: false, error: "That verification has expired. Please start again." };
  }
  if (row.verified_at) return { ok: true };

  // Rate limited so this cannot be used to mail-bomb an address.
  const since = (Date.now() - new Date(row.last_sent_at).getTime()) / 1000;
  if (since < RESEND_COOLDOWN_SECONDS) {
    const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - since);
    return { ok: false, error: `Please wait ${wait} more second${wait === 1 ? "" : "s"}.` };
  }
  if (row.resend_count >= MAX_RESENDS) {
    return {
      ok: false,
      error: "You have requested several codes already. Please contact us instead.",
    };
  }

  const { data: lead } = row.lead_id
    ? await db.schema(SCHEMA).from("leads").select("name").eq("id", row.lead_id).single()
    : { data: null as { name?: string } | null };

  const code = generateCode();

  const { error: updateError } = await db
    .schema(SCHEMA)
    .from("assessment_verifications")
    .update({
      code_hash: hashCode(row.email, code),
      expires_at: new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString(),
      // A new code restarts the attempt budget; the old one is now worthless.
      attempts: 0,
      resend_count: row.resend_count + 1,
      last_sent_at: new Date().toISOString(),
    })
    .eq("id", row.id);

  if (updateError) {
    console.error("[actions] resend update failed:", describeError(updateError));
    return { ok: false, error: GENERIC_ERROR };
  }

  const sent = await sendMail({
    action: "otp",
    email: row.email,
    name: lead?.name ?? "",
    code,
    expiresMinutes: CODE_TTL_MINUTES,
  });

  if (!sent) {
    return { ok: false, error: "We could not send that code. Please try again in a moment." };
  }

  return { ok: true };
}

/* -------------------------------- helpers ------------------------------- */

function readUtm(formData: FormData): Record<string, string> {
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = clean(formData.get(key));
    if (value) utm[key] = value;
  }
  return utm;
}
