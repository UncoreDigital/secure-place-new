import type { Metadata } from "next";
import { pillars } from "@/lib/secure-score/questions";
import { bands } from "@/lib/secure-score/score";
import { site } from "@/lib/site";
import PageHero from "@/components/site/PageHero";
import Assessment from "@/components/secure-score/Assessment";

export const metadata: Metadata = {
  title: "Secure Score — How secure is your workplace?",
  description:
    "A free two-minute self-assessment. Score your workplace out of 100 across emergency preparedness, speak-up channels, training, drills and compliance, and see your three biggest gaps.",
};

const toneClass = {
  good: "text-[var(--color-signal-good)]",
  warn: "text-[var(--color-signal-warn)]",
  bad: "text-[var(--color-signal-bad)]",
} as const;

export default function SecureScorePage() {
  return (
    <>
      <PageHero
        eyebrow="Free self-assessment"
        title="How secure is your workplace, really?"
        lede="Twenty questions, about two minutes. You get a score out of 100 across five pillars, a breakdown of where you stand, and the three gaps worth fixing first."
        crumbs={[{ label: "Secure Score" }]}
      >
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-5">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="bg-navy-950 px-4 py-5">
              <span className="block font-mono text-2xl font-semibold leading-none tabular-nums text-flame-500">
                {pillar.weight}
              </span>
              <span className="mt-2 block text-xs leading-snug text-white/55">
                {pillar.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-2xs uppercase tracking-[0.12em] text-white/55">
          Pillar weighting, out of 100
        </p>
      </PageHero>

      <section id="assessment" className="scroll-mt-24 bg-mist-50 section-y-sm">
        <div className="container-page">
          <Assessment />
        </div>
      </section>

      {/* What the bands mean — set out before anyone takes it, so the result
          is not the first time they see the thresholds. */}
      <section className="bg-white section-y">
        <div className="container-page">
          <h2 className="reveal max-w-2xl text-fluid-md font-bold leading-[1.1] text-navy-950">
            What your score means
          </h2>
          <p className="reveal mt-4 max-w-2xl text-md leading-relaxed text-mist-500">
            The bands use the same {site.certificationThreshold}% threshold as
            certification itself, so a self-assessed score means the same thing
            as an audited one.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-mist-200 bg-mist-200 md:grid-cols-2 lg:grid-cols-4">
            {bands.map((band, i) => {
              const upper = i === 0 ? 100 : bands[i - 1].min - 1;
              return (
                <div key={band.id} className="reveal bg-white p-6" data-reveal-delay={i * 60}>
                  <p
                    className={`font-mono text-2xl font-semibold tabular-nums ${toneClass[band.tone]}`}
                  >
                    {band.min}–{upper}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-navy-950">
                    {band.label}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-mist-500">
                    {band.body}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="reveal mt-10 rounded-xl border border-mist-200 bg-mist-50 px-6 py-5">
            <p className="max-w-3xl text-base leading-relaxed text-mist-500">
              <strong className="text-navy-950">A note on what this is.</strong>{" "}
              The Secure Score is a self-assessment based on answers you provide
              about your own organisation. It is a useful way to find gaps and
              to see whether certification is within reach. It is not itself a
              Secure Place certification, which is awarded only after an audited
              survey conducted with your team.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
