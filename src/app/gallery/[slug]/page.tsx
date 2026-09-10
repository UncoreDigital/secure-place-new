import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Images } from "lucide-react";
import { getAlbum, getAlbumSlugs, getAlbumPhotos, getAlbums } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import Button from "@/components/ui/Button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAlbumSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) return { title: "Album not found" };

  return {
    title: album.title,
    description: album.description,
    openGraph: {
      type: "article",
      title: album.title,
      description: album.description,
      images: album.coverUrl ? [album.coverUrl] : undefined,
    },
    alternates: { canonical: `/gallery/${album.slug}` },
  };
}

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) notFound();

  const [photos, all] = await Promise.all([getAlbumPhotos(album.id), getAlbums()]);
  const others = all.filter((a) => a.id !== album.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: album.title,
    description: album.description,
    url: `${site.url}/gallery/${album.slug}`,
    ...(album.takenOn ? { datePublished: album.takenOn } : {}),
    image: photos.map((p) => ({
      "@type": "ImageObject",
      contentUrl: p.url.startsWith("http") ? p.url : `${site.url}${p.url}`,
      caption: p.caption ?? p.alt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-navy-950 pt-32 pb-14 md:pt-40 md:pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-flame-500/8 blur-3xl"
        />
        <div className="container-page relative max-w-3xl">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            All albums
          </Link>

          <span className="mt-7 block font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-400">
            {album.category}
          </span>

          <h1 className="mt-4 text-fluid-xl font-bold text-white">{album.title}</h1>

          {album.description && (
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              {album.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <Images className="h-3.5 w-3.5" />
              {photos.length} photo{photos.length === 1 ? "" : "s"}
            </span>
            {album.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {album.location}
              </span>
            )}
            {album.takenOn && (
              <time dateTime={album.takenOn}>{formatDate(album.takenOn)}</time>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white section-y-sm">
        <div className="container-page">
          {photos.length > 0 ? (
            <PhotoGrid photos={photos} />
          ) : (
            <p className="text-md text-mist-500">
              This album has no photographs yet.
            </p>
          )}

          {others.length > 0 && (
            <div className="mt-16 border-t border-mist-200 pt-12">
              <h2 className="font-display text-2xl font-bold text-navy-950">
                More albums
              </h2>
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                {others.map((other) => (
                  <Link
                    key={other.id}
                    href={`/gallery/${other.slug}`}
                    className="group rounded-xl border border-mist-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-e2)"
                  >
                    <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                      {other.category}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-navy-950 group-hover:text-flame-700">
                      {other.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 rounded-2xl border border-mist-200 bg-mist-50 px-7 py-10 text-center md:px-12">
            <h2 className="mx-auto max-w-xl font-display text-2xl font-bold text-navy-950">
              Want a session like this at your site?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-mist-500">
              Every workshop is arranged around your locations and shift
              patterns. Tell us what you need.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href="/contact" size="lg">
                Request a workshop
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/workshops" variant="outline" size="lg" className="text-navy-950">
                Browse the catalogue
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
