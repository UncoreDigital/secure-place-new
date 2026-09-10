import type { Metadata } from "next";
import { ArrowRight, Check, ShieldCheck, TrendingUp, Users, Award, FileCheck } from "lucide-react";
import { site } from "@/lib/site";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Certification",
  description: `Become a certified Secure Place to Work. Onboard, train your staff, run drills, and score above ${site.certificationThreshold}% on the annual survey — or get a full improvement roadmap.`,
};

const steps = [
  {
    title: "Onboard and deploy the app",
    body: "Once your organisation connects with us we guide you through onboarding: we set up your profile, provide secure admin and safety logins, and activate your dashboard so you can upload employee data, assign volunteers and start using Secure Place.",
  },
  {
    title: "Train staff and run mock drills",
    body: "Certified trainers deliver the sessions your workplace needs. Your team then runs mock drills through the platform, with participation and evacuation time recorded automatically.",
  },
  {
    title: "Annual survey conducted",
    body: "An audited survey measures readiness across your locations — emergency response, reporting channels, training coverage, drill history and statutory compliance.",
  },
  {
    title: `Score above ${site.certificationThreshold}%? Get certified`,
    body: `Clear the ${site.certificationThreshold}% threshold and your workplace is certified as a Secure Place to Work, with a mark you can display and share.`,
  },
  {
    title: "Not certified? Get a full improvement roadmap",
    body: "Falling short does not end the process. You receive a documented SOP roadmap setting out exactly what to close and in what order, so the next survey is a different conversation.",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Prove readiness, not intent",
    body: "A certificate backed by an audited survey says something a policy document cannot.",
  },
  {
    icon: Users,
    title: "Employees who feel safer stay",
    body: "Visible investment in safety and speak-up channels is one of the clearest retention signals a workplace can send.",
  },
  {
    icon: FileCheck,
    title: "Audit-ready records",
    body: "Training completion, drill history and incident logs held centrally and retrievable on request.",
  },
  {
    icon: TrendingUp,
    title: "A measurable baseline",
    body: "A score you can move, compare year on year, and take to the board.",
  },
  {
    icon: Award,
    title: "A mark worth displaying",
    body: "Show clients, candidates and regulators that your workplace has been independently assessed.",
  },
];

export default function CertificationPage() {
  return (
    <>
      <PageHero
        eyebrow="Certification"
        title="Become a certified Secure Place to Work"
        lede={`Five steps from first login to a certified workplace. Score above ${site.certificationThreshold}% on the annual survey and you are certified — fall short and you get a roadmap, not a rejection.`}
        crumbs={[{ label: "Certification" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/demo" size="lg">
            Start the process
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/secure-score" variant="outline" size="lg" className="text-white">
            Check if you are ready
          </Button>
        </div>
      </PageHero>

      {/* journey */}
      <section className="bg-white section-y">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Certification process"
                title="Your certification journey"
                lede="A full cycle runs across a year, with the survey as the checkpoint."
              />
              <div className="reveal mt-8 rounded-2xl border border-mist-200 bg-mist-50 p-6">
                <p className="font-mono text-5xl font-semibold leading-none tabular-nums text-flame-500">
                  {site.certificationThreshold}%
                </p>
                <p className="mt-3 text-base leading-relaxed text-mist-500">
                  The survey score required to certify. The free{" "}
                  <a href="/secure-score" className="font-semibold text-flame-700 hover:underline">
                    Secure Score
                  </a>{" "}
                  uses the same threshold, so you can see roughly where you stand
                  before committing to the process.
                </p>
              </div>
            </div>

            <ol className="flex flex-col">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="reveal grid grid-cols-[auto_1fr] gap-6 border-t border-mist-200 py-8 first:border-t-0 first:pt-0"
                  data-reveal-delay={i * 60}
                >
                  <span className="font-mono text-sm font-semibold tabular-nums text-flame-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold leading-snug text-navy-950">
                      {step.title}
                    </h2>
                    <p className="mt-3 text-md leading-relaxed text-mist-500">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* why certify */}
      <section className="bg-mist-50 section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why get certified"
            title="What certification actually changes"
            lede="Beyond the mark itself, the process leaves you with records, a baseline and a plan."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <article
                key={benefit.title}
                className="reveal rounded-2xl border border-mist-200 bg-white p-6"
                data-reveal-delay={i * 60}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-flame-500/12 text-flame-700">
                  <benefit.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-950">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-mist-500">
                  {benefit.body}
                </p>
              </article>
            ))}

            <div className="reveal flex flex-col justify-center rounded-2xl bg-navy-950 p-7">
              <h3 className="font-display text-xl font-semibold text-white">
                Ready to begin?
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/65">
                Book a demo and we will walk through the survey, the timeline and
                what onboarding looks like for your organisation.
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {["No commitment to certify", "Walkthrough of the survey", "Timeline for your sites"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-white/70">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flame-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button href="/demo">
                  Request a demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
