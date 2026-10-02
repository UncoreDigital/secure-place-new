"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Linkedin } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    IN?: { parse?: (root?: Element) => void };
  }
}

type Props = {
  className?: string;
};

function parse(host: HTMLElement | null) {
  if (host) window.IN?.parse?.(host);
}

/**
 * LinkedIn's Follow Company plugin for the Secure Place page.
 *
 * The plugin is an iframe on linkedin.com, so the click follows the page as
 * whoever is signed in to LinkedIn *in this browser* — one click, no OAuth.
 * When the browser has no LinkedIn session, or keeps LinkedIn's cookies out of
 * the iframe (Safari, Firefox and Brave do by default), the follow request
 * fails and LinkedIn opens the company page in a new tab instead, where the
 * visitor signs in and follows. On a phone with the LinkedIn app installed,
 * that tab hands off to the app.
 *
 * in.js swaps the `IN/FollowCompany` tag for its iframe, so the tag is built
 * by hand inside a container React renders empty; had React rendered it, the
 * swap would break React's unmount. in.js scans the page once when it loads,
 * which misses a footer mounted by a later client-side navigation, so the
 * container is parsed again on mount. Parsing twice is safe: in.js marks each
 * tag it has handled and skips it after.
 *
 * Follow only: the plugin is a toggle, and pressing "Following" unfollows.
 * The site must not unfollow anyone, so once the button has been pressed it
 * goes inert for the rest of the visit. The iframe is cross-origin, so the
 * press itself is invisible here; what shows is focus moving into the iframe
 * on mousedown, then either the pointer leaving it or the page going hidden
 * as LinkedIn opens the company page in a new tab, which it does after every
 * press. Locking waits for one of those, because going inert mid-press would
 * swallow the mouseup and with it the follow. The follow state itself is
 * never readable, so a visitor who already follows sees "Following" and their
 * first press still unfollows — LinkedIn offers no way around that.
 *
 * Tracker blockers commonly block platform.linkedin.com. Until the iframe
 * appears, a plain link to the page stands in, so the footer is never left
 * with a gap.
 */
export default function FollowOnLinkedIn({ className }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const tag = document.createElement("script");
    tag.type = "IN/FollowCompany";
    tag.dataset.id = site.linkedin.companyId;
    tag.dataset.counter = "bottom";
    el.appendChild(tag);
    parse(el);

    return () => el.replaceChildren();
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el || locked) return;

    const iframeFocused = () => {
      const active = document.activeElement;
      return active instanceof HTMLIFrameElement && el.contains(active);
    };

    let pressed = false;
    // activeElement only points at the iframe once the window blur settles.
    const onBlur = () => setTimeout(() => (pressed ||= iframeFocused()));
    const onLeave = () => pressed && setLocked(true);
    const onHide = () => document.hidden && (pressed || iframeFocused()) && setLocked(true);

    window.addEventListener("blur", onBlur);
    el.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("blur", onBlur);
      el.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [locked]);

  return (
    <div className={cn("group/follow", className)}>
      <Script
        id="linkedin-platform"
        src="https://platform.linkedin.com/in.js"
        strategy="lazyOnload"
        onReady={() => parse(host.current)}
      />
      <div ref={host} inert={locked} />
      <a
        href={site.linkedin.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 text-base text-current underline-offset-4 hover:underline group-has-[iframe]/follow:hidden"
      >
        <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
        Follow us on LinkedIn
      </a>
    </div>
  );
}
