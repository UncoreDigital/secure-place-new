import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { capabilities } from "@/lib/capabilities";
import { getPosts, getWorkshops } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/site/SectionHeading";
import Hero from "@/components/site/Hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import MotionCard from "@/components/motion/MotionCard";

const stats = [
  { value: 800, suffix: "+", label: "Employees trained" },
  { value: 30, suffix: "+", label: "Mock drills conducted" },
  { value: 40, suffix: "+", label: "Live sessions held" },
  { value: site.certificationThreshold, suffix: "%", label: "Score needed to certify" },
];

const certificationSteps = [
  { title: "Onboard and deploy", body: "We set up your profile, issue admin and safety logins, and activate your dashboard." },
  { title: "Train staff and run drills", body: "Certified trainers run sessions; your team runs mock drills through the platform." },
  { title: "Annual survey", body: "An audited survey measures readiness across your locations." },
  { title: "Score above 70%", body: "Clear the threshold and your workplace is certified." },
  { title: "Below the line?", body: "You get a full improvement roadmap (SOP) instead — not just a rejection." },
];

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const [posts, workshops] = await Promise.all([getPosts(3), getWorkshops()]);

  const featuredWorkshops = workshops.filter((w) => w.isFeatured).slice(0, 3);

  return (
    <>
      <Hero stats={stats} />

      {/* ------------------------------------------------------- capabilities */}
      <section className="bg-white section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="What the platform does"
            title={
              <>
                Smart solutions built for{" "}
                <span className="text-mist-400">safer workspaces</span>
              </>
            }
            lede="Six capabilities that cover the moment an incident starts, the training that prepares for it, and the records that prove you were ready."
          />

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-mist-200 bg-mist-200 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, i) => (
              <MotionCard
                key={cap.id}
                id={cap.id}
                lift={0}
                delay={i * 0.06}
                className="group flex flex-col bg-white p-7 transition-colors duration-300 hover:bg-mist-50"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-950 text-flame-500 transition-colors duration-300 group-hover:bg-flame-500 group-hover:text-white">
                  <cap.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-950">
                  {cap.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-mist-500">
                  {cap.body}
                </p>
                <ul className="mt-5 flex flex-col gap-2 border-t border-mist-100 pt-5">
                  {cap.points.map((point) => (
                    <li key={point} className="flex gap-3 text-base text-mist-600">
                      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-flame-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ certification */}
      <section className="bg-mist-50 section-y">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
            <div>
              <SectionHeading
                eyebrow="Certification process"
                title="Your certification journey"
                lede="Five steps from first login to a certified workplace. Organisations that fall short get a roadmap, not a rejection."
              />
              <Reveal className="mt-8">
                <Button href="/certification" variant="navy" size="lg">
                  See how certification works
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Reveal>
            </div>

            <Stagger as="ol" className="flex flex-col">
              {certificationSteps.map((step, i) => (
                <StaggerItem
                  as="li"
                  key={step.title}
                  className="grid grid-cols-[auto_1fr] gap-5 border-t border-mist-200 py-6 first:border-t-0 first:pt-0"
                >
                  <span className="font-mono text-sm font-semibold tabular-nums text-flame-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-mist-500">
                      {step.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- secure score */}
      <section className="bg-navy-950 section-y">
        <div className="container-page">
          <div className="reveal grid items-center gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Free self-assessment
              </span>
              <h2 className="mt-5 max-w-2xl text-fluid-lg font-bold leading-[1.08] text-white">
                How secure is your workplace, really?
              </h2>
              <p className="mt-5 max-w-xl text-md leading-relaxed text-white/65">
                Twenty questions, about two minutes. You get a score out of 100
                across five pillars, your three biggest gaps, and a report you
                can take to your leadership team.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/secure-score" size="lg">
                  Take the assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-white/60">
                <Clock className="h-3.5 w-3.5" />
                Indicative only — certification is awarded after an audited survey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {[
                { label: "Emergency preparedness", weight: 25 },
                { label: "Speak-up & reporting", weight: 25 },
                { label: "Training & awareness", weight: 20 },
                { label: "Drills & readiness", weight: 15 },
              ].map((pillar) => (
                <div key={pillar.label} className="bg-navy-950 p-5">
                  <span className="block font-mono text-3xl font-semibold leading-none tabular-nums text-flame-500">
                    {pillar.weight}
                  </span>
                  <span className="mt-2 block text-xs leading-snug text-white/55">
                    {pillar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- workshops */}
      <section className="bg-white section-y">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Workshops"
              title="Trainer-led sessions, run on your site"
              lede="Practical training delivered by certified instructors, from evacuation drills to POSH compliance."
            />
            <Link
              href="/workshops"
              className="reveal group inline-flex items-center gap-2 text-base font-semibold text-navy-950 hover:text-flame-700"
            >
              All workshops
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* A "Next session" banner used to sit here, fed by seeded dates.
              Workshops are booked on request, so advertising a next date
              implied an open calendar the company does not run. */}

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredWorkshops.map((workshop, i) => (
              <MotionCard
                key={workshop.id}
                href={`/workshops/${workshop.slug}`}
                delay={i * 0.08}
                className="group overflow-hidden rounded-2xl border border-mist-200 transition-[border-color,box-shadow] duration-300 hover:border-mist-300 hover:shadow-(--shadow-e3)"
              >
                {workshop.coverUrl && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-mist-100">
                    <Image
                      src={workshop.coverUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                    {workshop.format} · {Math.round(workshop.durationMinutes / 60)} hr
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-950">
                    {workshop.title}
                  </h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-mist-500">
                    {workshop.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-navy-950 group-hover:text-flame-700">
                    View outline
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- resources */}
      <section className="bg-mist-50 section-y">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Resources" title="From the blog" />
            <Link
              href="/resources"
              className="reveal group inline-flex items-center gap-2 text-base font-semibold text-navy-950 hover:text-flame-700"
            >
              All resources
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <MotionCard
                key={post.id}
                href={`/resources/blog/${post.slug}`}
                delay={i * 0.08}
                className="group rounded-2xl border border-mist-200 bg-white p-6 transition-[box-shadow] duration-300 hover:shadow-(--shadow-e2)"
              >
                <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                  {post.category}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-950">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-mist-500">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-mist-100 pt-4 text-sm text-mist-400">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- cta */}
      <section className="bg-white section-y">
        <div className="container-page">
          <div className="reveal relative overflow-hidden rounded-3xl bg-navy-950 px-7 py-14 text-center md:px-16 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-flame-500/12 blur-3xl"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-fluid-lg font-bold leading-[1.08] text-white">
                Start making your workplace measurably safer
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-md leading-relaxed text-white/65">
                Book a demo and we will walk through emergency alerting, drill
                management and the certification path for your organisation.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button href="/demo" size="lg">
                  Request a demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/contact" variant="outline" size="lg" className="text-white">
                  Talk to us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
