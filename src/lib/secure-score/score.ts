import { MAX_POINTS, pillars, questions, type PillarId } from "./questions";

export type ScoreBand = "at_risk" | "developing" | "certifiable" | "certification_ready";

export type BandInfo = {
  id: ScoreBand;
  label: string;
  min: number;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  tone: "good" | "warn" | "bad";
};

/**
 * Thresholds match the certification page's existing rule — "score above 70%
 * and get certified; below, get a full improvement roadmap" — so a visitor's
 * free score means the same thing as their audited one. They are mirrored by a
 * CHECK constraint on marketing.assessments; change both together.
 */
export const bands: BandInfo[] = [
  {
    id: "certification_ready",
    label: "Certification ready",
    min: 85,
    headline: "You are in strong shape.",
    body: "Controls, records and drill history all appear to be in place. An audit should be a formality rather than a hurdle.",
    ctaLabel: "Apply for certification",
    ctaHref: "/certification",
    tone: "good",
  },
  {
    id: "certifiable",
    label: "Certifiable",
    min: 70,
    headline: "You clear the threshold, with gaps worth closing.",
    body: "You are above the 70% mark certification requires. Tightening the weakest pillars before the audit window will make the result comfortable rather than marginal.",
    ctaLabel: "Book the audit",
    ctaHref: "/certification",
    tone: "good",
  },
  {
    id: "developing",
    label: "Developing",
    min: 50,
    headline: "The fundamentals are there but inconsistent.",
    body: "Most of what you need exists somewhere. The usual problem is that it is uneven across sites, or real but undocumented — which reads the same as absent to an auditor.",
    ctaLabel: "Get an improvement roadmap",
    ctaHref: "/contact",
    tone: "warn",
  },
  {
    id: "at_risk",
    label: "At risk",
    min: 0,
    headline: "There are material gaps to close first.",
    body: "Emergency response or speak-up coverage has holes that certification would not paper over. This needs intervention before it needs a certificate.",
    ctaLabel: "Talk to a safety advisor",
    ctaHref: "/contact",
    tone: "bad",
  },
];

export type Answers = Record<string, number>;

export type ScoreResult = {
  total: number;
  band: BandInfo;
  pillarScores: Record<PillarId, number>;
  /** The three weakest pillars, worst first — what the result screen leads on. */
  gaps: { pillar: (typeof pillars)[number]; score: number }[];
};

export function bandFor(total: number): BandInfo {
  // bands is ordered high to low, so the first match is the right one.
  return bands.find((b) => total >= b.min) ?? bands[bands.length - 1];
}

/**
 * Score a set of answers.
 *
 * Unanswered questions count as zero rather than being dropped from the
 * denominator. Skipping a question should not be able to raise the score —
 * otherwise the fastest route to a good number is to answer only the
 * flattering ones.
 */
export function scoreAnswers(answers: Answers): ScoreResult {
  const pillarScores = {} as Record<PillarId, number>;

  for (const pillar of pillars) {
    const inPillar = questions.filter((q) => q.pillar === pillar.id);
    const earned = inPillar.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const available = inPillar.length * MAX_POINTS;
    pillarScores[pillar.id] = available === 0 ? 0 : Math.round((earned / available) * 100);
  }

  const weighted = pillars.reduce(
    (sum, p) => sum + pillarScores[p.id] * p.weight,
    0,
  );
  const total = Math.round(weighted / 100);

  const gaps = pillars
    .map((pillar) => ({ pillar, score: pillarScores[pillar.id] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return { total, band: bandFor(total), pillarScores, gaps };
}

export function isComplete(answers: Answers): boolean {
  return questions.every((q) => typeof answers[q.id] === "number");
}
