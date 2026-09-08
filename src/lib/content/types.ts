/**
 * Content types.
 *
 * These mirror the `marketing` schema in marketing-schema-migration.sql
 * column for column, in camelCase. Keeping them aligned is what lets the
 * fixture-backed repository in ./index.ts be swapped for Supabase queries
 * without any page component changing.
 */

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";
export type WorkshopFormat = "onsite" | "virtual" | "hybrid";
export type ScoreBand = "at_risk" | "developing" | "certifiable" | "certification_ready";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Trusted HTML. Authored in the portal's TipTap editor, never user input. */
  body: string;
  coverUrl: string | null;
  authorName: string;
  authorRole: string | null;
  category: string;
  tags: string[];
  readingMinutes: number;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string;
};

export type PodcastEpisode = {
  id: string;
  slug: string;
  title: string;
  description: string;
  showNotes: string;
  /** Full episode transcript. Rendered collapsed so it stays indexable. */
  transcript: string | null;
  season: number;
  episodeNumber: number | null;
  audioUrl: string | null;
  durationSeconds: number | null;
  coverUrl: string | null;
  guests: string[];
  spotifyUrl: string | null;
  appleUrl: string | null;
  youtubeUrl: string | null;
  publishedAt: string;
};

export type WorkshopModule = {
  title: string;
  minutes: number;
  points: string[];
};

export type Workshop = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  format: WorkshopFormat;
  durationMinutes: number;
  audience: string | null;
  outcomes: string[];
  modules: WorkshopModule[];
  minParticipants: number | null;
  maxParticipants: number | null;
  coverUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
};

export type WorkshopSession = {
  id: string;
  workshopId: string;
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  location: string | null;
  trainer: string | null;
  seatsTotal: number | null;
  seatsTaken: number;
};

/**
 * A gallery album — one session, drill or event.
 *
 * Replaces the old Resource (gated PDF) type. Photos live in the
 * marketing-media bucket and carry an explicit order, so an album can be
 * curated rather than falling out in upload sequence.
 *
 * `location` and `takenOn` are nullable on purpose: an album with no confirmed
 * date is fine, an album with an invented one is not.
 */
export type GalleryAlbum = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string | null;
  takenOn: string | null;
  category: string;
  coverUrl: string | null;
  photoCount: number;
  isFeatured: boolean;
  displayOrder: number;
};

export type GalleryPhoto = {
  id: string;
  albumId: string;
  url: string;
  /** Required. A photo gallery without alt text is unusable on a screen reader. */
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  displayOrder: number;
};
