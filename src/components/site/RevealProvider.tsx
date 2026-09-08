"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveal for elements marked with the `.reveal` class.
 *
 * Content ships visible from the server. This only arms the hidden starting
 * state — via `data-reveal-armed` on <html> — once it has confirmed it can
 * observe and un-hide again, so a blocked or failed bundle leaves a readable
 * page rather than a blank one.
 *
 * KEYED TO THE PATHNAME, and that is the whole point.
 *
 * This component lives in the root layout, which does not remount on a
 * client-side navigation. With an empty dependency array it ran exactly once
 * per full page load: the `data-reveal-armed` attribute stayed set, so every
 * newly navigated page's `.reveal` elements were hidden by CSS, while the
 * observer was still watching the previous page's unmounted nodes. Nothing ever
 * un-hid them. The page looked empty until a hard reload re-ran the effect.
 *
 * Re-running per pathname re-scans the DOM that is actually mounted now.
 */
export default function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let frame = 0;
    let observer: IntersectionObserver | null = null;

    // Wait a frame. A navigation to a hash target (/solutions#emergency-alert)
    // scrolls after commit, so measuring immediately would classify elements
    // against the wrong scroll position.
    frame = requestAnimationFrame(() => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"),
      );
      if (!targets.length) return;

      document.documentElement.setAttribute("data-reveal-armed", "true");

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.revealDelay ?? 0);
            window.setTimeout(() => el.classList.add("is-visible"), delay);
            observer?.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
      );

      for (const el of targets) {
        // Anything already on screen — or scrolled past, which is what happens
        // when you land on an anchor partway down — is shown immediately, so
        // the first frame after navigation is complete rather than empty.
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        } else {
          observer.observe(el);
        }
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      // The armed attribute is deliberately left in place. Removing it between
      // navigations would flash every not-yet-processed element to full opacity
      // for a frame before hiding it again.
    };
  }, [pathname]);

  return null;
}
