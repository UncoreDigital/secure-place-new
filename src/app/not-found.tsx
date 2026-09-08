import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * A 404 is usually someone's second-to-last click before they leave, so this
 * page routes rather than apologises: the four destinations below cover almost
 * every reason a visitor arrives here, including the old Astro URLs that no
 * longer resolve.
 */
const destinations = [
  {
    label: "Certification",
    href: "/certification",
    body: "How organisations become a certified Secure Place to Work.",
  },
  {
    label: "Secure Score",
    href: "/secure-score",
    body: "The free two-minute workplace readiness assessment.",
  },
  {
    label: "Workshops",
    href: "/workshops",
    body: "Trainer-led sessions, from evacuation drills to POSH.",
  },
  {
    label: "Resources",
    href: "/resources",
    body: "Articles, guides and the podcast.",
  },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-flame-500/8 blur-3xl"
      />

      <div className="container-page relative">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-white/75">
            <Compass className="h-3 w-3 text-flame-500" />
            Error 404
          </span>

          <h1 className="mt-7 text-fluid-2xl font-bold text-white">
            We could not find that page
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/70">
            The link may be out of date, or the page may have moved during our
            recent site rebuild. Here is where most people are heading.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/" size="lg">
              Back to the homepage
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contact" variant="outline" size="lg" className="text-white">
              Tell us what broke
            </Button>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="group bg-navy-950 p-6 transition-colors duration-300 hover:bg-navy-900"
            >
              <span className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                {destination.label}
                <ArrowRight className="h-4 w-4 -translate-x-1 text-flame-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
              <span className="mt-3 block text-base leading-relaxed text-white/60">
                {destination.body}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
