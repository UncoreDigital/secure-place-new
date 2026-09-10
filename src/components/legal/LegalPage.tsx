import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import PageHero from "@/components/site/PageHero";

/**
 * A blank only the client can fill — registered entity, address, jurisdiction,
 * retention periods.
 *
 * Rendered loud on purpose. A legal page is exactly the kind of document that
 * gets skimmed and shipped, and a placeholder styled to blend in would go live
 * unnoticed. This one is impossible to miss in a browser.
 */
export function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="mx-0.5 rounded bg-flame-500/15 px-2 py-0.5 font-mono text-sm font-semibold text-flame-700 ring-1 ring-flame-500/40">
      [{children}]
    </mark>
  );
}

export type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export default function LegalPage({
  eyebrow,
  title,
  lede,
  sections,
  reviewNote,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  sections: Section[];
  reviewNote: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={lede} crumbs={[{ label: title }]} />

      <section className="bg-white section-y-sm">
        <div className="container-page">
          {/* Status banner. Removed once counsel has signed the document off. */}
          <div className="mb-12 flex gap-4 rounded-2xl border border-flame-500/30 bg-flame-500/[0.06] p-5 md:p-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-flame-700" />
            <div>
              <p className="font-display text-lg font-semibold text-navy-950">
                Draft — not yet reviewed by counsel
              </p>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-mist-600">
                {reviewNote} Every highlighted field below needs a real value,
                and the whole document needs legal sign-off before this page goes
                live.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-mist-400">
                On this page
              </p>
              <ol className="mt-4 flex flex-col gap-1 border-l border-mist-200">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link
                      href={`#${section.id}`}
                      className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-base text-mist-500 transition-colors hover:border-flame-500 hover:text-navy-950"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-[44rem]">
              {sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="border-t border-mist-200 py-10 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm font-semibold tabular-nums text-flame-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-navy-950">
                      {section.title}
                    </h2>
                  </div>
                  <div
                    className="mt-5 flex flex-col gap-4 text-md leading-[1.75] text-mist-600
                      [&_a]:font-medium [&_a]:text-flame-700 [&_a]:underline
                      [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy-950
                      [&_li]:list-disc [&_li]:marker:text-flame-500
                      [&_strong]:font-semibold [&_strong]:text-navy-950
                      [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5"
                  >
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
