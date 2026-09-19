"use client";

import Link from "next/link";
import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight, CalendarPlus, Clock, Search, Users, X } from "lucide-react";
import type { WorkshopFormat } from "@/lib/content/types";
import { cn } from "@/lib/utils";

export type CatalogueWorkshop = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  format: WorkshopFormat;
  durationMinutes: number;
  audience: string | null;
  minParticipants: number | null;
  maxParticipants: number | null;
  coverUrl: string | null;
};

const formatLabel: Record<WorkshopFormat, string> = {
  onsite: "On site",
  virtual: "Virtual",
  hybrid: "Hybrid",
};

/**
 * Cards per page. The catalogue is heading past fifty; at two per row that is
 * twenty-five rows in one scroll. Every workshop is still in the sitemap, so
 * paging here costs crawlers nothing.
 */
const PAGE = 12;

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/**
 * The workshops index: search, format filter and a paged two-up grid.
 *
 * The cards deliberately do not carry `.reveal`. RevealProvider scans for
 * those once per pathname, so a card that mounts later — after a search or a
 * "Show more" — would be hidden by the armed CSS and never observed.
 */
export default function WorkshopCatalogue({ workshops }: { workshops: CatalogueWorkshop[] }) {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<WorkshopFormat | "all">("all");
  const [limit, setLimit] = useState(PAGE);
  const deferredQuery = useDeferredValue(query);

  // Only offer the formats that exist; a "Virtual" chip that always returns
  // nothing is a dead end.
  const formats = useMemo(() => {
    const counts = new Map<WorkshopFormat, number>();
    for (const w of workshops) counts.set(w.format, (counts.get(w.format) ?? 0) + 1);
    return (Object.keys(formatLabel) as WorkshopFormat[])
      .filter((f) => counts.has(f))
      .map((f) => ({ value: f, count: counts.get(f)! }));
  }, [workshops]);

  const results = useMemo(() => {
    const terms = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return workshops.filter((w) => {
      if (format !== "all" && w.format !== format) return false;
      if (!terms.length) return true;
      const haystack = `${w.title} ${w.summary} ${w.audience ?? ""}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [workshops, deferredQuery, format]);

  const shown = results.slice(0, limit);
  const remaining = results.length - shown.length;
  const filtered = query.trim() !== "" || format !== "all";

  const reset = () => {
    setQuery("");
    setFormat("all");
    setLimit(PAGE);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-md">
          <span className="sr-only">Search workshops</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            placeholder="Search by topic — fire, POSH, first aid…"
            className="h-12 w-full rounded-full border border-mist-200 bg-white pl-11 pr-11 text-base text-navy-950 transition-[border-color,box-shadow] placeholder:text-mist-400 focus:border-flame-500 focus:outline-none focus:ring-4 focus:ring-flame-500/15 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setLimit(PAGE);
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-mist-400 transition-colors hover:bg-mist-100 hover:text-navy-950"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        {formats.length > 1 && (
          <div role="group" aria-label="Filter by format" className="flex flex-wrap gap-2">
            {[{ value: "all" as const, count: workshops.length }, ...formats].map((f) => {
              const on = format === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setFormat(f.value);
                    setLimit(PAGE);
                  }}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
                    on
                      ? "border-navy-950 bg-navy-950 text-white"
                      : "border-mist-200 bg-white text-mist-600 hover:border-mist-300 hover:text-navy-950",
                  )}
                >
                  {f.value === "all" ? "All" : formatLabel[f.value]}
                  <span
                    className={cn(
                      "font-mono text-2xs tabular-nums",
                      on ? "text-white/60" : "text-mist-400",
                    )}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-mist-500">
        {filtered
          ? `${results.length} of ${workshops.length} workshops match`
          : `${workshops.length} workshops`}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-mist-300 px-6 py-14 text-center">
          <p className="font-display text-xl font-semibold text-navy-950">
            No workshop matches that yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-base text-mist-500">
            Try a broader word, or ask us — most sessions can be built around
            what your site needs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={reset}
              className="text-base font-semibold text-navy-950 hover:text-flame-700"
            >
              Clear filters
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-base font-semibold text-flame-700 hover:text-flame-600"
            >
              Request a custom workshop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {shown.map((w) => (
            <li key={w.id} className="flex">
              <WorkshopCard workshop={w} />
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE)}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-mist-200 bg-white px-6 text-base font-semibold text-navy-950 transition-colors hover:border-navy-950"
          >
            Show {Math.min(PAGE, remaining)} more
            <span className="font-mono text-2xs text-mist-400">{remaining} left</span>
          </button>
        </div>
      )}
    </div>
  );
}

function WorkshopCard({ workshop: w }: { workshop: CatalogueWorkshop }) {
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white transition-[border-color,box-shadow,transform] duration-300 focus-within:ring-2 focus-within:ring-flame-500 focus-within:ring-offset-2 hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-(--shadow-e2)">
      {w.coverUrl && (
        /* The covers are 700x249 banners with the workshop name set into the
           artwork. Rendered at exactly that ratio, object-cover has nothing
           to crop — any other box (a tall side column, 16/10) sliced the
           lettering off. Half the grid is also about the source's own width,
           so it is not upscaled. */
        <div className="relative aspect-[700/249] overflow-hidden bg-mist-100">
          <Image
            src={w.coverUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 640px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2 text-2xs">
          <span className="rounded-full bg-flame-500/10 px-2.5 py-1 font-mono font-semibold uppercase tracking-[0.12em] text-flame-700">
            {formatLabel[w.format] ?? w.format}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-2.5 py-1 font-mono font-semibold uppercase tracking-[0.12em] text-mist-600">
            <Clock className="h-3 w-3" />
            {formatDuration(w.durationMinutes)}
          </span>
          {w.maxParticipants && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-2.5 py-1 font-mono font-semibold uppercase tracking-[0.12em] text-mist-600">
              <Users className="h-3 w-3" />
              {w.minParticipants ?? 1}–{w.maxParticipants}
            </span>
          )}
        </div>

        <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-navy-950 transition-colors group-hover:text-flame-700 md:text-2xl">
          {/* Stretched over the whole card, so the card is one target and one
              tab stop — the footer below is its label, not a second link. */}
          <Link
            href={`/workshops/${w.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          >
            {w.title}
          </Link>
        </h2>

        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-mist-500">{w.summary}</p>

        {w.audience && (
          <p className="mt-3 line-clamp-1 text-sm text-mist-400" title={w.audience}>
            <span className="font-semibold text-mist-600">For:</span> {w.audience}
          </p>
        )}

        {/* Grows so every card's footer sits on its floor and the rules line
            up across a row; the margin keeps a minimum gap above it. */}
        <div aria-hidden className="mt-6 flex-1" />

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-mist-100 pt-5">
          <span className="inline-flex items-center gap-2 text-base font-semibold text-navy-950 transition-colors group-hover:text-flame-700">
            View full outline
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          {/* Workshops are arranged per client rather than run to a public
              calendar, so this says how booking works instead of a date. */}
          <span className="flex items-center gap-2 text-sm text-mist-500">
            <CalendarPlus className="h-3.5 w-3.5 text-flame-500" />
            Arranged on your dates
          </span>
        </div>
      </div>
    </article>
  );
}
