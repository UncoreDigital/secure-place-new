"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Photo grid with a lightbox.
 *
 * Written directly rather than pulled from a library: a gallery viewer is a
 * dialog, a couple of key handlers and an <Image> — reaching for a package
 * would add more bytes than the feature is worth on a marketing site.
 */
export default function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) =>
        i === null ? null : (i + delta + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);

    // Stop the page scrolling behind the lightbox.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : photos[openIndex];

  return (
    <>
      {/*
        Deliberately a plain responsive grid rather than a masonry layout:
        uniform tiles keep the rhythm of the page, and the full aspect ratio is
        preserved in the lightbox where the photo actually gets looked at.
      */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open photo: ${photo.alt}`}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-mist-100"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/15" />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
              <span className="font-mono text-sm tabular-nums text-white/60">
                {(openIndex ?? 0) + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="relative flex flex-1 items-center justify-center px-4 pb-4"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-navy-950/60 text-white transition-colors hover:bg-white/10 md:left-6"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="relative flex max-h-full w-full max-w-5xl flex-col items-center"
              >
                <Image
                  src={active.url}
                  alt={active.alt}
                  width={active.width || 1600}
                  height={active.height || 1067}
                  sizes="(max-width: 1024px) 100vw, 64rem"
                  className="max-h-[75vh] w-auto rounded-xl object-contain"
                />
                {active.caption && (
                  <p className="mt-4 max-w-2xl text-center text-base leading-relaxed text-white/70">
                    {active.caption}
                  </p>
                )}
              </motion.div>

              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-navy-950/60 text-white transition-colors hover:bg-white/10 md:right-6"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
