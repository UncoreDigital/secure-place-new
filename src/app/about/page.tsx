import type { Metadata } from "next";
import { ArrowRight, Target, Eye, HeartHandshake } from "lucide-react";
import { site } from "@/lib/site";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Button from "@/components/ui/Button";
import Counter from "@/components/site/Counter";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a workplace safety platform and certification body — emergency readiness, employee training and independent assessment.`,
};

const pillars = [
  {
    icon: Target,
    title: "Our mission",
    body: "To make workplace safety measurable. Policies and posters are easy; a timed evacuation, a tracked training completion rate and an anonymous channel people actually use are not. We build the tools that turn intent into evidence.",
  },
  {
    icon: Eye,
    title: "Our vision",
    body: "A workplace where every employee knows what to do when something goes wrong, knows who is coming, and knows they can speak up without it costing them.",
  },
  {
    icon: HeartHandshake,
    title: "How we work",
    body: "We do not hand over a certificate and leave. Organisations that fall short of the threshold get a documented roadmap and a route back — because the point is a safer workplace, not a badge.",
  },
];

const stats = [
  { value: 800, suffix: "+", label: "Employees trained" },
  { value: 30, suffix: "+", label: "Mock drills conducted" },
  { value: 40, suffix: "+", label: "Live sessions held" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Your trusted partner in workplace safety"
        lede="Emergency readiness, employee empowerment and safety certification — brought together so an organisation can prove it is ready, not just say so."
        crumbs={[{ label: "About" }]}
      />

      <section className="bg-white section-y">
        <div className="container-page">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-mist-200 bg-mist-200 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <article
                key={pillar.title}
                className="reveal flex flex-col bg-white p-7 md:p-9"
                data-reveal-delay={i * 70}
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-950 text-flame-500">
                  <pillar.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-navy-950">
                  {pillar.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-mist-500">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 section-y-sm">
        <div className="container-page">
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-navy-950 px-6 py-9 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-5xl font-bold leading-none text-white">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="mt-3 block text-base text-white/55">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-mist-50 section-y">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Work with us"
            title="Ready to make your workplace a Secure Place?"
            lede="Start with the free assessment, or book a walkthrough with the team."
            className="mx-auto items-center"
          />
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/secure-score" size="lg">
              Take the Secure Score
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/demo" variant="outline" size="lg" className="text-navy-950">
              Request a demo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
