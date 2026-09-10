import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPostSlugs, getWorkshopSlugs, getEpisodeSlugs, getAlbumSlugs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, workshopSlugs, episodeSlugs, albumSlugs] = await Promise.all([
    getPostSlugs(),
    getWorkshopSlugs(),
    getEpisodeSlugs(),
    getAlbumSlugs(),
  ]);

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/certification", priority: 0.9 },
    { path: "/secure-score", priority: 0.9 },
    { path: "/solutions", priority: 0.8 },
    { path: "/workshops", priority: 0.8 },
    { path: "/industries", priority: 0.7 },
    { path: "/resources", priority: 0.7 },
    { path: "/resources/blog", priority: 0.7 },
    { path: "/resources/podcast", priority: 0.5 },
    { path: "/gallery", priority: 0.6 },
    { path: "/about", priority: 0.6 },
    { path: "/demo", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];

  const now = new Date();

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...postSlugs.map((slug) => ({
      url: `${site.url}/resources/blog/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...workshopSlugs.map((slug) => ({
      url: `${site.url}/workshops/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...albumSlugs.map((slug) => ({
      url: `${site.url}/gallery/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...episodeSlugs.map((slug) => ({
      url: `${site.url}/resources/podcast/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
