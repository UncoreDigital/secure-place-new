"use server";

import { writeClient, describeError, SCHEMA } from "@/lib/supabase";

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

function unavailable(label: string): ActionResult {
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

export async function submitAssessment(payload: ScorePayload): Promise<ActionResult> {
  const db = writeClient();
  if (!db) return unavailable("submitAssessment");

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  if (!name || !looksLikeEmail(email)) {
    return { ok: false, error: "Please enter your name and a valid work email." };
  }

  // Order matters. Both tables fire a notification trigger, so writing the
  // assessment first would email the team "no contact details captured" a
  // moment before the real one. Lead first, take its id, then the assessment.
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
    console.error("[actions] submitAssessment lead insert failed:", describeError(leadError as any));
    return { ok: false, error: GENERIC_ERROR };
  }

  const site = Number(payload.siteCount);

  const { error: assessmentError } = await db
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
    });

  if (assessmentError) {
    // The lead is already captured, so the enquiry is not lost even though the
    // score did not attach. Better than rolling back and losing both.
    console.error(
      "[actions] submitAssessment score insert failed (lead was saved):",
      describeError(assessmentError),
    );
    return { ok: false, error: GENERIC_ERROR };
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
