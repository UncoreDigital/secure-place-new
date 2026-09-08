"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A grid tile that reveals on scroll and lifts under the pointer.
 *
 * Renders an <a> when given href so the whole tile stays one link target, and
 * a plain container otherwise. Hover uses a spring rather than a duration so
 * an interrupted movement settles instead of snapping.
 */
export default function MotionCard({
  children,
  href,
  className,
  delay = 0,
  lift = -6,
  id,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  delay?: number;
  lift?: number;
  id?: string;
}) {
  const reduce = useReducedMotion();

  const motionProps = {
    "data-motion": true,
    id,
    className,
    initial: reduce ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 0.7, ease: EASE, delay },
    whileHover: reduce ? undefined : { y: lift },
  } as const;

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className="flex h-full w-full flex-col">
          {children}
        </Link>
      </motion.div>
    );
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}
