import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import { site } from "@/lib/site";
import PageHero from "@/components/site/PageHero";
import LeadForm from "@/components/site/LeadForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about workplace safety certification, training workshops or a platform demo.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us"
        lede="Whether you are exploring certification, booking a workshop or just want to know where to start — tell us what you need."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white section-y">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-950">
                How to reach us
              </h2>

              <div className="mt-7 flex flex-col gap-6">
                <a href={`mailto:${site.email}`} className="group flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-950 text-flame-500">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-wider text-mist-400">
                      Email
                    </span>
                    <span className="mt-1 block text-md text-navy-950 group-hover:text-flame-700">
                      {site.email}
                    </span>
                  </span>
                </a>

                <a href={site.phoneHref} className="group flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-950 text-flame-500">
                    <Phone className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-wider text-mist-400">
                      Phone
                    </span>
                    <span className="mt-1 block text-md text-navy-950 group-hover:text-flame-700">
                      {site.phone}
                    </span>
                  </span>
                </a>

                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mist-100 text-mist-500">
                    <Clock className="h-4.5 w-4.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-wider text-mist-400">
                      Response time
                    </span>
                    <span className="mt-1 block text-md text-navy-950">
                      Within one working day
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-mist-200 p-7 md:p-9">
              <h2 className="font-display text-2xl font-bold text-navy-950">
                Send us a message
              </h2>
              <p className="mt-2 text-base text-mist-500">
                We read every one.
              </p>
              <div className="mt-8">
                <LeadForm source="contact" submitLabel="Send message" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
