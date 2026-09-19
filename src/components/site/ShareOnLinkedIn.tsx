"use client";

import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** A path like `/resources/blog/some-slug`, or an absolute URL. */
  url: string;
  className?: string;
  /** Icon-only compact variant; the label stays available to screen readers. */
  iconOnly?: boolean;
};

const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 640;

/**
 * Opens LinkedIn's share composer for a page, in a centred popup.
 *
 * Only the URL is sent. LinkedIn no longer takes a title or summary as
 * parameters; it crawls the page and builds the preview card from its Open
 * Graph tags, which the article route renders server-side in generateMetadata.
 *
 * Colour inherits from the parent (`text-current`), so the same button sits on
 * the white cards and the navy article header; hover and focus switch to
 * LinkedIn blue, which holds contrast on both.
 */
export default function ShareOnLinkedIn({ url, className, iconOnly = false }: Props) {
  function share(e: React.MouseEvent<HTMLButtonElement>) {
    // Cards wrap a link; the button must never trigger it.
    e.preventDefault();
    e.stopPropagation();

    const absoluteUrl = new URL(url, window.location.origin).toString();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}`;

    const left = window.screenX + Math.max(0, (window.outerWidth - POPUP_WIDTH) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - POPUP_HEIGHT) / 2);

    // No `noopener` in the features string: with it, Chrome returns null even
    // when the popup opened, and the blocked-popup fallback below would open a
    // second tab. The opener link is cut by hand instead.
    const popup = window.open(
      shareUrl,
      "share-linkedin",
      `popup=yes,width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${Math.round(left)},top=${Math.round(top)},scrollbars=yes,resizable=yes`,
    );

    if (popup) {
      popup.opener = null;
    } else {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Share on LinkedIn"
      title="Share on LinkedIn"
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-current/20 text-sm font-semibold text-current",
        "transition-colors duration-200",
        "hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white",
        "focus-visible:rounded-full focus-visible:outline-[#0A66C2]",
        "active:bg-[#004182]",
        iconOnly ? "w-8" : "px-3.5",
        className,
      )}
    >
      <Linkedin className="h-3.5 w-3.5" aria-hidden />
      {!iconOnly && <span>Share</span>}
    </button>
  );
}
