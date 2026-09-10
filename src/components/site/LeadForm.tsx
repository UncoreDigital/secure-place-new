"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { submitLead } from "@/lib/actions";

type Props = {
  /** Recorded against the lead so the team knows which form produced it. */
  source: "contact" | "demo";
  submitLabel?: string;
};

const inputClass =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-base text-navy-950 outline-none transition-colors placeholder:text-mist-300 focus:border-flame-500";

export default function LeadForm({ source, submitLabel = "Send" }: Props) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    // Writes marketing.leads through a server action. The database trigger on
    // that table is what sends the team notification and the acknowledgement,
    // so nothing here talks to email.
    const data = new FormData(e.currentTarget);
    data.set("source", source);

    // Carry any campaign parameters through so the lead records where it came
    // from rather than losing it at the form boundary.
    const params = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const value = params.get(key);
      if (value) data.set(key, value);
    }

    const result = await submitLead(data);

    setSubmitting(false);
    if (result.ok) setSent(true);
    else setError(result.error);
  }

  if (sent) {
    return (
      <div
        className="rounded-2xl border border-mist-200 bg-mist-50 p-8 text-center"
        role="status"
      >
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-signal-good)_14%,transparent)]">
          <Check className="h-5 w-5 text-[var(--color-signal-good)]" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-950">
          Thanks — we have your message
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-mist-500">
          Someone from the team will reply within one working day. If it is
          urgent, call us on the number above.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name">
          <input id="name" name="name" type="text" required className={inputClass} placeholder="Full name" />
        </Field>
        <Field label="Work email" htmlFor="email">
          <input id="email" name="email" type="email" required className={inputClass} placeholder="you@company.com" />
        </Field>
        <Field label="Organisation" htmlFor="company">
          <input id="company" name="company" type="text" className={inputClass} placeholder="Company name" />
        </Field>
        <Field label="Phone" htmlFor="phone" optional>
          <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+91 00000 00000" />
        </Field>
      </div>

      {source === "demo" && (
        <Field label="Number of sites" htmlFor="sites" optional>
          <input id="sites" name="sites" type="number" min={1} className={inputClass} placeholder="e.g. 3" />
        </Field>
      )}

      <Field
        label={source === "demo" ? "What would you like to see?" : "How can we help?"}
        htmlFor="message"
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${inputClass} resize-y`}
          placeholder={
            source === "demo"
              ? "Tell us about your sites, shift patterns and what you want to cover."
              : "Tell us what you need."
          }
        />
      </Field>

      {/* A failed submission has to say so. Silently doing nothing would leave
          someone believing their enquiry was sent. */}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-[var(--color-signal-bad)]/30 bg-[color-mix(in_srgb,var(--color-signal-bad)_8%,transparent)] px-4 py-3 text-base text-[var(--color-signal-bad)]"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" disabled={submitting}>
          {submitting ? "Sending…" : submitLabel}
          {!submitting && <ArrowRight className="h-4 w-4" />}
        </Button>
        <p className="text-sm text-mist-400">
          We reply within one working day.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-mist-600">
        {label}
        {optional && <span className="ml-2 font-normal text-mist-400">optional</span>}
      </label>
      {children}
    </div>
  );
}
