import Image from "next/image";

import { logo, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The brand lockup: the handshake mark plus the company name as live text.
 *
 * The name is text rather than part of the image so it stays selectable, scales
 * with the type ramp and survives at small sizes, where a 512px-wide lockup PNG
 * turned the wordmark to mush.
 *
 * `tone` is the ground the lockup sits on, not the colour of the lockup itself.
 * On navy the mark's navy half would disappear, so it gets either the supplied
 * knocked-out variant or, failing that, a white tile to sit on.
 */
export function Logo({
  tone = "light",
  className,
  markClassName = "h-9 md:h-10",
  showName = true,
}: {
  tone?: "light" | "dark";
  className?: string;
  /** Height of the mark. The name scales with the type ramp, not with this. */
  markClassName?: string;
  showName?: boolean;
}) {
  const onDark = tone === "dark";
  const src = onDark ? logo.markOnDark ?? logo.mark : logo.mark;
  const needsTile = onDark && !logo.markOnDark;

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "block shrink-0",
          needsTile && "rounded-lg bg-white p-1.5",
        )}
      >
        <Image
          src={src}
          alt={showName ? "" : site.name}
          aria-hidden={showName || undefined}
          width={logo.markWidth}
          height={logo.markHeight}
          priority
          className={cn("w-auto object-contain", markClassName)}
        />
      </span>

      {showName ? (
        <span
          className={cn(
            "text-[1.05rem] font-semibold leading-tight tracking-tight md:text-lg",
            onDark ? "text-white" : "text-navy-950",
          )}
        >
          {site.name}
        </span>
      ) : null}
    </span>
  );
}
