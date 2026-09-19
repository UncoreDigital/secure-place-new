import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getWorkshops } from "@/lib/content";
import PageHero from "@/components/site/PageHero";
import Button from "@/components/ui/Button";
import WorkshopCatalogue from "@/components/workshops/WorkshopCatalogue";

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Trainer-led workplace safety workshops: emergency response and evacuation, BLS and first aid, fire safety, POSH awareness, and safety volunteer certification.",
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
          <WorkshopCatalogue
            workshops={workshops.map((w) => ({
              id: w.id,
              slug: w.slug,
              title: w.title,
              summary: w.summary,
              format: w.format,
              durationMinutes: w.durationMinutes,
              audience: w.audience,
              minParticipants: w.minParticipants,
              maxParticipants: w.maxParticipants,
              coverUrl: w.coverUrl,
            }))}
          />

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
