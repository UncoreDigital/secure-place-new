/**
 * Site-wide constants.
 *
 * Contact details are the ones verified in the current live site. The old Astro
 * build also carried template placeholders -- "31 Winding Creek Road, New York",
 * info@gmail.com, a New York / London / Australia office list -- which are not
 * reproduced here. Add a real postal address when the client supplies one.
 */

export const site = {
  name: "Secure Place to Work",
  shortName: "Secure Place",
  domain: "secureplacetowork.com",
  url: "https://secureplacetowork.com",
  tagline: "Make Your Company a Secure Place™",
  description:
    "Workplace safety certification, emergency readiness and employee training — emergency alerting, drill management and safety certification in one platform.",
  email: "pratik@secureplacetowork.com",
  phone: "+91 85528 59594",
  phoneHref: "tel:+918552859594",
  /** The certification threshold, used on the certification page and by the Secure Score. */
  certificationThreshold: 70,
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  /** Present on Resources, which fans out into three content types. */
  children?: NavLink[];
};

/** Primary navigation. Order reflects the certification-first funnel. */
export const primaryNav: NavLink[] = [
  { label: "Certification", href: "/certification", description: "How organisations get certified" },
  { label: "Solutions", href: "/solutions", description: "What the platform does" },
  { label: "Workshops", href: "/workshops", description: "Trainer-led safety sessions" },
  { label: "Industries", href: "/industries", description: "Where we work" },
  {
    label: "Resources",
    href: "/resources",
    description: "Articles, podcast and photos",
    children: [
      { label: "Blog", href: "/resources/blog", description: "Writing on drills, reporting and compliance" },
      { label: "Podcast", href: "/resources/podcast", description: "Conversations on keeping people safe" },
      { label: "Photo gallery", href: "/gallery" },
      { label: "All resources", href: "/resources", description: "Everything in one place" },
    ],
  },
  { label: "About", href: "/about", description: "Who we are" },
];

/**
 * Logo pairing. Both are 512x216. logo1 carries dark text for light grounds,
 * logo6 carries white text for the navy header and footer.
 *
 * Do not use logo-black.png / logo-white.png — those ship with the purchased
 * template and read "Budgeto", a different company entirely.
 */
export const logo = {
  onLight: "/assets/img/logo/logo1.png",
  onDark: "/assets/img/logo/logo6.png",
  width: 512,
  height: 216,
} as const;

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Emergency Alert", href: "/solutions#emergency-alert" },
      { label: "Drill Management", href: "/solutions#drill-management" },
      { label: "Employee Safety Data", href: "/solutions#employee-safety-data" },
      { label: "Contact Directory", href: "/solutions#contact-directory" },
      { label: "Medical Training", href: "/solutions#medical-training" },
      { label: "Training Classes", href: "/solutions#training-classes" },
    ],
  },
  {
    title: "Certification",
    links: [
      { label: "How it works", href: "/certification" },
      { label: "Secure Score", href: "/secure-score" },
      { label: "Industries we serve", href: "/industries" },
      { label: "Request a demo", href: "/demo" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "All resources", href: "/resources" },
      { label: "Blog", href: "/resources/blog" },
      { label: "Podcast", href: "/resources/podcast" },
      { label: "Workshops", href: "/workshops" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms and conditions", href: "/terms" },
    ],
  },
];
