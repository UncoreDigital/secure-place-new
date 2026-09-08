import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Gauge,
  CalendarCheck,
  BadgeCheck,
  FileText,
  Mic,
  Camera,
  LayoutGrid,
  GraduationCap,
  Building2,
  Factory,
  Cpu,
  Flame,
  Users,
  Phone,
} from "lucide-react";
import { capabilities } from "./capabilities";

export type MegaItem = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  /** Right-aligned detail: a duration, a count, a status. */
  meta?: string;
};

export type MegaPanel = {
  /** Two columns of icon rows, or a single denser list. */
  layout: "grid" | "list";
  columns: { title?: string; items: MegaItem[] }[];
  /** Optional promoted card pinned to the right of the panel. */
  feature?: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
    /** Emphasised line above the body — a date, a count. */
    meta?: string;
  };
};

export type NavEntry = {
  label: string;
  href: string;
  description?: string;
  mega?: MegaPanel;
};

const certificationPanel: MegaPanel = {
  layout: "grid",
  columns: [
    {
      title: "Getting certified",
      items: [
        {
          label: "How certification works",
          href: "/certification",
          description: "The five steps, the survey and the 70% threshold",
          icon: BadgeCheck,
        },
        {
          label: "Request a demo",
          href: "/demo",
          description: "See it running against your own sites",
          icon: CalendarCheck,
        },
      ],
    },
    {
      title: "Before you apply",
      items: [
        {
          label: "Secure Score",
          href: "/secure-score",
          description: "Free two-minute readiness self-assessment",
          icon: Gauge,
          meta: "Free",
        },
        {
          label: "Industries we serve",
          href: "/industries",
          description: "Where the programme is already running",
          icon: Building2,
        },
      ],
    },
  ],
  feature: {
    eyebrow: "Free assessment",
    title: "How secure is your workplace?",
    body: "Twenty questions across five pillars. Get a score out of 100 and your three biggest gaps.",
    href: "/secure-score",
    cta: "Take the assessment",
  },
};

const solutionsPanel: MegaPanel = {
  layout: "grid",
  columns: [
    {
      title: "Respond",
      items: capabilities.slice(0, 3).map((c) => ({
        label: c.title,
        href: `/solutions#${c.id}`,
        description: c.body,
        icon: c.icon,
      })),
    },
    {
      title: "Prepare",
      items: capabilities.slice(3).map((c) => ({
        label: c.title,
        href: `/solutions#${c.id}`,
        description: c.body,
        icon: c.icon,
      })),
    },
  ],
};

const industriesPanel: MegaPanel = {
  layout: "grid",
  columns: [
    {
      items: [
        { label: "Education institutions", href: "/industries", description: "POSH awareness, drills and BLS for staff and students", icon: GraduationCap },
        { label: "Offices and tech companies", href: "/industries", description: "Structured POSH training and emergency preparedness", icon: Building2 },
        { label: "Manufacturing and warehouses", href: "/industries", description: "Fire safety drills and on-site medical response", icon: Factory },
      ],
    },
    {
      items: [
        { label: "IT parks, startups and MNCs", href: "/industries", description: "Compliant culture across multi-tenant sites", icon: Cpu },
        { label: "High-risk environments", href: "/industries", description: "Real-time response training and certification", icon: Flame },
        { label: "Something else", href: "/contact", description: "The five pillars apply to any workplace", icon: Users },
      ],
    },
  ],
};

const resourcesPanel: MegaPanel = {
  layout: "grid",
  columns: [
    {
      title: "Read and listen",
      items: [
        { label: "Blog", href: "/resources/blog", description: "Writing on drills, reporting and compliance", icon: FileText },
        { label: "Podcast", href: "/resources/podcast", description: "Conversations on keeping people safe at work", icon: Mic, meta: "Soon" },
      ],
    },
    {
      title: "Use today",
      items: [
        { label: "Photo gallery", href: "/gallery", description: "Sessions, drills and training days", icon: Camera },
        { label: "All resources", href: "/resources", description: "Everything in one place", icon: LayoutGrid },
      ],
    },
  ],
};

/**
 * Primary navigation.
 *
 * Workshops is filled in at render time from the content layer, so the menu
 * always lists the real catalogue rather than a hardcoded copy that drifts.
 */
export const navEntries: NavEntry[] = [
  { label: "Certification", href: "/certification", mega: certificationPanel },
  { label: "Solutions", href: "/solutions", mega: solutionsPanel },
  { label: "Workshops", href: "/workshops" },
  { label: "Industries", href: "/industries", mega: industriesPanel },
  { label: "Resources", href: "/resources", mega: resourcesPanel },
  { label: "About", href: "/about" },
];

export function buildWorkshopsPanel(
  workshops: { slug: string; title: string; summary: string; durationMinutes: number; format: string }[],
): MegaPanel {
  const half = Math.ceil(workshops.length / 2);
  const toItem = (w: (typeof workshops)[number]): MegaItem => ({
    label: w.title,
    href: `/workshops/${w.slug}`,
    description: w.summary,
    icon: GraduationCap,
    meta: `${Math.round(w.durationMinutes / 60)} hr`,
  });

  return {
    layout: "grid",
    columns: [
      { title: "Catalogue", items: workshops.slice(0, half).map(toItem) },
      { title: " ", items: workshops.slice(half).map(toItem) },
    ],
    // Was a "Next session" card showing a seeded date and venue. Workshops are
    // booked on request — there is no public schedule — so promoting a date
    // implied an open calendar that does not exist.
    feature: {
      eyebrow: "How it works",
      title: "Run on your site, on your dates",
      body: "Every workshop is arranged around your locations and shift patterns. Tell us what you need and we will put together an outline.",
      href: "/contact",
      cta: "Request a workshop",
    },
  };
}

export const headerCta = {
  secondary: { label: "Secure Score", href: "/secure-score", icon: ShieldCheck },
  primary: { label: "Get certified", href: "/certification" },
  contact: { label: "Contact", href: "/contact", icon: Phone },
};
