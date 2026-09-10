import * as fixtures from "./fixtures";
import {
  readClient,
  hasSupabase,
  allowFixtureFallback,
  describeError,
  storageUrl,
  SCHEMA,
  MEDIA_BUCKET,
  AUDIO_BUCKET,
} from "@/lib/supabase";
import type {
  GalleryAlbum,
  GalleryPhoto,
  PodcastEpisode,
  Post,
  Workshop,
} from "./types";

export * from "./types";

/**
 * Content repository — the single seam between the site and its content.
 *
 * Reads the `marketing` schema with the anon key. Row level security already
 * restricts anon to status='published' AND published_at <= now(), so none of
 * these queries send that filter: a draft cannot leak even if one is forgotten
 * here, and scheduled posts appear on their own.
 *
 * When Supabase is unconfigured or unreachable, development falls back to the
 * bundled fixtures so the site still runs; production returns empty instead.
 * Serving placeholder articles under the client's byline because an env var
 * was missing would be worse than an empty section.
 */

async function query<T>(
  label: string,
  run: (db: NonNullable<ReturnType<typeof readClient>>) => Promise<{ data: unknown; error: unknown }>,
  fallback: T,
  map: (rows: any[]) => T,
): Promise<T> {
  const client = readClient();

  if (!client) {
    if (allowFixtureFallback) {
      console.warn(`[content] Supabase not configured — using fixtures for ${label}.`);
      return fallback;
    }
    console.error(`[content] Supabase not configured; ${label} returned empty.`);
    return map([]);
  }

  const { data, error } = await run(client);

  if (error) {
    console.error(`[content] ${label} failed:`, describeError(error as any));
    return allowFixtureFallback ? fallback : map([]);
  }

  return map((data as any[]) ?? []);
}

const from = (table: string) => readClient()!.schema(SCHEMA).from(table);

/* ------------------------------- mappers -------------------------------- */

const toPost = (p: any): Post => ({
  id: p.id,
  slug: p.slug ?? "",
  title: p.title ?? "",
  excerpt: p.excerpt ?? "",
  body: p.body ?? "",
  coverUrl: storageUrl(MEDIA_BUCKET, p.cover_url),
  authorName: p.author_name ?? "Secure Place to Work",
  authorRole: p.author_role ?? null,
  category: p.category ?? "General",
  tags: p.tags ?? [],
  readingMinutes: p.reading_minutes ?? 3,
  isFeatured: !!p.is_featured,
  seoTitle: p.seo_title ?? null,
  seoDescription: p.seo_description ?? null,
  publishedAt: p.published_at,
});

const toEpisode = (e: any): PodcastEpisode => ({
  id: e.id,
  slug: e.slug ?? "",
  title: e.title ?? "",
  description: e.description ?? "",
  showNotes: e.show_notes ?? "",
  transcript: e.transcript ?? null,
  season: e.season ?? 1,
  episodeNumber: e.episode_number ?? null,
  audioUrl: storageUrl(AUDIO_BUCKET, e.audio_url),
  durationSeconds: e.duration_seconds ?? null,
  coverUrl: storageUrl(MEDIA_BUCKET, e.cover_url),
  guests: e.guests ?? [],
  spotifyUrl: e.spotify_url ?? null,
  appleUrl: e.apple_url ?? null,
  youtubeUrl: e.youtube_url ?? null,
  publishedAt: e.published_at,
});

const toWorkshop = (w: any): Workshop => ({
  id: w.id,
  slug: w.slug ?? "",
  title: w.title ?? "",
  summary: w.summary ?? "",
  description: w.description ?? "",
  format: w.format ?? "onsite",
  durationMinutes: w.duration_minutes ?? 120,
  audience: w.audience ?? null,
  outcomes: w.outcomes ?? [],
  modules: Array.isArray(w.modules) ? w.modules : [],
  minParticipants: w.min_participants ?? null,
  maxParticipants: w.max_participants ?? null,
  coverUrl: storageUrl(MEDIA_BUCKET, w.cover_url),
  isFeatured: !!w.is_featured,
  displayOrder: w.display_order ?? 0,
});

const toAlbum = (a: any): GalleryAlbum => ({
  id: a.id,
  slug: a.slug ?? "",
  title: a.title ?? "",
  description: a.description ?? "",
  location: a.location ?? null,
  takenOn: a.taken_on ?? null,
  category: a.category ?? "Training",
  // cover_photo_id points at a row in gallery_photos; the embed below resolves
  // it to a storage path.
  coverUrl: storageUrl(MEDIA_BUCKET, a.cover_photo?.storage_path ?? null),
  photoCount: a.photo_count ?? 0,
  isFeatured: !!a.is_featured,
  displayOrder: a.display_order ?? 0,
});

const toPhoto = (p: any): GalleryPhoto => ({
  id: p.id,
  albumId: p.album_id,
  url: storageUrl(MEDIA_BUCKET, p.storage_path) ?? "",
  alt: p.alt ?? "",
  caption: p.caption ?? null,
  width: p.width ?? 0,
  height: p.height ?? 0,
  displayOrder: p.display_order ?? 0,
});

/* --------------------------------- posts -------------------------------- */

const byNewest = <T extends { publishedAt: string }>(a: T, b: T) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export async function getPosts(limit?: number): Promise<Post[]> {
  const fallback = [...fixtures.posts].sort(byNewest).slice(0, limit ?? undefined);
  return query("getPosts", async () => {
    let q = from("posts").select("*").order("published_at", { ascending: false });
    if (limit) q = q.limit(limit);
    return await q;
  }, fallback, (rows) => rows.map(toPost));
}

export async function getPost(slug: string): Promise<Post | null> {
  const fallback = fixtures.posts.find((p) => p.slug === slug) ?? null;
  const rows = await query(
    `getPost(${slug})`,
    async () => await from("posts").select("*").eq("slug", slug).limit(1),
    fallback ? [fallback] : [],
    (r) => r,
  );
  const row = rows[0];
  if (!row) return null;
  // The fallback path already returns mapped objects; the live path does not.
  return "publishedAt" in row ? (row as Post) : toPost(row);
}

export async function getPostSlugs(): Promise<string[]> {
  return query(
    "getPostSlugs",
    async () => await from("posts").select("slug"),
    fixtures.posts.map((p) => p.slug),
    (rows) => rows.map((r) => r.slug),
  );
}

export async function getRelatedPosts(slug: string, limit = 2): Promise<Post[]> {
  const current = await getPost(slug);
  const all = (await getPosts()).filter((p) => p.slug !== slug);
  if (!current) return all.slice(0, limit);

  // Same category first, then fill from the rest by recency.
  const same = all.filter((p) => p.category === current.category);
  const rest = all.filter((p) => p.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}

export async function getPostCategories(): Promise<string[]> {
  const posts = await getPosts();
  return [...new Set(posts.map((p) => p.category))].sort();
}

/* -------------------------------- podcast ------------------------------- */

export async function getEpisodes(limit?: number): Promise<PodcastEpisode[]> {
  const fallback = [...fixtures.podcastEpisodes].sort(byNewest).slice(0, limit ?? undefined);
  return query("getEpisodes", async () => {
    let q = from("podcast_episodes").select("*").order("published_at", { ascending: false });
    if (limit) q = q.limit(limit);
    return await q;
  }, fallback, (rows) => rows.map(toEpisode));
}

export async function getEpisode(slug: string): Promise<PodcastEpisode | null> {
  const rows = await query(
    `getEpisode(${slug})`,
    async () => await from("podcast_episodes").select("*").eq("slug", slug).limit(1),
    [],
    (r) => r,
  );
  return rows[0] ? toEpisode(rows[0]) : null;
}

export async function getEpisodeSlugs(): Promise<string[]> {
  return query(
    "getEpisodeSlugs",
    async () => await from("podcast_episodes").select("slug"),
    fixtures.podcastEpisodes.map((e) => e.slug),
    (rows) => rows.map((r) => r.slug),
  );
}

/* ------------------------------- workshops ------------------------------ */

export async function getWorkshops(): Promise<Workshop[]> {
  const fallback = [...fixtures.workshops].sort((a, b) => a.displayOrder - b.displayOrder);
  return query(
    "getWorkshops",
    async () => await from("workshops").select("*").order("display_order"),
    fallback,
    (rows) => rows.map(toWorkshop),
  );
}

export async function getWorkshop(slug: string): Promise<Workshop | null> {
  const rows = await query(
    `getWorkshop(${slug})`,
    async () => await from("workshops").select("*").eq("slug", slug).limit(1),
    [],
    (r) => r,
  );
  if (rows[0]) return toWorkshop(rows[0]);
  return allowFixtureFallback
    ? (fixtures.workshops.find((w) => w.slug === slug) ?? null)
    : null;
}

export async function getWorkshopSlugs(): Promise<string[]> {
  return query(
    "getWorkshopSlugs",
    async () => await from("workshops").select("slug"),
    fixtures.workshops.map((w) => w.slug),
    (rows) => rows.map((r) => r.slug),
  );
}

/*
 * getWorkshopSessions() and getNextSession() are gone: workshops run on request
 * rather than to a public schedule, so anything surfacing dates, venues or seat
 * counts advertised a calendar the company does not operate.
 */

/* -------------------------------- gallery ------------------------------- */

// cover_photo is an embed on gallery_albums.cover_photo_id, so one round trip
// gets the album and its cover image path together.
const ALBUM_SELECT = "*, cover_photo:cover_photo_id ( storage_path )";

export async function getAlbums(limit?: number): Promise<GalleryAlbum[]> {
  return query("getAlbums", async () => {
    let q = from("gallery_albums").select(ALBUM_SELECT).order("display_order");
    if (limit) q = q.limit(limit);
    return await q;
  }, fixtures.galleryAlbums, (rows) => rows.map(toAlbum));
}

export async function getAlbum(slug: string): Promise<GalleryAlbum | null> {
  const rows = await query(
    `getAlbum(${slug})`,
    async () => await from("gallery_albums").select(ALBUM_SELECT).eq("slug", slug).limit(1),
    [],
    (r) => r,
  );
  return rows[0] ? toAlbum(rows[0]) : null;
}

export async function getAlbumSlugs(): Promise<string[]> {
  return query(
    "getAlbumSlugs",
    async () => await from("gallery_albums").select("slug"),
    fixtures.galleryAlbums.map((a) => a.slug),
    (rows) => rows.map((r) => r.slug),
  );
}

export async function getAlbumPhotos(albumId: string): Promise<GalleryPhoto[]> {
  return query(
    `getAlbumPhotos(${albumId})`,
    async () =>
      await from("gallery_photos")
        .select("*")
        .eq("album_id", albumId)
        .order("display_order"),
    fixtures.galleryPhotos.filter((p) => p.albumId === albumId),
    (rows) => rows.map(toPhoto),
  );
}

export { hasSupabase };
