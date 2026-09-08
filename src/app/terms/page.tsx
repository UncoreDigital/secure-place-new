import type { Metadata } from "next";
import { site } from "@/lib/site";
import LegalPage, { Fill, type Section } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: `The terms governing use of the ${site.name} website, the Secure Score self-assessment and workshop bookings.`,
  robots: { index: true, follow: true },
};

const sections: Section[] = [
  {
    id: "these-terms",
    title: "These terms",
    body: (
      <>
        <p>
          This website is operated by <Fill>REGISTERED ENTITY NAME</Fill>,
          trading as {site.name}. By using it you accept these terms. If you do
          not accept them, please do not use the site.
        </p>
        <p>
          These terms cover the website only. Use of our customer platform is
          governed by the separate agreement signed with your organisation, and
          where the two conflict, that agreement takes precedence.
        </p>
      </>
    ),
  },
  {
    id: "secure-score",
    title: "The Secure Score is not a certification",
    body: (
      <>
        <p>
          This is the most important term on this page.
        </p>
        <p>
          The Secure Score is a <strong>free self-assessment</strong>. It scores
          answers that you provide about your own organisation. We do not
          verify, inspect or audit anything before producing that score.
        </p>
        <p>
          A score — including a score above the{" "}
          {site.certificationThreshold}% threshold — is{" "}
          <strong>not</strong> a Secure Place to Work certification, does not
          confer certified status, and must not be presented to clients,
          regulators, insurers or any other party as evidence of certification
          or of compliance with any law or standard.
        </p>
        <p>
          Certification is awarded only after an audited survey conducted with
          your organisation under a separate agreement.
        </p>
        <p>
          The score is intended to help you find gaps. It is not a safety audit,
          a legal compliance assessment, or a substitute for professional advice
          on fire safety, occupational health, or your obligations under
          applicable workplace legislation.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Guidance published on this site",
    body: (
      <>
        <p>
          Articles, podcast episodes, guides and templates are published for
          general information. They are written for a broad audience and cannot
          account for your premises, your workforce or your regulatory position.
        </p>
        <p>
          Nothing on this site is legal, medical or engineering advice. Do not
          rely on it as the sole basis for a decision affecting anyone&rsquo;s
          safety. Where a matter is significant, take qualified professional
          advice.
        </p>
        <p>
          We keep published material up to date as best we can but do not
          warrant that it is current or complete at the time you read it.
        </p>
      </>
    ),
  },
  {
    id: "workshops",
    title: "Workshop bookings",
    body: (
      <>
        <p>
          Submitting a registration or an enquiry through this website is a
          request, not a confirmed booking. A booking is confirmed only when we
          confirm it in writing.
        </p>
        <p>
          Dates, locations, trainers and seat availability shown on this site
          may change. Where a session is rescheduled or cancelled by us, we will
          offer an alternative date or a refund of any fee paid.
        </p>
        <p>
          Cancellation and rescheduling by you are governed by{" "}
          <Fill>CANCELLATION TERMS — notice period and any fee</Fill>. Fees,
          where applicable, are set out at the time of booking.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>
            Submit false information, or someone else&rsquo;s personal details,
            through any form on this site
          </li>
          <li>
            Use automated means to scrape, harvest or bulk-download content
          </li>
          <li>
            Attempt to gain unauthorised access to any part of the site or its
            underlying systems
          </li>
          <li>
            Interfere with the site&rsquo;s operation or availability for others
          </li>
        </ul>
        <p>
          We may withdraw access where these terms are breached.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <p>
          The content, design, and the {site.name} and Secure Place&trade; names
          and marks belong to us or our licensors.
        </p>
        <p>
          You may read, print and share our articles and guides for your own
          organisation&rsquo;s internal purposes, with attribution. You may not
          republish them commercially, present them as your own, or use our
          names or marks in a way that suggests endorsement or certification you
          have not been awarded.
        </p>
        <p>
          Templates and checklists we describe as free to use may be adapted for
          use inside your own organisation.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Links to other sites",
    body: (
      <p>
        Where we link to another website or podcast platform, we do so for
        convenience. We do not control those sites and are not responsible for
        their content, their availability, or their privacy practices.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <>
        <p>
          Nothing in these terms limits liability for death or personal injury
          caused by negligence, for fraud, or for anything else that cannot be
          limited by law.
        </p>
        <p>
          Subject to that, the website and the Secure Score are provided on an
          &ldquo;as is&rdquo; basis, and we are not liable for indirect or
          consequential loss, loss of profit, or loss arising from reliance on
          general guidance published here.
        </p>
        <p>
          Our total liability arising from your use of this website is limited
          to <Fill>LIABILITY CAP</Fill>.
        </p>
      </>
    ),
  },
  {
    id: "changes-and-law",
    title: "Changes and governing law",
    body: (
      <>
        <p>
          We may update these terms. The version published here at the time you
          use the site is the version that applies.
        </p>
        <p>
          These terms are governed by the laws of{" "}
          <Fill>GOVERNING JURISDICTION</Fill>, and the courts of{" "}
          <Fill>COURTS WITH EXCLUSIVE JURISDICTION</Fill> have exclusive
          jurisdiction over any dispute.
        </p>
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <p>
          Last updated: <Fill>DATE OF LEGAL SIGN-OFF</Fill>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and conditions"
      lede="The terms covering this website, the Secure Score self-assessment and workshop bookings."
      reviewNote="This draft states plainly that the Secure Score is not a certification, which is the term that most needs to be right given we publish a score under a certification body's name."
      sections={sections}
    />
  );
}
