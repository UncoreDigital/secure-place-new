import type { Metadata } from "next";
import { site } from "@/lib/site";
import LegalPage, { Fill, type Section } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} collects, uses and protects personal data submitted through this website.`,
  robots: { index: true, follow: true },
};

/**
 * Written against what the site actually does — the fields in marketing.leads,
 * marketing.assessments and marketing.workshop_registrations, the SMTP
 * notification path, and the Supabase processor — rather than from a generic
 * template. Facts only the client can supply are marked with <Fill>.
 */
const sections: Section[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          This website is operated by <Fill>REGISTERED ENTITY NAME</Fill>,
          trading as {site.name}, registered at{" "}
          <Fill>REGISTERED OFFICE ADDRESS</Fill>. In this policy &ldquo;we&rdquo;
          and &ldquo;us&rdquo; mean that entity.
        </p>
        <p>
          For questions about this policy or about how your data is handled,
          contact <a href={`mailto:${site.email}`}>{site.email}</a> or write to
          our grievance officer, <Fill>GRIEVANCE OFFICER NAME AND EMAIL</Fill>.
        </p>
        <p>
          This policy covers this website only. Our customer platform is a
          separate product with its own terms, and organisations using it are
          the controllers of their own employee data.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>
          We only collect information you type into a form. There is no account
          system on this website and we do not require you to identify yourself
          to read anything.
        </p>
        <h3>When you contact us or request a demo</h3>
        <ul>
          <li>Your name and work email address (required)</li>
          <li>Your organisation, phone number and job title (optional)</li>
          <li>The message you write, and the number of sites if you tell us</li>
          <li>
            Which page or asset the enquiry came from, and any campaign
            parameters present in the link you followed
          </li>
        </ul>
        <h3>When you complete the Secure Score assessment</h3>
        <ul>
          <li>
            Your industry, workforce size band and number of sites, plus your
            organisation name if you give it
          </li>
          <li>Your answers to the twenty assessment questions</li>
          <li>
            The score and pillar breakdown calculated from those answers
          </li>
          <li>
            Your name and email address, which are requested before the full
            result is shown
          </li>
        </ul>
        <p>
          Your in-progress answers are also saved in your own browser&rsquo;s
          local storage so you can leave and come back. That copy never leaves
          your device and you can clear it by selecting &ldquo;Start
          over&rdquo; or clearing your browser data.
        </p>
        <h3>When you register for a workshop</h3>
        <ul>
          <li>
            Your name, email address, organisation, phone number and the number
            of seats requested
          </li>
        </ul>
        <p>
          <strong>We do not</strong> ask for payment details, government
          identifiers, or any special category data on this website.
        </p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why we use it, and on what basis",
    body: (
      <>
        <p>We use the information above to:</p>
        <ul>
          <li>Reply to your enquiry and, where you asked for one, arrange a demo</li>
          <li>Send you your Secure Score result and the accompanying report</li>
          <li>Confirm and administer workshop bookings</li>
          <li>
            Understand, in aggregate, which industries and organisation sizes
            are looking at workplace safety certification
          </li>
        </ul>
        <p>
          Our lawful basis is your consent, given when you submit a form, and
          our legitimate interest in responding to enquiries about our services.
          Where the Digital Personal Data Protection Act, 2023 applies, we
          process on the basis of the consent you provide at the point of
          collection.
        </p>
        <p>
          We may email you once to follow up on an enquiry or a downloaded
          guide. We do not add you to a marketing list without asking, and every
          such email carries an unsubscribe option.
        </p>
      </>
    ),
  },
  {
    id: "aggregate-benchmarks",
    title: "Aggregate benchmarks",
    body: (
      <>
        <p>
          Secure Score results may be combined with other submissions to produce
          industry benchmarks — for example, the median score for manufacturing
          organisations of a given size.
        </p>
        <p>
          Benchmarks are only ever published in aggregate, never in a form that
          identifies an organisation or an individual, and only once enough
          submissions exist for a figure to be meaningful. If you would prefer
          your submission excluded, email us and we will remove it.
        </p>
      </>
    ),
  },
  {
    id: "who-sees-it",
    title: "Who else sees it",
    body: (
      <>
        <p>We do not sell personal data, and we do not share it for advertising.</p>
        <p>
          Your submission is stored in a database operated on our behalf by
          Supabase, and notification emails are delivered through our email
          provider, <Fill>EMAIL PROVIDER NAME</Fill>. Both act as processors on
          our instructions and may store data in{" "}
          <Fill>HOSTING REGION — e.g. Singapore / Mumbai</Fill>. Where data
          leaves your country, we rely on{" "}
          <Fill>TRANSFER MECHANISM — e.g. standard contractual clauses</Fill>.
        </p>
        <p>
          Inside our organisation, website enquiries and assessment submissions
          are visible only to administrators of our internal portal, which is
          access-controlled and role-restricted.
        </p>
        <p>
          We may disclose information where the law requires it, or to establish
          or defend a legal claim.
        </p>
      </>
    ),
  },
  {
    id: "how-long",
    title: "How long we keep it",
    body: (
      <>
        <p>
          Enquiries and workshop registrations are retained for{" "}
          <Fill>RETENTION PERIOD — e.g. 24 months</Fill> from your last contact
          with us, after which they are deleted.
        </p>
        <p>
          Assessment submissions are retained for{" "}
          <Fill>RETENTION PERIOD</Fill>. After that, the identifying details are
          deleted and only the anonymised scores are kept, so that historical
          benchmarks remain accurate.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: (
      <>
        <p>
          This website sets <strong>no advertising or tracking cookies</strong>.
          The only data stored in your browser is the Secure Score progress
          described above, which is local storage rather than a cookie and is
          never transmitted to us.
        </p>
        <p>
          <Fill>
            IF ANALYTICS ARE ADDED LATER, NAME THE PROVIDER AND WHAT IT COLLECTS
            HERE
          </Fill>
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul>
          <li>Give you a copy of the personal data we hold about you</li>
          <li>Correct anything that is wrong or out of date</li>
          <li>Delete your data, including any assessment you submitted</li>
          <li>Stop contacting you</li>
          <li>Withdraw a consent you previously gave</li>
        </ul>
        <p>
          Email <a href={`mailto:${site.email}`}>{site.email}</a> and we will
          respond within <Fill>RESPONSE WINDOW — e.g. 30 days</Fill>. You will
          not be charged, and asking will never affect the service you receive.
        </p>
        <p>
          If you are not satisfied with our response you may complain to{" "}
          <Fill>RELEVANT SUPERVISORY AUTHORITY</Fill>.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          Data is transmitted over encrypted connections and stored in a
          database with row-level access controls, so that website enquiries are
          isolated from unrelated records and readable only by authorised
          administrators.
        </p>
        <p>
          No system is perfectly secure. If we become aware of a breach
          affecting your personal data, we will notify you and the relevant
          authority as required by law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          If we change how we handle personal data we will update this page and
          revise the date below. Material changes affecting people who have
          already contacted us will be notified by email.
        </p>
        <p>
          Last updated: <Fill>DATE OF LEGAL SIGN-OFF</Fill>.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      lede="What this website collects, why, who else sees it, and how to get it removed."
      reviewNote="This draft was written to describe what the website actually does — the exact form fields, the storage and email providers, and the browser storage used by the Secure Score. It is accurate as to the technical behaviour, but it is not legal advice."
      sections={sections}
    />
  );
}
