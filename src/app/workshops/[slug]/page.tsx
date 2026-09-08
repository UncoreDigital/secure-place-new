import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Clock, Users, User } from "lucide-react";
import { getWorkshop, getWorkshopSlugs, getWorkshops } from "@/lib/content";
import { site } from "@/lib/site";
import PageHero from "@/components/site/PageHero";
import Button from "@/components/ui/Button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getWorkshopSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) return { title: "Workshop not found" };

  return {
    title: workshop.title,
    description: workshop.summary,
    openGraph: {
      title: workshop.title,
      description: workshop.summary,
      type: "article",
      images: workshop.coverUrl ? [workshop.coverUrl] : undefined,
    },
  };
}

const formatLabel: Record<string, string> = {
  onsite: "On site",
  virtual: "Virtual",
  hybrid: "Hybrid",
};

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export default async function WorkshopPage({ params }: Props) {
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) notFound();

  const all = await getWorkshops();
  const others = all.filter((w) => w.id !== workshop.id).slice(0, 3);
  const hours = workshop.durationMinutes / 60;

  /**
   * Course structured data. A workshop is a Course in schema.org terms, which
   * is what makes it eligible for the course rich result rather than being
   * indexed as an ordinary page.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: workshop.title,
    description: workshop.summary,
    provider: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    // No hasCourseInstance: that property asserts specific scheduled runs,
    // and there are none. Claiming instances with invented dates would put
    // false event data into search results.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: workshop.format === "virtual" ? "Online" : "Onsite",
      courseWorkload: `PT${workshop.durationMinutes}M`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={formatLabel[workshop.format] ?? workshop.format}
        title={workshop.title}
        lede={workshop.summary}
        crumbs={[{ label: "Workshops", href: "/workshops" }, { label: workshop.title }]}
      >
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <span className="flex items-center gap-2 text-base text-white/70">
            <Clock className="h-4 w-4 text-flame-500" />
            {hours % 1 === 0 ? `${hours} hours` : `${Math.floor(hours)} hr ${workshop.durationMinutes % 60} min`}
          </span>
          {workshop.maxParticipants && (
            <span className="flex items-center gap-2 text-base text-white/70">
              <Users className="h-4 w-4 text-flame-500" />
              {workshop.minParticipants ?? 1}–{workshop.maxParticipants} participants
            </span>
          )}
          {workshop.audience && (
            <span className="flex items-center gap-2 text-base text-white/70">
              <User className="h-4 w-4 text-flame-500" />
              {workshop.audience}
            </span>
          )}
        </div>
      </PageHero>

      <section className="bg-white section-y-sm">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              {/* outcomes */}
              <div className="reveal">
                <h2 className="font-display text-2xl font-bold text-navy-950">
                  What your team walks away with
                </h2>
                <ul className="mt-6 flex flex-col gap-4">
                  {workshop.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-4">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-flame-500/12">
                        <Check className="h-3 w-3 text-flame-700" />
                      </span>
                      <span className="text-md leading-relaxed text-mist-600">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {workshop.description && (
                <div
                  className="reveal mt-10 text-md leading-relaxed text-mist-600 [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: workshop.description }}
                />
              )}

              {/* modules — a real sequence, so numbering carries meaning */}
              <div className="reveal mt-14">
                <h2 className="font-display text-2xl font-bold text-navy-950">
                  Session outline
                </h2>
                <ol className="mt-7 flex flex-col">
                  {workshop.modules.map((module, i) => (
                    <li
                      key={module.title}
                      className="grid grid-cols-[auto_1fr] gap-5 border-t border-mist-200 py-6 first:border-t-0 first:pt-0"
                    >
                      <span className="font-mono text-sm font-semibold tabular-nums text-flame-700">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <h3 className="font-display text-xl font-semibold text-navy-950">
                            {module.title}
                          </h3>
                          <span className="font-mono text-xs tabular-nums text-mist-400">
                            {module.minutes} min
                          </span>
                        </div>
                        <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
                          {module.points.map((point) => (
                            <li
                              key={point}
                              className="rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-600"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="reveal rounded-2xl border border-mist-200 bg-mist-50 p-6">
                {/*
                  This was an "Upcoming sessions" list of dates, venues,
                  trainers and "3 seats left" badges — all of it seeded, none of
                  it real. The company books workshops per client rather than
                  running an open calendar, so the panel now explains how
                  booking actually works.
                */}
                <h2 className="font-display text-xl font-semibold text-navy-950">
                  How to book
                </h2>
                <p className="mt-4 text-base leading-relaxed text-mist-500">
                  This workshop is arranged around your organisation — your
                  site, your shift pattern and your dates. There is no fixed
                  calendar to wait for.
                </p>
                <ol className="mt-5 flex flex-col gap-3">
                  {[
                    "Tell us your locations and rough timeline",
                    "We confirm a trainer and send an outline",
                    "You approve the date and we run it on site",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-mono text-sm font-semibold tabular-nums text-flame-700">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed text-mist-600">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 flex flex-col gap-3">
                  <Button href="/contact" size="lg" className="w-full">
                    Book this workshop
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href="/workshops"
                    variant="outline"
                    size="lg"
                    className="w-full text-navy-950"
                  >
                    All workshops
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          {others.length > 0 && (
            <div className="reveal mt-20 border-t border-mist-200 pt-12">
              <h2 className="font-display text-2xl font-bold text-navy-950">
                Other workshops
              </h2>
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                {others.map((other) => (
                  <Link
                    key={other.id}
                    href={`/workshops/${other.slug}`}
                    className="group rounded-xl border border-mist-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-e2)"
                  >
                    <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                      {formatLabel[other.format] ?? other.format}
                    </span>
                    <h3 className="mt-3 font-display text-md font-semibold leading-snug text-navy-950 group-hover:text-flame-700">
                      {other.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
