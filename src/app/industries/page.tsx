import type { Metadata } from "next";
import { ArrowRight, GraduationCap, Building2, Factory, Cpu, Flame } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Industries we serve",
  description:
    "Workplace safety training and certification for education institutions, offices and tech companies, manufacturing and warehouses, IT parks, and high-risk environments.",
};

/** Copy carried across from the live site's industries pages. */
const industries = [
  {
    icon: GraduationCap,
    title: "Education institutions",
    body: "Create secure learning spaces with POSH awareness, evacuation drills and basic life support training for staff and students.",
    focus: ["POSH awareness", "Evacuation drills", "Basic life support"],
  },
  {
    icon: Building2,
    title: "Offices and tech companies",
    body: "Ensure a safe, inclusive and regulation-compliant work environment with structured POSH training and essential emergency preparedness for dynamic office spaces.",
    focus: ["Structured POSH training", "Emergency preparedness", "Floor warden coverage"],
  },
  {
    icon: Factory,
    title: "Manufacturing and warehouses",
    body: "Equip on-ground teams with life-saving fire safety drills and medical training to handle on-site risks and industrial hazards.",
    focus: ["Fire safety drills", "Medical response", "Shift-pattern coverage"],
  },
  {
    icon: Cpu,
    title: "IT parks, startups and MNCs",
    body: "Promote a safe and compliant workplace culture with focused POSH training and emergency protocols tailored for corporate environments.",
    focus: ["Multi-tenant coordination", "POSH compliance", "Emergency protocols"],
  },
  {
    icon: Flame,
    title: "High-risk environments",
    body: "Empower your staff with real-time response training and certifications to tackle fires, medical crises and workplace emergencies.",
    focus: ["Real-time response", "Crisis certification", "Incident escalation"],
  },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our industries"
        title="Industries we always help"
        lede="The hazards differ, the obligations differ, and so does the training. These are the environments we work in most."
        crumbs={[{ label: "Industries" }]}
      />

      <section className="bg-white section-y">
        <div className="container-page">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-mist-200 bg-mist-200 md:grid-cols-2">
            {industries.map((industry, i) => (
              <article
                key={industry.title}
                className="reveal group flex flex-col bg-white p-7 transition-colors duration-300 hover:bg-mist-50 md:p-9"
                data-reveal-delay={i * 60}
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-950 text-flame-500 transition-colors duration-300 group-hover:bg-flame-500 group-hover:text-white">
                  <industry.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold leading-snug text-navy-950">
                  {industry.title}
                </h2>
                <p className="mt-3 flex-1 text-base leading-relaxed text-mist-500">
                  {industry.body}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 border-t border-mist-100 pt-5">
                  {industry.focus.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            <div className="reveal flex flex-col justify-center bg-navy-950 p-7 md:p-9">
              <h2 className="font-display text-2xl font-semibold leading-snug text-white">
                Not on this list?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/65">
                The five pillars apply to any workplace. Tell us about your sites
                and shift patterns and we will map the programme to them.
              </p>
              <div className="mt-6">
                <Button href="/contact">
                  Talk to us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist-50 section-y">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Start somewhere"
            title="Find out where you stand first"
            lede="Before choosing a programme, take two minutes to see which of the five pillars is actually holding your score down."
            className="mx-auto items-center"
          />
          <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/secure-score" size="lg">
              Take the Secure Score
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/workshops" variant="outline" size="lg" className="text-navy-950">
              Browse workshops
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
