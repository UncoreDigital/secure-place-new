import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { getEpisodes } from "@/lib/content";
import { formatDate, formatDuration } from "@/lib/utils";
import PageHero from "@/components/site/PageHero";
import Button from "@/components/ui/Button";

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "Conversations with the people who run workplace safety programmes, investigate incidents and sit on safety and complaints committees.",
};

export default async function PodcastPage() {
  const episodes = await getEpisodes();

  return (
    <>
      <PageHero
        eyebrow="Podcast"
        title="Conversations about keeping people safe at work"
        lede="Interviews with safety leads, committee members and the people who show up first when something goes wrong."
        crumbs={[{ label: "Resources", href: "/resources" }, { label: "Podcast" }]}
      />

      <section className="bg-white section-y">
        <div className="container-page">
          {episodes.length > 0 ? (
            <div className="flex flex-col gap-5">
              {episodes.map((episode, i) => (
                <article
                  key={episode.id}
                  className="reveal group rounded-2xl border border-mist-200 p-6 transition-all duration-300 hover:border-mist-300 hover:shadow-(--shadow-e2) md:p-7"
                  data-reveal-delay={i * 70}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                    <span>
                      S{episode.season}
                      {episode.episodeNumber ? ` · E${episode.episodeNumber}` : ""}
                    </span>
                    {episode.durationSeconds && (
                      <span className="text-mist-400">
                        {formatDuration(episode.durationSeconds)}
                      </span>
                    )}
                    <span className="text-mist-400">{formatDate(episode.publishedAt)}</span>
                  </div>

                  <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-navy-950">
                    <Link
                      href={`/resources/podcast/${episode.slug}`}
                      className="hover:text-flame-700"
                    >
                      {episode.title}
                    </Link>
                  </h2>

                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-mist-500">
                    {episode.description}
                  </p>

                  {episode.guests.length > 0 && (
                    <p className="mt-4 text-sm text-mist-400">
                      <span className="font-semibold text-mist-600">With:</span>{" "}
                      {episode.guests.join(", ")}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            /*
              No episodes yet. Rather than a bare "coming soon", the page shows
              the run order being built and invites suggestions — which is both
              honest and useful. Fabricating episodes with dead platform links
              would be worse than an empty shelf.
            */
            <>
              <div className="reveal mx-auto max-w-2xl rounded-2xl border border-mist-200 bg-mist-50 px-7 py-12 text-center md:px-12">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-950">
                  <Mic className="h-6 w-6 text-flame-500" />
                </span>
                <h2 className="mt-6 font-display text-3xl font-bold text-navy-950">
                  The podcast is on the way
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-md leading-relaxed text-mist-500">
                  We are putting together a series of conversations with the
                  people who run safety programmes, sit on committees and show
                  up first when something goes wrong. If there is something you
                  want to hear discussed, tell us.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button href="/contact" size="lg">
                    Suggest a topic
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    href="/resources"
                    variant="outline"
                    size="lg"
                    className="text-navy-950"
                  >
                    Read the blog instead
                  </Button>
                </div>
              </div>

            </>
          )}
        </div>
      </section>
    </>
  );
}
