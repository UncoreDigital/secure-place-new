"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  MailCheck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  pillars,
  questions,
  industries,
  employeeBands,
  ENGINE_VERSION,
  type PillarId,
} from "@/lib/secure-score/questions";
import { scoreAnswers, type Answers } from "@/lib/secure-score/score";
import {
  startAssessmentVerification,
  verifyAssessmentOtp,
  resendAssessmentOtp,
} from "@/lib/actions";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

// "result" is deliberately gone. The score is emailed after the address is
// proven, never rendered here — see startAssessmentVerification.
type Step = "context" | PillarId | "gate" | "verify" | "done";

const STORAGE_KEY = "sptw.secure-score.v1";

/** The section wrapping the assessment on /secure-score. */
const SCROLL_ANCHOR = "assessment";
/** Fixed header height plus breathing room, so the card clears it. */
const HEADER_OFFSET = 92;

type Context = {
  company: string;
  industry: string;
  employeeBand: string;
  siteCount: string;
};

const emptyContext: Context = {
  company: "",
  industry: "",
  employeeBand: "",
  siteCount: "",
};

const steps: Step[] = ["context", ...pillars.map((p) => p.id), "gate", "verify", "done"];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Assessment() {
  const [stepIndex, setStepIndex] = useState(0);
  const [context, setContext] = useState<Context>(emptyContext);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [restored, setRestored] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendNote, setResendNote] = useState("");

  const step = steps[stepIndex];
  const result = useMemo(() => scoreAnswers(answers), [answers]);

  // Restore an interrupted run. Twenty questions is long enough that losing
  // progress to a stray tab close would cost real completions.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.answers && Object.keys(saved.answers).length > 0) {
        setAnswers(saved.answers);
        setContext({ ...emptyContext, ...saved.context });
        setRestored(true);
      }
    } catch {
      // A corrupt or unavailable store just means starting fresh.
    }
  }, []);

  useEffect(() => {
    if (step === "context" && Object.keys(answers).length === 0) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ context, answers }));
    } catch {
      // Private mode and blocked storage are fine; the run still works.
    }
  }, [context, answers, step]);

  /**
   * Move to another step, keeping the card where the reader is looking.
   *
   * This previously called window.scrollTo({ top: 0 }), which threw the reader
   * all the way back past the page hero on every "Next pillar" press — losing
   * their place and re-showing content they had already read.
   *
   * Now it scrolls to the assessment itself, offset by the fixed header, and
   * only when the card has actually drifted out of position. Advancing while
   * the card is already sitting under the header should not move the page at
   * all; a scroll the reader did not ask for reads as a glitch.
   */
  const goTo = (index: number) => {
    setStepIndex(index);
    if (typeof window === "undefined") return;

    const el = document.getElementById(SCROLL_ANCHOR);
    if (!el) return;

    const top = el.getBoundingClientRect().top;
    const alreadyInPlace = top >= 0 && top <= HEADER_OFFSET + 24;
    if (alreadyInPlace) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: top + window.scrollY - HEADER_OFFSET,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const answeredCount = questions.filter((q) => typeof answers[q.id] === "number").length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const restart = () => {
    setAnswers({});
    setContext(emptyContext);
    setContact({ name: "", email: "" });
    setRestored(false);
    // A retake is a new submission: carrying the old verification id forward
    // would post the second set of answers against the first attempt's code.
    setVerificationId("");
    setOtp("");
    setSubmitError("");
    setVerifyError("");
    setResendNote("");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    goTo(0);
  };

  // --- context ---------------------------------------------------------------
  if (step === "context") {
    const ready = context.industry !== "" && context.employeeBand !== "";
    return (
      <Shell progress={0} stepKey="context">
        <h2 className="font-display text-3xl font-bold text-navy-950">
          First, a little context
        </h2>
        <p className="mt-3 text-md leading-relaxed text-mist-500">
          Three questions so we can compare your result against organisations of
          a similar shape. No email needed yet.
        </p>

        {restored && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-flame-500/25 bg-flame-100/40 px-4 py-3">
            <p className="text-base text-navy-950">
              We restored your answers from last time — {answeredCount} of{" "}
              {questions.length} done.
            </p>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 text-sm font-semibold text-flame-700 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Start over
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field label="Organisation" optional>
            <input
              type="text"
              value={context.company}
              onChange={(e) => setContext({ ...context, company: e.target.value })}
              placeholder="Your company name"
              className={inputClass}
            />
          </Field>

          <Field label="Industry">
            <select
              value={context.industry}
              onChange={(e) => setContext({ ...context, industry: e.target.value })}
              className={inputClass}
            >
              <option value="">Select an industry</option>
              {industries.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Workforce size">
            <select
              value={context.employeeBand}
              onChange={(e) => setContext({ ...context, employeeBand: e.target.value })}
              className={inputClass}
            >
              <option value="">Select a range</option>
              {employeeBands.map((b) => (
                <option key={b} value={b}>
                  {b} employees
                </option>
              ))}
            </select>
          </Field>

          <Field label="Number of sites" optional>
            <input
              type="number"
              min={1}
              value={context.siteCount}
              onChange={(e) => setContext({ ...context, siteCount: e.target.value })}
              placeholder="e.g. 3"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-9 flex items-center justify-between gap-4">
          <p className="text-sm text-mist-400">Takes about two minutes.</p>
          <Button onClick={() => goTo(1)} size="lg" disabled={!ready}>
            Start
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Shell>
    );
  }

  // --- gate ------------------------------------------------------------------
  if (step === "gate") {
    const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(contact.email);

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validEmail || submitting) return;

      setSubmitting(true);
      setSubmitError("");

      // try/finally, not a bare await: a server action can throw (a network
      // drop, a bad deploy), and without this the button kept saying "Sending
      // your code…" for as long as the page stayed open.
      try {
        const started = await startAssessmentVerification({
          name: contact.name,
          email: contact.email,
          company: context.company,
          industry: context.industry,
          employeeBand: context.employeeBand,
          siteCount: context.siteCount,
          answers,
          pillarScores: result.pillarScores,
          totalScore: result.total,
          band: result.band.id,
          engineVersion: ENGINE_VERSION,
        });

        // Stay on this step when it fails. The report is only ever delivered by
        // email now, so there is nothing to advance to if the code never went
        // out — moving on would leave them waiting for mail that is not coming.
        if (!started.ok) {
          setSubmitError(started.error);
          return;
        }

        setVerificationId(started.verificationId);
        goTo(steps.indexOf("verify"));
      } catch (cause) {
        console.error("startAssessmentVerification threw:", cause);
        setSubmitError(
          "We could not reach the server. Check your connection and try again.",
        );
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Shell progress={100} stepKey="gate">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-flame-500/12">
            <ShieldCheck className="h-5 w-5 text-flame-700" />
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold text-navy-950">
            Your report is ready
          </h2>
          {/* No band, no number. Revealing the result here would defeat the
              verification: the address has not been proven yet. */}
          <p className="mt-3 text-md leading-relaxed text-mist-500">
            Tell us where to send it. We will email a six-digit code to confirm
            the address, then send your full breakdown across.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4 text-left">
            <Field label="Your name">
              <input
                type="text"
                required
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className={inputClass}
                placeholder="Full name"
              />
            </Field>
            <Field label="Work email">
              <input
                type="email"
                required
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className={inputClass}
                placeholder="you@company.com"
              />
            </Field>
            <Button size="lg" className="mt-2 w-full" disabled={!validEmail || submitting}>
              {submitting ? "Sending your code…" : "Email me my report"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
            {submitError && (
              <p
                role="alert"
                className="rounded-xl border border-[var(--color-signal-warn)]/30 bg-[color-mix(in_srgb,var(--color-signal-warn)_8%,transparent)] px-4 py-3 text-sm text-[var(--color-signal-warn)]"
              >
                {submitError}
              </p>
            )}
            <p className="text-center text-xs leading-relaxed text-mist-400">
              We use this to send your report and follow up once. No list
              sharing.
            </p>
          </form>

          <button
            type="button"
            onClick={() => goTo(stepIndex - 1)}
            className="mt-6 text-sm text-mist-400 hover:text-navy-950"
          >
            Back to the last question
          </button>
        </div>
      </Shell>
    );
  }

  // --- verify ----------------------------------------------------------------
  if (step === "verify") {
    const ready = otp.replace(/\D/g, "").length === 6;

    const submitCode = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!ready || verifying) return;

      setVerifying(true);
      setVerifyError("");
      setResendNote("");

      try {
        const checked = await verifyAssessmentOtp(verificationId, otp);
        if (!checked.ok) {
          setVerifyError(checked.error);
          return;
        }
        goTo(steps.indexOf("done"));
      } catch (cause) {
        console.error("verifyAssessmentOtp threw:", cause);
        setVerifyError(
          "We could not reach the server. Check your connection and try again.",
        );
      } finally {
        setVerifying(false);
      }
    };

    const resend = async () => {
      if (verifying) return;
      setVerifying(true);
      setVerifyError("");
      setResendNote("");

      try {
        const again = await resendAssessmentOtp(verificationId);
        if (!again.ok) {
          setVerifyError(again.error);
          return;
        }
        setOtp("");
        setResendNote("A new code is on its way.");
      } catch (cause) {
        console.error("resendAssessmentOtp threw:", cause);
        setVerifyError(
          "We could not reach the server. Check your connection and try again.",
        );
      } finally {
        setVerifying(false);
      }
    };

    return (
      <Shell progress={100} stepKey="verify">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-flame-500/12">
            <Mail className="h-5 w-5 text-flame-700" />
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold text-navy-950">
            Check your email
          </h2>
          <p className="mt-3 text-md leading-relaxed text-mist-500">
            We sent a six-digit code to{" "}
            <strong className="font-semibold text-navy-950">{contact.email}</strong>.
            Enter it below and your report follows straight away.
          </p>

          <form onSubmit={submitCode} className="mt-8 flex flex-col gap-4">
            <label htmlFor="otp" className="sr-only">
              Six-digit verification code
            </label>
            <input
              id="otp"
              // inputMode + autoComplete let phones offer the code straight
              // from the notification instead of making people switch apps.
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setVerifyError("");
              }}
              className="w-full rounded-xl border border-mist-200 bg-white px-4 py-4 text-center font-mono text-3xl font-semibold tracking-[0.4em] text-navy-950 outline-none transition-colors focus:border-flame-500"
              placeholder="······"
            />

            <Button size="lg" className="w-full" disabled={!ready || verifying}>
              {verifying ? "Checking…" : "Verify and send my report"}
              {!verifying && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {verifyError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[var(--color-signal-warn)]/30 bg-[color-mix(in_srgb,var(--color-signal-warn)_8%,transparent)] px-4 py-3 text-sm text-[var(--color-signal-warn)]"
            >
              {verifyError}
            </p>
          )}

          {resendNote && (
            <p role="status" className="mt-4 text-sm font-medium text-navy-950">
              {resendNote}
            </p>
          )}

          <SpamNote />

          <button
            type="button"
            onClick={resend}
            disabled={verifying}
            className="mt-5 text-sm font-semibold text-navy-950 underline underline-offset-4 hover:text-flame-700 disabled:opacity-50"
          >
            Send the code again
          </button>

          <button
            type="button"
            onClick={() => goTo(steps.indexOf("gate"))}
            className="mt-4 block w-full text-sm text-mist-400 hover:text-navy-950"
          >
            Use a different email address
          </button>
        </div>
      </Shell>
    );
  }

  // --- done ------------------------------------------------------------------
  if (step === "done") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-mist-200 bg-white px-7 py-12 text-center md:px-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-950">
            <MailCheck className="h-6 w-6 text-flame-500" />
          </span>

          <h2 className="mt-6 font-display text-3xl font-bold text-navy-950">
            Your report is on its way
          </h2>
          <p className="mx-auto mt-4 max-w-md text-md leading-relaxed text-mist-500">
            We have sent your Secure Score breakdown to{" "}
            <strong className="font-semibold text-navy-950">{contact.email}</strong>
            . It covers your score out of 100, how you did across the five
            pillars, and where the effort pays off most.
          </p>

          <SpamNote />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/demo" size="lg">
              Book a walkthrough
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/workshops" variant="outline" size="lg" className="text-navy-950">
              See the workshops
            </Button>
          </div>

          <div className="mt-10 border-t border-mist-200 pt-6">
            <p className="text-sm leading-relaxed text-mist-500">
              <strong className="text-navy-950">This is indicative.</strong> A
              Secure Score is a self-assessment, not a certification.
              Certification is awarded only after an audited survey of your
              workplace.{" "}
              <Link href="/certification" className="font-semibold text-flame-700 hover:underline">
                See what the audit involves
              </Link>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={restart}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-mist-500 hover:text-navy-950"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Take it again
          </button>
        </div>
      </div>
    );
  }

  // --- a pillar of questions -------------------------------------------------
  const pillar = pillars.find((p) => p.id === step)!;
  const pillarQuestions = questions.filter((q) => q.pillar === pillar.id);
  const allAnswered = pillarQuestions.every((q) => typeof answers[q.id] === "number");
  const pillarNumber = pillars.findIndex((p) => p.id === pillar.id) + 1;

  return (
    <Shell progress={progress} stepKey={pillar.id}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-700">
          Pillar {pillarNumber} of {pillars.length}
        </span>
        <span className="font-mono text-xs tabular-nums text-mist-400">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      <h2 className="mt-4 font-display text-3xl font-bold text-navy-950">
        {pillar.label}
      </h2>
      <p className="mt-2 text-md text-mist-500">{pillar.blurb}</p>

      <div className="mt-9 flex flex-col gap-9">
        {pillarQuestions.map((question) => (
          <fieldset key={question.id}>
            <legend className="font-display text-lg font-semibold leading-snug text-navy-950">
              {question.text}
            </legend>
            {question.help && (
              <p className="mt-2 text-base text-mist-400">{question.help}</p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {question.options.map((option, oi) => {
                const selected = answers[question.id] === option.points;
                return (
                  <motion.label
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: oi * 0.04 }}
                    whileTap={{ scale: 0.99 }}
                    key={option.label}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                      selected
                        ? "border-flame-500 bg-flame-100/40"
                        : "border-mist-200 hover:border-mist-300 hover:bg-mist-50",
                    )}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      className="sr-only"
                      checked={selected}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: option.points }))
                      }
                    />
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
                        selected ? "border-flame-500 bg-flame-500" : "border-mist-300",
                      )}
                      aria-hidden
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <span className="text-base text-navy-950">{option.label}</span>
                  </motion.label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-mist-100 pt-7">
        <button
          type="button"
          onClick={() => goTo(stepIndex - 1)}
          className="inline-flex items-center gap-2 text-base font-semibold text-mist-500 hover:text-navy-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Button onClick={() => goTo(stepIndex + 1)} size="lg" disabled={!allAnswered}>
          {steps[stepIndex + 1] === "gate" ? "See my score" : "Next pillar"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Shell>
  );
}

// --- small pieces ------------------------------------------------------------

const inputClass =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-base text-navy-950 outline-none transition-colors placeholder:text-mist-300 focus:border-flame-500";

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-mist-600">
        {label}
        {optional && <span className="ml-2 font-normal text-mist-400">optional</span>}
      </span>
      {children}
    </label>
  );
}

function Shell({
  progress,
  stepKey,
  children,
}: {
  progress: number;
  stepKey?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-mist-100"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Assessment progress"
      >
        <div
          className="h-1 rounded-full bg-flame-500 transition-[width] duration-500 ease-[var(--ease-out-expo)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-9 rounded-2xl border border-mist-200 bg-white p-7 md:p-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * The single most common support question for any emailed report.
 *
 * Shown on both the verify and the confirmation step, because the mail people
 * fail to find is as often the code as the report itself.
 */
function SpamNote() {
  return (
    <p className="mx-auto mt-6 flex max-w-sm items-start gap-2.5 rounded-xl border border-mist-200 bg-mist-50 px-4 py-3 text-left text-sm leading-relaxed text-mist-600">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mist-400" />
      <span>
        <strong className="font-semibold text-navy-950">Not in your inbox?</strong>{" "}
        Please check your spam or junk folder — automated mail often lands
        there. Marking it as not spam helps the report arrive too.
      </span>
    </p>
  );
}
