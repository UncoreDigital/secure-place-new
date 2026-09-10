"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Counter from "@/components/site/Counter";
import { FadeUp, RevealLines } from "@/components/motion/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

type Stat = { value: number; suffix: string; label: string };

export default function Hero({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // The photograph drifts slower than the page and dims as it leaves, so the
  // hero has depth without the copy ever losing contrast.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/assets/img/hero/bg-1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/*
        One overlay, not three.

        This previously stacked a flat bg-navy-950/80 *and* a gradient starting
        at full navy on top of it — compositing to 100% opaque navy on the left
        and ~88% at the right edge, which painted the photograph out entirely.

        Now the scrim is weighted to where the text actually sits: dense behind
        the headline on the left, thinning across to the right where only the
        demo card sits, and that card carries its own translucent panel. The
        stats strip below has solid navy cells of its own, so it needs no scrim.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-navy-950/70 md:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-navy-950/92 from-10% via-navy-950/68 via-55% to-navy-950/18 md:block"
      />

      {/* A slow ember drifting behind the headline — one ambient element, not five. */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/4 -z-10 h-96 w-96 rounded-full bg-flame-500/12 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, -40, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-page relative"
      >
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <FadeUp delay={0.05}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-flame-500"
                  animate={reduce ? undefined : { opacity: [1, 0.35, 1], scale: [1, 0.85, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                First workplace safety platform
              </span>
            </FadeUp>

            <h1 className="mt-7 max-w-3xl text-fluid-3xl font-bold leading-[0.98] text-white">
              <RevealLines
                delay={0.15}
                lines={[
                  "Make your company",
                  <>
                    a <span className="text-flame-500">Secure Place</span>
                    <span className="align-super text-[0.4em] text-flame-500">™</span>
                  </>,
                ]}
              />
            </h1>

            <FadeUp delay={0.5}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                Emergency readiness, employee empowerment and safety
                certification — all in one application.
              </p>
            </FadeUp>

            <FadeUp delay={0.62}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/certification" size="lg">
                  Get certified
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/secure-score" variant="outline" size="lg" className="text-white">
                  How secure is your workplace?
                </Button>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.74}>
            <motion.div
              whileHover={reduce ? undefined : { y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-md"
            >
              <p className="text-sm text-white/60">Achieve workplace safety certification</p>
              <Link
                href="/demo"
                className="group mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-white"
              >
                <span className="font-display text-lg font-semibold">Request a demo</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-flame-500 transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </FadeUp>
        </div>

        <motion.dl
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.86 }}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={reduce ? undefined : { backgroundColor: "rgba(255,95,21,0.08)" }}
              transition={{ duration: 0.25 }}
              className="bg-navy-950 px-5 py-7 text-center"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-4xl font-bold leading-none text-white">
                  <Counter to={stat.value} suffix={stat.suffix} delayMs={900 + i * 90} />
                </span>
                <span className="mt-3 block text-sm text-white/55">{stat.label}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue — disappears the moment the reader takes the hint. */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]) }}
          className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-2">
            <motion.span
              className="h-1.5 w-1 rounded-full bg-flame-500"
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
