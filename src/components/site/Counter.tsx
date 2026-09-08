"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  suffix?: string;
  durationMs?: number;
  /** Hold before counting, so a row of figures cascades rather than firing at once. */
  delayMs?: number;
};

/**
 * Counts up once, when scrolled into view.
 *
 * Renders the final value first. If the observer never runs, the figure is
 * still correct — animating up from zero would leave a stat reading "0" on any
 * browser where this fails.
 */
export default function Counter({ to, suffix = "", durationMs = 1600, delayMs = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let frame = 0;
    let timer = 0;
    setValue(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        timer = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(to * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }, delayMs);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [to, durationMs, delayMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
