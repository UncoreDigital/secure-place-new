"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { Menu, X, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { site, logo } from "@/lib/site";
import { headerCta, navEntries, buildWorkshopsPanel } from "@/lib/nav";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

type WorkshopNav = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  format: string;
};

export default function Header({ workshops }: { workshops: WorkshopNav[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();

  const entries = useMemo(
    () =>
      navEntries.map((entry) =>
        entry.label === "Workshops"
          ? { ...entry, mega: buildWorkshopsPanel(workshops) }
          : entry,
      ),
    [workshops],
  );

  // Reading-progress rail along the very top of the header.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });

  useMotionValueEvent(useScroll().scrollY, "change", (y) => setScrolled(y > 24));

  const overHero = pathname === "/";

  useEffect(() => {
    setOpen(false);
    setMenu(null);
    setMobileSub(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menu]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const solid = scrolled || !overHero || open || menu !== null;

  const openMenu = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const active = entries.find((e) => e.label === menu);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          solid
            ? "border-b border-navy-950/10 bg-white/90 backdrop-blur-xl"
            : "border-b border-white/10 bg-transparent",
        )}
      >
        {/* scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-flame-500"
          aria-hidden
        />

        <div className="container-page flex items-center justify-between gap-6 py-3">
          <Link href="/" className="group flex shrink-0 items-center" aria-label={`${site.name} home`}>
            <motion.span
              whileHover={reduce ? undefined : { scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="block"
            >
              <Image
                src={solid ? logo.onLight : logo.onDark}
                alt={site.name}
                width={logo.width}
                height={logo.height}
                priority
                className="h-10 w-auto object-contain md:h-11"
              />
            </motion.span>
          </Link>

          <div ref={navRef} className="hidden items-center gap-1 lg:flex">
            <nav className="flex items-center" aria-label="Primary" onMouseLeave={scheduleClose}>
              {entries.map((entry) => {
                const on = isActive(entry.href);
                const expanded = menu === entry.label;

                const inner = (
                  <>
                    <span className="relative z-10">{entry.label}</span>
                    {entry.mega && (
                      <ChevronDown
                        className={cn(
                          "relative z-10 h-3.5 w-3.5 transition-transform duration-300",
                          expanded && "rotate-180",
                        )}
                      />
                    )}
                    {/* Shared pill that slides between items */}
                    {expanded && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-navy-950/[0.06]"
                      />
                    )}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 bottom-1 h-px origin-left bg-flame-500 transition-transform duration-300",
                        on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </>
                );

                const classes = cn(
                  "group relative flex items-center gap-1 rounded-full px-4 py-2 text-base font-medium transition-colors",
                  solid
                    ? on || expanded
                      ? "text-navy-950"
                      : "text-mist-500 hover:text-navy-950"
                    : on || expanded
                      ? "text-white"
                      : "text-white/75 hover:text-white",
                );

                if (!entry.mega) {
                  return (
                    <Link
                      key={entry.label}
                      href={entry.href}
                      aria-current={on ? "page" : undefined}
                      className={classes}
                      onMouseEnter={() => setMenu(null)}
                    >
                      {inner}
                    </Link>
                  );
                }

                return (
                  <button
                    key={entry.label}
                    type="button"
                    aria-expanded={expanded}
                    aria-haspopup="true"
                    onMouseEnter={() => openMenu(entry.label)}
                    onFocus={() => openMenu(entry.label)}
                    onClick={() => (expanded ? setMenu(null) : openMenu(entry.label))}
                    className={classes}
                  >
                    {inner}
                  </button>
                );
              })}
            </nav>

            <div className="ml-3 flex items-center gap-2">
              <Button
                href={headerCta.secondary.href}
                variant="outline"
                className={solid ? "text-navy-950" : "text-white"}
              >
                <headerCta.secondary.icon className="h-4 w-4" />
                {headerCta.secondary.label}
              </Button>
              <Button href={headerCta.primary.href}>
                {headerCta.primary.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden",
              solid
                ? "border-navy-950/15 text-navy-950 hover:bg-navy-950/5"
                : "border-white/25 text-white hover:bg-white/10",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* ---------------------------------------------------- mega panel */}
        <AnimatePresence>
          {active?.mega && (
            <motion.div
              key="mega"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: EASE }}
              onMouseEnter={() => openMenu(active.label)}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full hidden border-b border-navy-950/10 bg-white/95 backdrop-blur-xl lg:block"
            >
              <motion.div
                layout
                className="container-page grid gap-8 py-8"
                style={{
                  gridTemplateColumns: active.mega.feature
                    ? "minmax(0,1fr) minmax(0,1fr) minmax(0,0.85fr)"
                    : "minmax(0,1fr) minmax(0,1fr)",
                }}
              >
                {active.mega.columns.map((column, ci) => (
                  <div key={ci}>
                    {column.title && (
                      <p className="mb-3 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-mist-400">
                        {column.title}
                      </p>
                    )}
                    <ul className="flex flex-col gap-0.5">
                      {column.items.map((item, ii) => (
                        <motion.li
                          key={item.href + item.label}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: EASE,
                            delay: 0.03 * (ci * 3 + ii),
                          }}
                        >
                          <Link
                            href={item.href}
                            className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-mist-50"
                          >
                            {item.icon && (
                              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mist-100 text-navy-950 transition-colors duration-300 group-hover/item:bg-flame-500 group-hover/item:text-white">
                                <item.icon className="h-4 w-4" />
                              </span>
                            )}
                            <span className="min-w-0 flex-1">
                              {/*
                                The meta chip is pinned to the top right and
                                may not shrink or wrap. Sitting inline after the
                                label, it got squeezed the moment a long title
                                like "Emergency Response & Evacuation Readiness"
                                broke onto a second line — "3 HR" wrapped mid-chip
                                and the pill collapsed into a circle.
                              */}
                              <span className="flex items-start justify-between gap-3">
                                <span className="font-display text-base font-semibold text-navy-950">
                                  {item.label}
                                  <ChevronRight className="ml-1 inline h-3.5 w-3.5 -translate-x-1 align-[-0.15em] text-flame-500 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                                </span>
                                {item.meta && (
                                  <span className="mt-px shrink-0 whitespace-nowrap rounded-full bg-flame-500/10 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-flame-700">
                                    {item.meta}
                                  </span>
                                )}
                              </span>
                              {item.description && (
                                <span className="mt-1 block text-sm leading-snug text-mist-400">
                                  {item.description}
                                </span>
                              )}
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}

                {active.mega.feature && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE, delay: 0.08 }}
                    className="self-start"
                  >
                    <Link
                      href={active.mega.feature.href}
                      className="group/feat relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-navy-950 p-6"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-flame-500/20 blur-2xl transition-transform duration-500 group-hover/feat:scale-125"
                      />
                      <span className="relative">
                        <span className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-400">
                          {active.mega.feature.eyebrow}
                        </span>
                        <span className="mt-3 block font-display text-lg font-semibold leading-snug text-white">
                          {active.mega.feature.title}
                        </span>
                        {active.mega.feature.meta && (
                          <span className="mt-3 block font-mono text-sm font-semibold tabular-nums text-white">
                            {active.mega.feature.meta}
                          </span>
                        )}
                        <span className="mt-1 block text-sm leading-relaxed text-white/60">
                          {active.mega.feature.body}
                        </span>
                      </span>
                      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-flame-400">
                        {active.mega.feature.cta}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/feat:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------- mobile */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="overflow-hidden border-t border-navy-950/10 bg-white lg:hidden"
            >
              <nav
                className="container-page flex max-h-[calc(100vh-5rem)] flex-col overflow-y-auto py-3"
                aria-label="Primary mobile"
              >
                {entries.map((entry, i) => {
                  const expanded = mobileSub === entry.label;
                  const items = entry.mega?.columns.flatMap((c) => c.items) ?? [];

                  return (
                    <motion.div
                      key={entry.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: EASE, delay: 0.04 * i }}
                      className="border-b border-mist-100"
                    >
                      {items.length === 0 ? (
                        <Link href={entry.href} className="block py-4">
                          <span className="font-display text-lg font-semibold text-navy-950">
                            {entry.label}
                          </span>
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-expanded={expanded}
                            onClick={() => setMobileSub(expanded ? null : entry.label)}
                            className="flex w-full items-center justify-between gap-4 py-4 text-left"
                          >
                            <span className="font-display text-lg font-semibold text-navy-950">
                              {entry.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 text-mist-400 transition-transform duration-300",
                                expanded && "rotate-180",
                              )}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: EASE }}
                                className="overflow-hidden pl-1"
                              >
                                {items.map((item) => (
                                  <li key={item.href + item.label}>
                                    <Link
                                      href={item.href}
                                      className="flex items-center gap-3 py-3 text-base text-mist-600"
                                    >
                                      <span className="h-1 w-1 shrink-0 rounded-full bg-flame-500" />
                                      {item.label}
                                      {item.meta && (
                                        <span className="rounded-full bg-flame-500/10 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-flame-700">
                                          {item.meta}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                                <li className="pb-2 pt-1">
                                  <Link
                                    href={entry.href}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-flame-700"
                                  >
                                    All {entry.label.toLowerCase()}
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </Link>
                                </li>
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </motion.div>
                  );
                })}

                <div className="flex flex-col gap-3 pb-6 pt-5">
                  <Button href="/secure-score" variant="outline" size="lg" className="text-navy-950">
                    Take the Secure Score
                  </Button>
                  <Button href="/certification" size="lg">
                    Get certified
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Dim the page behind an open mega panel so the menu reads as a layer. */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onMouseEnter={() => setMenu(null)}
            className="fixed inset-0 z-40 hidden bg-navy-950/20 backdrop-blur-[2px] lg:block"
            aria-hidden
          />
        )}
      </AnimatePresence>
    </>
  );
}
