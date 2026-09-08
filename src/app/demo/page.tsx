import type { Metadata } from "next";
import { Check } from "lucide-react";
import { site } from "@/lib/site";
import PageHero from "@/components/site/PageHero";
import LeadForm from "@/components/site/LeadForm";

export const metadata: Metadata = {
  title: "Request a demo",
  description:
    "See emergency alerting, drill management and the certification path running against your own locations and shift patterns.",
};

const covered = [
  "SOS alerting from an employee's phone to security and volunteers",
  "Launching a drill and reading the participation report",
  "Assigning guards and volunteers per location",
  "The certification survey and what the audit looks for",
  "Timeline and onboarding for your organisation",
];

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Demo"
        title="See it running on your own sites"
        lede="A short walkthrough, set up against your locations. No commitment to certify."
        crumbs={[{ label: "Demo" }]}
      />

      <section className="bg-white section-y">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-950">
                What we will cover
              </h2>
              <ul className="mt-7 flex flex-col gap-4">
                {covered.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-flame-500/12">
                      <Check className="h-3 w-3 text-flame-700" />
                    </span>
                    <span className="text-base leading-relaxed text-mist-600">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 rounded-xl border border-mist-200 bg-mist-50 p-5">
                <p className="text-base leading-relaxed text-mist-500">
                  Prefer to check where you stand first? The{" "}
                  <a href="/secure-score" className="font-semibold text-flame-700 hover:underline">
                    Secure Score
                  </a>{" "}
                  takes two minutes and needs no call.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-mist-200 p-7 md:p-9">
              <h2 className="font-display text-2xl font-bold text-navy-950">
                Book your walkthrough
              </h2>
              <p className="mt-2 text-base text-mist-500">
                Or email us directly at{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-flame-700 hover:underline">
                  {site.email}
                </a>
                .
              </p>
              <div className="mt-8">
                <LeadForm source="demo" submitLabel="Request demo" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
