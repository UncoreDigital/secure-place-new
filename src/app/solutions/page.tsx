import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { capabilities } from "@/lib/capabilities";
import PageHero from "@/components/site/PageHero";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Emergency alerting, drill management, employee safety data, emergency contact directory, medical training and certified training classes — in one platform.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="What the platform does"
        title="Smart solutions built for safer workspaces"
        lede="Six capabilities covering the moment an incident starts, the training that prepares for it, and the records that prove you were ready."
        crumbs={[{ label: "Solutions" }]}
      >
        <nav aria-label="Jump to a capability">
          <ul className="flex flex-wrap gap-2">
            {capabilities.map((cap) => (
              <li key={cap.id}>
                <a
                  href={`#${cap.id}`}
                  className="inline-block rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/35 hover:text-white"
                >
                  {cap.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <section className="bg-white section-y-sm">
        <div className="container-page">
          <div className="flex flex-col">
            {capabilities.map((cap, i) => (
              <article
                key={cap.id}
                id={cap.id}
                className="reveal grid gap-8 border-t border-mist-200 py-12 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-14 md:py-16"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-950 text-flame-500">
                      <cap.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-semibold tabular-nums text-mist-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-navy-950">
                    {cap.title}
                  </h2>
                  <p className="mt-3 text-md leading-relaxed text-mist-500">{cap.body}</p>
                </div>

                <div>
                  <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-mist-100">
                    <Image
                      src={cap.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-6 text-md leading-relaxed text-mist-600">{cap.detail}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {cap.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 rounded-xl bg-mist-50 px-4 py-3 text-base text-mist-600"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flame-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist-50 section-y-sm">
        <div className="container-page">
          <div className="reveal rounded-2xl bg-navy-950 px-7 py-12 text-center md:px-14 md:py-16">
            <h2 className="mx-auto max-w-2xl text-fluid-md font-bold leading-[1.1] text-white">
              See it running on your own sites
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-md leading-relaxed text-white/65">
              A short walkthrough of alerting, drills and the certification path,
              set up against your locations and shift patterns.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/demo" size="lg">
                Request a demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/certification" variant="outline" size="lg" className="text-white">
                How certification works
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
