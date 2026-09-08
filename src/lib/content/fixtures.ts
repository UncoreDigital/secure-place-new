import type {
  GalleryAlbum,
  GalleryPhoto,
  PodcastEpisode,
  Post,
  Workshop,
  WorkshopSession,
} from "./types";

/**
 * Development content.
 *
 * Deliberately the same rows as marketing-seed.sql, so what is built against
 * here matches what appears once Supabase is connected. Subjects come from the
 * product's own feature copy -- SOS alerting, drill management, BLS and first
 * aid, POSH training for employees, managers and ICC members -- rather than
 * being invented, so layouts get exercised at true content lengths.
 *
 * Replace with live queries by editing ./index.ts; nothing else changes.
 */

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const posts: Post[] = [
  {
    id: "p1",
    slug: "what-a-good-evacuation-drill-looks-like",
    title: "What a good evacuation drill actually looks like",
    excerpt:
      "Most organisations run drills to satisfy a checklist. The ones that get value out of them measure a number, act on it, and run the next drill against it.",
    body: `
      <p>A drill that nobody times is an interruption, not a rehearsal. The difference between the two comes down to whether anyone wrote down how long it took.</p>
      <h2>Time the evacuation, every time</h2>
      <p>Record the interval from alarm to the last person reaching the assembly point. That single number is the only honest measure of whether the plan works, and it is the one most drill reports leave out.</p>
      <p>It is also the number that makes improvement legible. A floor that took nine minutes in March and six in September has demonstrably changed. A floor described as "generally compliant" in both reports has not.</p>
      <h2>Count who did not move</h2>
      <p>Participation rate matters more than headcount. If the same floor lags every quarter, the problem is the route or the warden coverage, not the people.</p>
      <h2>Close the loop before the next one</h2>
      <p>A drill report that produces no action item is a filing exercise. Assign each finding an owner and a date, then open the next drill by reviewing them.</p>
    `,
    coverUrl: "/assets/img/service/1.png",
    authorName: "Secure Place to Work",
    authorRole: "Editorial team",
    category: "Drills & Readiness",
    tags: ["drills", "emergency-response"],
    readingMinutes: 4,
    isFeatured: true,
    seoTitle: null,
    seoDescription: null,
    publishedAt: daysAgo(6),
  },
  {
    id: "p2",
    slug: "anonymous-reporting-that-employees-trust",
    title: "Anonymous reporting that employees actually trust",
    excerpt:
      "A reporting channel is only worth having if the person using it believes it cannot be traced back to them. Most internal channels fail that test on day one.",
    body: `
      <p>Organisations tend to measure a speak-up channel by how many reports it receives. A low number gets read as a healthy workplace. It is at least as likely to mean nobody trusts the channel.</p>
      <h2>Anonymity has to survive the org chart</h2>
      <p>If a report routes through a line manager before it reaches the committee, it is not anonymous, whatever the form promises. The route matters more than the wording.</p>
      <h2>Publish a response time and keep it</h2>
      <p>An acknowledgement within a stated window, every time, does more for trust than any awareness campaign. Silence is what teaches people the channel is decorative.</p>
      <h2>Report the outcomes, not the cases</h2>
      <p>Share aggregate resolution data with staff. People need evidence that reports lead somewhere before they will file one.</p>
    `,
    coverUrl: "/assets/img/service/7.png",
    authorName: "Secure Place to Work",
    authorRole: "Editorial team",
    category: "Speak-Up & Reporting",
    tags: ["reporting", "posh", "culture"],
    readingMinutes: 5,
    isFeatured: false,
    seoTitle: null,
    seoDescription: null,
    publishedAt: daysAgo(13),
  },
  {
    id: "p3",
    slug: "fire-noc-is-not-a-safety-programme",
    title: "A current fire NOC is not a safety programme",
    excerpt:
      "Statutory compliance and actual readiness are different things, and organisations routinely mistake the first for the second.",
    body: `
      <p>A No Objection Certificate says a building met a standard on an inspection date. It says nothing about whether the people inside it know what to do at 3pm on a Tuesday.</p>
      <h2>What the certificate does not cover</h2>
      <p>Warden coverage per floor. Whether new joiners were inducted. Whether the assembly point is still where the signage says it is after the last office move.</p>
      <h2>Audit the gap deliberately</h2>
      <p>Run the paperwork audit and the readiness audit as two separate exercises. Organisations that combine them tend to let the easier one stand in for the harder one.</p>
    `,
    coverUrl: "/assets/img/service/emergency.jpg",
    authorName: "Secure Place to Work",
    authorRole: "Editorial team",
    category: "Compliance & Governance",
    tags: ["compliance", "fire-safety"],
    readingMinutes: 3,
    isFeatured: false,
    seoTitle: null,
    seoDescription: null,
    publishedAt: daysAgo(27),
  },
];

/**
 * Empty on purpose. There is no recorded audio yet, and inventing episodes with
 * fabricated Spotify links would ship dead links to visitors. The podcast route
 * renders its "in production" state until real episodes exist.
 */
export const podcastEpisodes: PodcastEpisode[] = [];

export const workshops: Workshop[] = [
  {
    id: "w1",
    slug: "emergency-response-and-evacuation",
    title: "Emergency Response & Evacuation Readiness",
    summary:
      "Run an evacuation that clears the building in a measured time, with wardens who know their floor and a report that produces action items.",
    description:
      "<p>A practical session for the people who will actually run an evacuation: floor wardens, security staff and the disaster response team. Ends with a timed walkthrough of your own building.</p>",
    format: "onsite",
    durationMinutes: 180,
    audience: "Floor wardens, security staff, disaster response team",
    outcomes: [
      "Evacuate your floor within a measured, recorded time",
      "Run a roll call at the assembly point that accounts for visitors and contractors",
      "Write a drill report that produces owned, dated action items",
    ],
    modules: [
      { title: "Alarm to first movement", minutes: 30, points: ["Recognising the alarm", "Warden call-out", "Assisting mobility needs"] },
      { title: "Route and assembly discipline", minutes: 45, points: ["Primary and secondary routes", "Assembly point roll call", "Visitors and contractors"] },
      { title: "Timed walkthrough", minutes: 60, points: ["Live drill on site", "Timing and observation", "Debrief"] },
      { title: "Reporting", minutes: 45, points: ["What to record", "Turning findings into actions"] },
    ],
    minParticipants: 10,
    maxParticipants: 40,
    coverUrl: "/assets/img/service/emergency.jpg",
    isFeatured: true,
    displayOrder: 1,
  },
  {
    id: "w2",
    slug: "bls-and-workplace-first-aid",
    title: "Basic Life Support & Workplace First Aid",
    summary:
      "BLS and CPR, first-aid response for common workplace injuries, and scenario-based practice with certified instructors.",
    description:
      "<p>Hands-on medical response training covering the injuries that actually occur in offices and on plant floors. Scenario-based throughout; delivered by certified instructors.</p>",
    format: "onsite",
    durationMinutes: 240,
    audience: "All staff; recommended for designated first responders",
    outcomes: [
      "Perform CPR and use an AED with confidence",
      "Manage bleeding, burns, fractures and choking",
      "Decide quickly when to escalate to emergency services",
    ],
    modules: [
      { title: "Basic life support", minutes: 90, points: ["Assessment and response", "CPR technique", "AED use"] },
      { title: "Common workplace injuries", minutes: 75, points: ["Bleeding and burns", "Fractures and sprains", "Choking"] },
      { title: "Scenario practice", minutes: 75, points: ["Simulated incidents", "Escalation decisions", "Handover to paramedics"] },
    ],
    minParticipants: 8,
    maxParticipants: 25,
    coverUrl: "/assets/img/service/medical.jpg",
    isFeatured: true,
    displayOrder: 2,
  },
  {
    id: "w3",
    slug: "fire-safety-fundamentals",
    title: "Fire Safety Fundamentals",
    summary: "Extinguisher selection and use, containment, and the decision to fight or evacuate.",
    description:
      "<p>Classroom and practical session covering fire classes, extinguisher selection, safe use, and the judgement call every employee should be able to make: fight it or leave.</p>",
    format: "onsite",
    durationMinutes: 150,
    audience: "All staff",
    outcomes: [
      "Identify fire classes and select the correct extinguisher",
      "Use an extinguisher safely under supervision",
      "Make the fight-or-evacuate call correctly",
    ],
    modules: [
      { title: "Fire behaviour and classes", minutes: 45, points: ["How fires spread", "Classes A to K", "Matching the agent"] },
      { title: "Extinguisher practical", minutes: 60, points: ["PASS technique", "Supervised live use", "Limitations"] },
      { title: "Containment and escalation", minutes: 45, points: ["Doors and compartmentation", "When to stop", "Raising the alarm"] },
    ],
    minParticipants: 10,
    maxParticipants: 30,
    coverUrl: "/assets/img/service/1.png",
    isFeatured: false,
    displayOrder: 3,
  },
  {
    id: "w4",
    slug: "posh-awareness-employees-managers-icc",
    title: "POSH Awareness for Employees, Managers & ICC Members",
    summary:
      "Certified trainer-led sessions on preventing workplace harassment, with separate tracks for staff, managers and Internal Complaints Committee members.",
    description:
      "<p>Three audiences with genuinely different obligations, so the session splits after a shared opening. Includes case studies and an assessment.</p>",
    format: "hybrid",
    durationMinutes: 180,
    audience: "Employees, people managers, and ICC members",
    outcomes: [
      "Recognise and correctly categorise prohibited conduct",
      "Understand the reporting route and the confidentiality that protects it",
      "ICC members: run an inquiry that stands up to scrutiny",
    ],
    modules: [
      { title: "Shared foundation", minutes: 60, points: ["What the law covers", "Prohibited conduct", "Bystander responsibility"] },
      { title: "Manager track", minutes: 60, points: ["Receiving a disclosure", "Non-retaliation duties", "Escalation"] },
      { title: "ICC track", minutes: 60, points: ["Inquiry procedure", "Evidence and records", "Reporting obligations"] },
    ],
    minParticipants: 12,
    maxParticipants: 60,
    coverUrl: "/assets/img/service/7.png",
    isFeatured: true,
    displayOrder: 4,
  },
  {
    id: "w5",
    slug: "safety-volunteer-certification",
    title: "Safety Volunteer & Floor Warden Certification",
    summary:
      "Certifies the volunteers assigned per location in the platform, so SOS alerts reach someone trained to act on them.",
    description:
      "<p>For the volunteers and guards assigned to each location. Covers alert triage, on-floor coordination, and the handover to professional responders.</p>",
    format: "onsite",
    durationMinutes: 210,
    audience: "Designated safety volunteers and security personnel",
    outcomes: [
      "Triage an incoming SOS alert and respond appropriately",
      "Coordinate a floor during an active incident",
      "Hand over cleanly to fire, medical or police services",
    ],
    modules: [
      { title: "The volunteer role", minutes: 45, points: ["Scope and limits", "Coverage per floor", "Working with security"] },
      { title: "Alert triage", minutes: 60, points: ["Reading an SOS", "Location and health data", "First actions"] },
      { title: "On-floor coordination", minutes: 60, points: ["Directing movement", "Assisting mobility needs", "Communication discipline"] },
      { title: "Handover", minutes: 45, points: ["What responders need", "Records", "Post-incident debrief"] },
    ],
    minParticipants: 6,
    maxParticipants: 20,
    coverUrl: "/assets/img/service/medical2.png",
    isFeatured: false,
    displayOrder: 5,
  },
];

/**
 * Empty, and it must stay that way unless the business changes.
 *
 * Workshops are booked on request — the company does not run open, publicly
 * scheduled sessions. Seeded dates, venues and seat counts here previously fed
 * a "Next session" banner and an "upcoming dates" sidebar, which advertised a
 * schedule that does not exist and invited people to expect open enrolment.
 */
export const workshopSessions: WorkshopSession[] = [];

/**
 * Photo gallery.
 *
 * Empty on purpose, and this is the honest state until real photographs arrive.
 *
 * The site's existing imagery came with the purchased template and is generic
 * safety stock. Presenting it as a gallery would imply these are photographs of
 * the company's own sessions and drills, which is the same mistake the seeded
 * workshop schedule made. Albums are added through the portal — Website →
 * Gallery — where photos, alt text and ordering are all editable.
 */
export const galleryAlbums: GalleryAlbum[] = [];

export const galleryPhotos: GalleryPhoto[] = [];
