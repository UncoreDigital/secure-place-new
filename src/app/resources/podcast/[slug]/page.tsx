import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mic, Clock, Users } from "lucide-react";
import { getEpisode, getEpisodeSlugs, getEpisodes } from "@/lib/content";
import { formatDate, formatDuration } from "@/lib/utils";
import { site } from "@/lib/site";
import Button from "@/components/ui/Button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getEpisodeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) return { title: "Episode not found" };

  return {
    title: episode.title,
    description: episode.description,
    openGraph: {
      type: "article",
      title: episode.title,
      description: episode.description,
      publishedTime: episode.publishedAt,
      images: episode.coverUrl ? [episode.coverUrl] : undefined,
    },
    alternates: { canonical: `/resources/podcast/${episode.slug}` },
  };
}

const platforms = [
  { key: "spotifyUrl", label: "Spotify" },
  { key: "appleUrl", label: "Apple Podcasts" },
  { key: "youtubeUrl", label: "YouTube" },
] as const;

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) notFound();

  const others = (await getEpisodes()).filter((e) => e.slug !== slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.description,
    datePublished: episode.publishedAt,
    episodeNumber: episode.episodeNumber ?? undefined,
    timeRequired: episode.durationSeconds
      ? `PT${Math.round(episode.durationSeconds / 60)}M`
      : undefined,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: `${site.name} Podcast`,
      url: `${site.url}/resources/podcast`,
    },
    associatedMedia: episode.audioUrl
      ? { "@type": "MediaObject", contentUrl: episode.audioUrl }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="relative overflow-hidden bg-navy-950 pt-32 pb-14 md:pt-40 md:pb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-flame-500/8 blur-3xl"
          />
          <div className="container-page relative max-w-3xl">
            <Link
              href="/resources/podcast"
              className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              All episodes
            </Link>

            <span className="mt-7 flex items-center gap-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-400">
              <Mic className="h-3 w-3" />
              Season {episode.season}
              {episode.episodeNumber ? ` · Episode ${episode.episodeNumber}` : ""}
            </span>

            <h1 className="mt-4 text-fluid-xl font-bold text-white">{episode.title}</h1>

            <p className="mt-5 text-lg leading-relaxed text-white/70">
              {episode.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/60">
              <time dateTime={episode.publishedAt}>{formatDate(episode.publishedAt)}</time>
              {episode.durationSeconds && (
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(episode.durationSeconds)}
                </span>
              )}
              {episode.guests.length > 0 && (
                <span className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" />
                  {episode.guests.join(", ")}
                </span>
              )}
            </div>

            {/* Native audio: no player library, no extra bundle, and it keeps
                the browser's own keyboard and screen-reader affordances. */}
            {episode.audioUrl && (
              <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-md">
                <audio
                  controls
                  preload="metadata"
                  className="w-full"
                  src={episode.audioUrl}
                >
                  Your browser does not support audio playback.{" "}
                  <a href={episode.audioUrl}>Download the episode</a> instead.
                </audio>
              </div>
            )}

            {platforms.some((p) => episode[p.key]) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-sm text-white/50">Also listen on</span>
                {platforms.map((p) =>
                  episode[p.key] ? (
                    <a
                      key={p.key}
                      href={episode[p.key] as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
                    >
                      {p.label}
                    </a>
                  ) : null,
                )}
              </div>
            )}
          </div>
        </header>

        <div className="bg-white section-y-sm">
          <div className="container-page">
            {episode.showNotes && (
              <div className="mx-auto max-w-[42rem]">
                <h2 className="font-display text-2xl font-bold text-navy-950">Show notes</h2>
                <div
                  className="mt-6 text-md leading-[1.75] text-mist-600
                    [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-950
                    [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy-950
                    [&_p]:mt-4
                    [&_ul]:mt-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5
                    [&_li]:list-disc [&_li]:marker:text-flame-500
                    [&_a]:font-medium [&_a]:text-flame-700 [&_a]:underline
                    [&_strong]:font-semibold [&_strong]:text-navy-950"
                  dangerouslySetInnerHTML={{ __html: episode.showNotes }}
                />
              </div>
            )}

            {/* Collapsed by default: a transcript runs to thousands of words and
                would bury everything below it, but it still ships in the DOM so
                it stays searchable and indexable. */}
            {episode.transcript && (
              <details className="mx-auto mt-12 max-w-[42rem] rounded-2xl border border-mist-200 bg-mist-50 p-6 md:p-8">
                <summary className="cursor-pointer font-display text-lg font-semibold text-navy-950 marker:text-flame-500">
                  Read the full transcript
                </summary>
                <div className="mt-6 whitespace-pre-wrap text-base leading-[1.8] text-mist-600">
                  {episode.transcript}
                </div>
              </details>
            )}

            <div className="mx-auto mt-12 max-w-[42rem] rounded-2xl border border-mist-200 bg-mist-50 p-7">
              <h2 className="font-display text-lg font-semibold text-navy-950">
                How secure is your workplace?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-mist-500">
                Twenty questions, two minutes, a score out of 100 and your three
                biggest gaps.
              </p>
              <div className="mt-5">
                <Button href="/secure-score">
                  Take the Secure Score
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="bg-mist-50 section-y-sm">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold text-navy-950">More episodes</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/resources/podcast/${other.slug}`}
                  className="group rounded-2xl border border-mist-200 bg-white p-6 shadow-(--shadow-e1) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-e2)"
                >
                  <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                    S{other.season}
                    {other.episodeNumber ? ` · E${other.episodeNumber}` : ""}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-navy-950 group-hover:text-flame-700">
                    {other.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-mist-500">
                    {other.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
