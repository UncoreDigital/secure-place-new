/**
 * The Secure Score question set, v1.
 *
 * PRODUCT SIGN-OFF REQUIRED. A score published under a certification body's
 * name is read as authoritative. The certification team owns this file: the
 * questions, the option wording, the points and the pillar weights. Treat any
 * change here as a change to a published claim, and bump ENGINE_VERSION so
 * stored submissions stay reproducible.
 *
 * Structure: five pillars, four questions each, every option worth 0-5 points.
 * Pillar weights sum to 100 and reflect what Secure Place actually certifies
 * against — emergency response and speak-up carry the most.
 */

export const ENGINE_VERSION = "v1";

export type PillarId =
  | "emergency"
  | "reporting"
  | "training"
  | "drills"
  | "compliance";

export type Pillar = {
  id: PillarId;
  label: string;
  weight: number;
  blurb: string;
  /** Shown on the result screen when this pillar is one of the weakest. */
  gapAdvice: string;
};

export const pillars: Pillar[] = [
  {
    id: "emergency",
    label: "Emergency preparedness",
    weight: 25,
    blurb: "Whether an incident reaches trained people fast enough to matter.",
    gapAdvice:
      "Put a one-tap alert in every employee's hand and make sure it reaches a named, trained responder — not a shared inbox. Map and signpost assembly points at every location.",
  },
  {
    id: "reporting",
    label: "Speak-up & reporting",
    weight: 25,
    blurb: "Whether people believe they can report something without it costing them.",
    gapAdvice:
      "Route reports so they never pass through the reporter's own line manager, commit to a first-response window in writing, and publish aggregate outcomes so staff can see reports lead somewhere.",
  },
  {
    id: "training",
    label: "Training & awareness",
    weight: 20,
    blurb: "Whether staff know what to do before they need to know it.",
    gapAdvice:
      "Get safety induction into the first week for new joiners, set a refresher cadence rather than running one-off sessions, and give managers and ICC members role-specific training.",
  },
  {
    id: "drills",
    label: "Drills & response readiness",
    weight: 15,
    blurb: "Whether the plan has been rehearsed and measured, not just written.",
    gapAdvice:
      "Time every evacuation from alarm to last person at the assembly point, measure participation per floor, and turn each finding into an owned, dated action reviewed at the next drill.",
  },
  {
    id: "compliance",
    label: "Compliance & governance",
    weight: 15,
    blurb: "Whether the paperwork holds up and someone owns it.",
    gapAdvice:
      "Keep fire NOCs current at every site, constitute a safety committee that meets on a fixed schedule with minutes on record, and retain training and drill records so they can be produced on request.",
  },
];

export type Option = { label: string; points: number };

export type Question = {
  id: string;
  pillar: PillarId;
  text: string;
  help?: string;
  options: Option[];
};

/** Points available per question. Every option list tops out here. */
export const MAX_POINTS = 5;

export const questions: Question[] = [
  // --- emergency preparedness ----------------------------------------------
  {
    id: "emg_sos",
    pillar: "emergency",
    text: "Can any employee raise an emergency alert from their own phone?",
    help: "And does it reach security and trained volunteers, not just a switchboard.",
    options: [
      { label: "Yes — reaches security and trained volunteers instantly", points: 5 },
      { label: "Yes, but it reaches one central desk only", points: 3 },
      { label: "Only by calling a posted number", points: 1 },
      { label: "No defined way to raise an alert", points: 0 },
    ],
  },
  {
    id: "emg_assembly",
    pillar: "emergency",
    text: "Are assembly points mapped and signposted at every location?",
    options: [
      { label: "Yes, at every site, and staff can name theirs", points: 5 },
      { label: "Yes, but signage is out of date in places", points: 3 },
      { label: "Only at the head office", points: 1 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: "emg_contacts",
    pillar: "emergency",
    text: "Is there a current emergency contact directory staff can reach in seconds?",
    help: "Internal responders plus local police, fire and hospital.",
    options: [
      { label: "Yes — in-app, and local services resolve by location", points: 5 },
      { label: "Yes, a maintained internal list", points: 3 },
      { label: "A printed list somewhere on each floor", points: 1 },
      { label: "No single source", points: 0 },
    ],
  },
  {
    id: "emg_coverage",
    pillar: "emergency",
    text: "Is there trained emergency coverage on every floor and every shift?",
    help: "Including nights, weekends and skeleton staffing.",
    options: [
      { label: "Yes, with named cover and a documented rota", points: 5 },
      { label: "Day shifts covered; nights and weekends are thin", points: 3 },
      { label: "A few trained people, no formal coverage", points: 1 },
      { label: "No", points: 0 },
    ],
  },

  // --- speak-up & reporting -------------------------------------------------
  {
    id: "rep_anon",
    pillar: "reporting",
    text: "Can an employee report a concern without it being traceable to them?",
    options: [
      { label: "Yes — genuinely anonymous, and staff know it", points: 5 },
      { label: "Confidential, but identity is known to HR", points: 3 },
      { label: "Reports go through a named manager", points: 1 },
      { label: "No formal channel", points: 0 },
    ],
  },
  {
    id: "rep_route",
    pillar: "reporting",
    text: "Does a report reach the committee without passing through the reporter's line manager?",
    help: "The route matters more than the wording on the form.",
    options: [
      { label: "Yes, always — the manager is bypassed by design", points: 5 },
      { label: "Usually, but there are exceptions", points: 3 },
      { label: "No — line manager is the first step", points: 1 },
      { label: "There is no defined route", points: 0 },
    ],
  },
  {
    id: "rep_sla",
    pillar: "reporting",
    text: "Is there a committed first-response time, and do you meet it?",
    options: [
      { label: "Yes — published, tracked, and met", points: 5 },
      { label: "Yes, but not measured", points: 3 },
      { label: "Informal expectation only", points: 1 },
      { label: "No commitment", points: 0 },
    ],
  },
  {
    id: "rep_outcomes",
    pillar: "reporting",
    text: "Do you share aggregate outcomes back with staff?",
    help: "People need evidence that reports lead somewhere before they file one.",
    options: [
      { label: "Yes, on a regular published cadence", points: 5 },
      { label: "Occasionally, when asked", points: 3 },
      { label: "Only to the leadership team", points: 1 },
      { label: "No", points: 0 },
    ],
  },

  // --- training & awareness -------------------------------------------------
  {
    id: "trn_coverage",
    pillar: "training",
    text: "What share of staff completed safety training in the last 12 months?",
    options: [
      { label: "More than 90%", points: 5 },
      { label: "60–90%", points: 3 },
      { label: "Under 60%", points: 1 },
      { label: "We do not track completion", points: 0 },
    ],
  },
  {
    id: "trn_induction",
    pillar: "training",
    text: "Do new joiners get safety induction in their first week?",
    options: [
      { label: "Yes, always — it is part of onboarding", points: 5 },
      { label: "Within the first month", points: 3 },
      { label: "Eventually, no fixed point", points: 1 },
      { label: "No induction", points: 0 },
    ],
  },
  {
    id: "trn_refresher",
    pillar: "training",
    text: "Are refreshers scheduled, or is training a one-off?",
    options: [
      { label: "Scheduled refreshers on a fixed cadence", points: 5 },
      { label: "Refreshed when something prompts it", points: 3 },
      { label: "Once at induction only", points: 1 },
      { label: "No structured training", points: 0 },
    ],
  },
  {
    id: "trn_posh",
    pillar: "training",
    text: "Have managers and ICC members had role-specific harassment-prevention training?",
    help: "Employees, managers and committee members carry different obligations.",
    options: [
      { label: "Yes — separate tracks for each group", points: 5 },
      { label: "One general session for everyone", points: 3 },
      { label: "Committee members only", points: 1 },
      { label: "Not yet", points: 0 },
    ],
  },

  // --- drills & response readiness -----------------------------------------
  {
    id: "drl_frequency",
    pillar: "drills",
    text: "How many evacuation drills did you run in the last 12 months?",
    options: [
      { label: "Three or more, across all sites", points: 5 },
      { label: "One or two", points: 3 },
      { label: "One, at the head office only", points: 1 },
      { label: "None", points: 0 },
    ],
  },
  {
    id: "drl_timed",
    pillar: "drills",
    text: "Do you record how long the evacuation took?",
    help: "Alarm to the last person reaching the assembly point.",
    options: [
      { label: "Yes, every drill, and we compare across drills", points: 5 },
      { label: "Sometimes", points: 3 },
      { label: "No, but we note that it happened", points: 1 },
      { label: "No record kept", points: 0 },
    ],
  },
  {
    id: "drl_participation",
    pillar: "drills",
    text: "Do you measure participation per floor or department?",
    options: [
      { label: "Yes — we can see which areas lag", points: 5 },
      { label: "Overall headcount only", points: 3 },
      { label: "Rough estimate", points: 1 },
      { label: "Not measured", points: 0 },
    ],
  },
  {
    id: "drl_actions",
    pillar: "drills",
    text: "Do drill findings become owned, dated action items?",
    options: [
      { label: "Yes, and we review them at the next drill", points: 5 },
      { label: "Actions are noted but not tracked", points: 3 },
      { label: "A report is filed and closed", points: 1 },
      { label: "No report produced", points: 0 },
    ],
  },

  // --- compliance & governance ----------------------------------------------
  {
    id: "cmp_noc",
    pillar: "compliance",
    text: "Is your fire NOC current at every site?",
    options: [
      { label: "Yes, all sites current with renewal dates tracked", points: 5 },
      { label: "Current, but renewals are handled ad hoc", points: 3 },
      { label: "Lapsed at one or more sites", points: 1 },
      { label: "Not sure", points: 0 },
    ],
  },
  {
    id: "cmp_committee",
    pillar: "compliance",
    text: "Does a constituted safety committee meet on a fixed schedule?",
    help: "With minutes on record.",
    options: [
      { label: "Yes — fixed schedule, minutes recorded", points: 5 },
      { label: "Meets, but irregularly", points: 3 },
      { label: "Constituted on paper only", points: 1 },
      { label: "No committee", points: 0 },
    ],
  },
  {
    id: "cmp_records",
    pillar: "compliance",
    text: "Could you produce training and drill records for an auditor this week?",
    options: [
      { label: "Yes — centrally held and retrievable", points: 5 },
      { label: "Yes, but it would take some assembling", points: 3 },
      { label: "Partially — records are scattered", points: 1 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: "cmp_audit",
    pillar: "compliance",
    text: "Has an independent safety audit been carried out in the last 24 months?",
    options: [
      { label: "Yes, with findings closed out", points: 5 },
      { label: "Yes, findings still open", points: 3 },
      { label: "Internal review only", points: 1 },
      { label: "No", points: 0 },
    ],
  },
];

export const industries = [
  "Manufacturing",
  "Information Technology",
  "Healthcare",
  "Retail",
  "Logistics & Warehousing",
  "Financial Services",
  "Education",
  "Hospitality",
  "Construction",
  "Other",
];

export const employeeBands = ["1–50", "51–200", "201–1000", "1000+"];
