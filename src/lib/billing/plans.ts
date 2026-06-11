export type PlanId = "free" | "pro";

export type PlanLimits = {
  /** AI generations per calendar month (capability statements, analyses, proposals, sections). */
  aiGenerationsPerMonth: number;
  /** RFP uploads per calendar month. */
  rfpUploadsPerMonth: number;
  /** Max compliance-matrix rows shown (Infinity = full matrix). */
  complianceMatrixRows: number;
  /** Exports allowed (Markdown/CSV downloads). */
  exportsEnabled: boolean;
  /** Full multi-section proposal generation. */
  fullProposal: boolean;
};

export type Plan = {
  id: PlanId;
  name: string;
  priceMonthly: number;
  tagline: string;
  features: string[];
  limits: PlanLimits;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    tagline: "Try the core workflow on your next bid.",
    features: [
      "3 AI generations per month",
      "1 RFP upload per month",
      "Compliance matrix preview (first 5 rows)",
      "Capability statement generator",
      "Company profile",
    ],
    limits: {
      aiGenerationsPerMonth: 3,
      rfpUploadsPerMonth: 1,
      complianceMatrixRows: 5,
      exportsEnabled: false,
      fullProposal: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 79,
    tagline: "Everything you need to respond to RFPs every week.",
    features: [
      "100 AI generations per month",
      "20 RFP uploads per month",
      "Full compliance matrix + CSV export",
      "Full proposal drafts (all 11 sections)",
      "Markdown export",
      "Priority support",
    ],
    limits: {
      aiGenerationsPerMonth: 100,
      rfpUploadsPerMonth: 20,
      complianceMatrixRows: Number.POSITIVE_INFINITY,
      exportsEnabled: true,
      fullProposal: true,
    },
  },
};

export function getPlan(planId: string | null | undefined): Plan {
  return PLANS[(planId as PlanId) ?? "free"] ?? PLANS.free;
}
