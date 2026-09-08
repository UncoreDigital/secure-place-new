import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getPost, getPostSlugs, getRelatedPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import Button from "@/components/ui/Button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.authorName],
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
    alternates: { canonical: `/resources/blog/${post.slug}` },
  };
}

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    image: post.coverUrl ? `${site.url}${post.coverUrl}` : undefined,
    mainEntityOfPage: `${site.url}/resources/blog/${post.slug}`,
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
              href="/resources/blog"
              className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              All articles
            </Link>

            <span className="mt-7 block font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-400">
              {post.category}
            </span>

            <h1 className="mt-4 text-fluid-xl font-bold leading-[1.06] text-white">
              {post.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-white/65">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm text-white/50">
              <span className="text-white/75">{post.authorName}</span>
              {post.authorRole && <span>{post.authorRole}</span>}
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </div>
        </header>

        {post.coverUrl && (
          <div className="bg-navy-950">
            <div className="container-page max-w-4xl">
              <div className="relative aspect-[2/1] -mb-16 translate-y-0 overflow-hidden rounded-2xl bg-mist-100">
                <Image
                  src={post.coverUrl}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        <div className={post.coverUrl ? "bg-white pt-28 pb-16 md:pb-20" : "bg-white section-y-sm"}>
          <div className="container-page">
            {/*
              Post body is trusted HTML authored in the portal's editor. Prose
              styling is applied here rather than pulled in as a plugin, so the
              type scale stays on the site's own scale.
            */}
            <div
              className="mx-auto max-w-[42rem] text-lg leading-[1.75] text-mist-600
                [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-navy-950
                [&_h3]:mt-9 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-navy-950
                [&_p]:mt-5
                [&_ul]:mt-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5
                [&_li]:list-disc [&_li]:marker:text-flame-500
                [&_a]:font-medium [&_a]:text-flame-700 [&_a]:underline [&_a]:underline-offset-2
                [&_blockquote]:mt-7 [&_blockquote]:border-l-2 [&_blockquote]:border-flame-500 [&_blockquote]:pl-5 [&_blockquote]:text-navy-950
                [&_strong]:font-semibold [&_strong]:text-navy-950"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {post.tags.length > 0 && (
              <div className="mx-auto mt-14 max-w-[42rem] border-t border-mist-200 pt-7">
                <ul className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-mist-100 px-3 py-2 font-mono text-xs text-mist-500"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contextual CTA: the assessment is the natural next step from a
                piece about gaps in a safety programme. */}
            <div className="mx-auto mt-12 max-w-[42rem] rounded-2xl border border-mist-200 bg-mist-50 p-7">
              <h2 className="font-display text-xl font-semibold text-navy-950">
                How does your workplace measure up?
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

      {related.length > 0 && (
        <section className="bg-mist-50 section-y-sm">
          <div className="container-page">
            <h2 className="reveal font-display text-2xl font-bold text-navy-950">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((other) => (
                <Link
                  key={other.id}
                  href={`/resources/blog/${other.slug}`}
                  className="reveal group flex flex-col rounded-2xl border border-mist-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-e2)"
                >
                  <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                    {other.category}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-950 group-hover:text-flame-700">
                    {other.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-mist-500">
                    {other.excerpt}
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
