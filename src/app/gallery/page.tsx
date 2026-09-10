import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, MapPin, Images } from "lucide-react";
import { getAlbums } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import PageHero from "@/components/site/PageHero";
import Button from "@/components/ui/Button";

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Photo gallery",
  description:
    "Photographs from the safety workshops, evacuation drills and training sessions we run on client sites.",
};

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Sessions, drills and training days"
        lede="Photographs from the workshops and drills we run — the practical side of what certification actually involves."
        crumbs={[{ label: "Gallery" }]}
      />

      <section className="bg-white section-y-sm">
        <div className="container-page">
          {albums.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <Link
                  key={album.id}
                  href={`/gallery/${album.slug}`}
                  className="reveal group flex flex-col overflow-hidden rounded-2xl border border-mist-200 transition-all duration-300 hover:-translate-y-1 hover:border-mist-300 hover:shadow-(--shadow-e2)"
                  data-reveal-delay={i * 70}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-mist-100">
                    {album.coverUrl ? (
                      <Image
                        src={album.coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-mist-300">
                        <Camera className="h-8 w-8" />
                      </span>
                    )}
                    <span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-navy-950/80 px-3 py-1 font-mono text-2xs font-semibold text-white backdrop-blur-sm">
                      <Images className="h-3 w-3" />
                      {album.photoCount}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                      {album.category}
                    </span>
                    <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-950 group-hover:text-flame-700">
                      {album.title}
                    </h2>
                    {album.description && (
                      <p className="mt-3 flex-1 text-base leading-relaxed text-mist-500">
                        {album.description}
                      </p>
                    )}

                    {/* Location and date only render when they are actually
                        recorded. An album with neither is fine; one with an
                        invented date is not. */}
                    {(album.location || album.takenOn) && (
                      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-mist-100 pt-4 text-sm text-mist-400">
                        {album.location && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            {album.location}
                          </span>
                        )}
                        {album.takenOn && (
                          <time dateTime={album.takenOn}>{formatDate(album.takenOn)}</time>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="reveal mx-auto max-w-2xl rounded-2xl border border-mist-200 bg-mist-50 px-7 py-12 text-center md:px-12">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-950">
                <Camera className="h-6 w-6 text-flame-500" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold text-navy-950">
                The gallery is being put together
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-md leading-relaxed text-mist-500">
                We are collecting photographs from recent workshops, evacuation
                drills and first-aid sessions. In the meantime, the workshop
                pages set out exactly what each session covers.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/workshops" size="lg">
                  See the workshops
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/contact" variant="outline" size="lg" className="text-navy-950">
                  Talk to us
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
