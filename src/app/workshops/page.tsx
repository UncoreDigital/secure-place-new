import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Users, CalendarPlus } from "lucide-react";
import { getWorkshops } from "@/lib/content";
import PageHero from "@/components/site/PageHero";
import Button from "@/components/ui/Button";

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Trainer-led workplace safety workshops: emergency response and evacuation, BLS and first aid, fire safety, POSH awareness, and safety volunteer certification.",
};

const formatLabel: Record<string, string> = {
  onsite: "On site",
  virtual: "Virtual",
  hybrid: "Hybrid",
};

export default async function WorkshopsPage() {
  const workshops = await getWorkshops();

  return (
    <>
      <PageHero
        eyebrow="Workshops"
        title="Training your team will actually use"
        lede="Certified trainers, run on your site or online. Every workshop ends with something measurable — a timed evacuation, a supervised extinguisher discharge, a completed assessment."
        crumbs={[{ label: "Workshops" }]}
      />

      <section className="bg-white section-y">
        <div className="container-page">
          <div className="flex flex-col gap-6">
            {workshops.map((workshop, i) => {
              const hours = workshop.durationMinutes / 60;

              return (
                <article
                  key={workshop.id}
                  className="reveal group grid overflow-hidden rounded-2xl border border-mist-200 transition-all duration-300 hover:border-mist-300 hover:shadow-(--shadow-e2) md:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)]"
                  data-reveal-delay={i * 70}
                >
                  {workshop.coverUrl && (
                    <div className="relative min-h-[12rem] overflow-hidden bg-mist-100">
                      <Image
                        src={workshop.coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="flex flex-col p-7 md:p-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                      <span>{formatLabel[workshop.format] ?? workshop.format}</span>
                      <span className="flex items-center gap-2 text-mist-400">
                        <Clock className="h-3 w-3" />
                        {hours % 1 === 0 ? `${hours} hr` : `${Math.floor(hours)} hr ${workshop.durationMinutes % 60} min`}
                      </span>
                      {workshop.maxParticipants && (
                        <span className="flex items-center gap-2 text-mist-400">
                          <Users className="h-3 w-3" />
                          {workshop.minParticipants ?? 1}–{workshop.maxParticipants}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-navy-950">
                      <Link href={`/workshops/${workshop.slug}`} className="hover:text-flame-700">
                        {workshop.title}
                      </Link>
                    </h2>

                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-mist-500">
                      {workshop.summary}
                    </p>

                    {workshop.audience && (
                      <p className="mt-4 text-sm text-mist-400">
                        <span className="font-semibold text-mist-600">For:</span>{" "}
                        {workshop.audience}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-mist-100 pt-5">
                      <Link
                        href={`/workshops/${workshop.slug}`}
                        className="inline-flex items-center gap-2 text-base font-semibold text-navy-950 hover:text-flame-700"
                      >
                        View full outline
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>

                      {/* Workshops are arranged per client rather than run to a
                          public calendar, so this states how booking works
                          instead of advertising a date. */}
                      <span className="flex items-center gap-2 text-sm text-mist-500">
                        <CalendarPlus className="h-3.5 w-3.5 text-flame-500" />
                        Arranged on your dates
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="reveal mt-14 rounded-2xl border border-mist-200 bg-mist-50 px-7 py-10 text-center md:px-12">
            <h2 className="mx-auto max-w-xl font-display text-3xl font-bold leading-snug text-navy-950">
              Need a workshop shaped around your site?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-mist-500">
              Every session can be adapted to your floor plan, shift pattern and
              risk profile. Tell us what you need and we will put together an
              outline.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href="/contact" size="lg">
                Request a workshop
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/secure-score" variant="outline" size="lg" className="text-navy-950">
                Find your gaps first
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
