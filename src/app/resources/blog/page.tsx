import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPosts, getPostCategories } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import PageHero from "@/components/site/PageHero";

// Rebuilt at most every 5 minutes, so publishing in the portal reaches the
// site without a redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on workplace safety: evacuation drills, anonymous reporting channels, training programmes, fire compliance and certification.",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getPostCategories()]);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Writing on workplace safety"
        lede="Practical pieces from the team that runs the audits and the drills."
        crumbs={[{ label: "Resources", href: "/resources" }, { label: "Blog" }]}
      />

      <section className="bg-white section-y-sm">
        <div className="container-page">
          {categories.length > 1 && (
            <ul className="reveal mb-10 flex flex-wrap gap-2">
              {categories.map((category) => (
                <li
                  key={category}
                  className="rounded-full border border-mist-200 px-4 py-2 text-sm text-mist-600"
                >
                  {category}
                </li>
              ))}
            </ul>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/resources/blog/${post.slug}`}
                className="reveal group flex flex-col overflow-hidden rounded-2xl border border-mist-200 transition-all duration-300 hover:-translate-y-1 hover:border-mist-300 hover:shadow-(--shadow-e2)"
                data-reveal-delay={i * 70}
              >
                {post.coverUrl && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-mist-100">
                    <Image
                      src={post.coverUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-2xs font-semibold uppercase tracking-[0.14em] text-flame-700">
                    {post.category}
                  </span>
                  <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-navy-950">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-mist-500">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-mist-100 pt-4 text-sm text-mist-400">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>{post.readingMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
