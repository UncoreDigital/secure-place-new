import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Mic, Camera } from "lucide-react";
import { getPosts, getEpisodes, getAlbums } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Articles, podcast episodes and photographs from the workshops and drills we run — workplace safety, emergency readiness, speak-up channels and certification.",
};

export default async function ResourcesPage() {
  const [posts, episodes, albums] = await Promise.all([
    getPosts(),
    getEpisodes(3),
    getAlbums(3),
  ]);

  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="What we have learned, written down"
        lede="Practical writing on drills, reporting channels, training and compliance — and photographs from the sessions themselves."
        crumbs={[{ label: "Resources" }]}
      />

      {/* featured article */}
      {lead && (
        <section className="bg-white section-y-sm">
          <div className="container-page">
            <Link
              href={`/resources/blog/${lead.slug}`}
              className="reveal group grid overflow-hidden rounded-2xl border border-mist-200 transition-all duration-300 hover:border-mist-300 hover:shadow-(--shadow-e3) lg:grid-cols-2"
            >
              {lead.coverUrl && (
                <div className="relative aspect-[16/10] overflow-hidden bg-mist-100 lg:aspect-auto">
                  <Image
                    src={lead.coverUrl}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                  Featured · {lead.category}
                </span>
                <h2 className="mt-4 font-display text-fluid-sm font-bold leading-[1.12] text-navy-950">
                  {lead.title}
                </h2>
                <p className="mt-4 text-md leading-relaxed text-mist-500">
                  {lead.excerpt}
                </p>
                <div className="mt-7 flex items-center gap-4 text-sm text-mist-400">
                  <span>{formatDate(lead.publishedAt)}</span>
                  <span aria-hidden>·</span>
                  <span>{lead.readingMinutes} min read</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-navy-950 group-hover:text-flame-700">
                  Read the article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* articles */}
      {rest.length > 0 && (
        <section className="bg-mist-50 section-y-sm">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Articles"
                title="From the blog"
                lede="Written by the team that runs the audits."
              />
              <Link
                href="/resources/blog"
                className="reveal group inline-flex items-center gap-2 text-base font-semibold text-navy-950 hover:text-flame-700"
              >
                All articles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/resources/blog/${post.slug}`}
                  className="reveal group flex flex-col rounded-2xl border border-mist-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-e2)"
                  data-reveal-delay={i * 70}
                >
                  <span className="inline-flex items-center gap-2 font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                    <FileText className="h-3 w-3" />
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
                    <span>{post.readingMinutes} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* gallery */}
      <section id="gallery" className="bg-white section-y-sm">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Photo gallery"
              title="Sessions, drills and training days"
              lede="Photographs from the workshops and drills we run on client sites."
            />
            <Link
              href="/gallery"
              className="reveal group inline-flex items-center gap-2 text-base font-semibold text-navy-950 hover:text-flame-700"
            >
              Open the gallery
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {albums.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <Link
                  key={album.id}
                  href={`/gallery/${album.slug}`}
                  className="reveal group overflow-hidden rounded-2xl border border-mist-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-e2)"
                  data-reveal-delay={i * 70}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-mist-100">
                    {album.coverUrl && (
                      <Image
                        src={album.coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-navy-950 group-hover:text-flame-700">
                      {album.title}
                    </h3>
                    <p className="mt-2 text-sm text-mist-400">
                      {album.photoCount} photo{album.photoCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Honest until real photographs are uploaded through the portal.
               The site's stock imagery is not evidence of our own sessions. */
            <div className="reveal mt-10 rounded-2xl border border-mist-200 bg-mist-50 px-7 py-10 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-navy-950 text-flame-500">
                <Camera className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-navy-950">
                The gallery is being put together
              </h3>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-mist-500">
                We are collecting photographs from recent sessions and drills.
                It will fill up shortly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* podcast */}
      <section className="bg-navy-950 section-y-sm">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Podcast"
              tone="dark"
              title="Conversations about keeping people safe at work"
              lede="Interviews with the people who run safety programmes, investigate incidents and sit on committees."
            />
            <Link
              href="/resources/podcast"
              className="reveal group inline-flex items-center gap-2 text-base font-semibold text-white hover:text-flame-400"
            >
              {episodes.length > 0 ? "All episodes" : "About the podcast"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {episodes.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {episodes.map((episode) => (
                <Link
                  key={episode.id}
                  href={`/resources/podcast/${episode.slug}`}
                  className="reveal group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <span className="inline-flex items-center gap-2 font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-400">
                    <Mic className="h-3 w-3" />
                    S{episode.season} E{episode.episodeNumber}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-white">
                    {episode.title}
                  </h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-white/60">
                    {episode.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="reveal mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-10 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-flame-500/15">
                <Mic className="h-5 w-5 text-flame-400" />
              </span>
              <p className="mx-auto mt-5 max-w-md text-md leading-relaxed text-white/65">
                The podcast is on the way. Tell us what you would want
                to hear discussed and we will build the run order around it.
              </p>
              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-2 text-base font-semibold text-flame-400 hover:text-flame-300"
              >
                Suggest a topic
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
