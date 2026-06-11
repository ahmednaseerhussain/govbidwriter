import { z } from "zod";

// Zod schemas for every structured AI output. All AI JSON is validated against
// these before it touches the DB or the UI.

export const rfpAnalysisSchema = z.object({
  title: z.string().default(""),
  agency: z.string().default(""),
  solicitationNumber: z.string().default(""),
  deadline: z.string().default(""),
  naicsCodes: z.array(z.string()).default([]),
  setAside: z.string().default(""),
  summary: z.string().default(""),
  submissionInstructions: z.array(z.string()).default([]),
  evaluationCriteria: z.array(z.string()).default([]),
  requiredDocuments: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
});
export type RfpAnalysis = z.infer<typeof rfpAnalysisSchema>;

export const priorityLevel = z.enum(["low", "medium", "high"]);

export const extractedRequirementSchema = z.object({
  id: z.string().default(""),
  section: z.string().default(""),
  pageReference: z.string().default(""),
  requirementText: z.string(),
  responseNeeded: z.string().default(""),
  requiredDocument: z.string().default(""),
  priority: priorityLevel.default("medium"),
  riskLevel: priorityLevel.default("low"),
  status: z.string().default("not_started"),
});
export type ExtractedRequirement = z.infer<typeof extractedRequirementSchema>;

export const requirementsListSchema = z.object({
  requirements: z.array(extractedRequirementSchema),
});
export type RequirementsList = z.infer<typeof requirementsListSchema>;

export const capabilityStatementSchema = z.object({
  companyOverview: z.string(),
  coreCompetencies: z.array(z.string()),
  differentiators: z.array(z.string()),
  pastPerformance: z.array(z.string()),
  naicsCodes: z.array(z.string()).default([]),
  contactBlock: z.string(),
});
export type CapabilityStatement = z.infer<typeof capabilityStatementSchema>;

export const proposalOutlineSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string(),
      guidance: z.string().default(""),
    })
  ),
});
export type ProposalOutline = z.infer<typeof proposalOutlineSchema>;

/** The 11 standard proposal sections, in order. */
export const PROPOSAL_SECTIONS = [
  "Cover Letter",
  "Executive Summary",
  "Understanding of Requirements",
  "Technical Approach",
  "Management Approach",
  "Staffing Plan",
  "Quality Control Plan",
  "Past Performance",
  "Risk Management",
  "Pricing Narrative",
  "Submission Checklist",
] as const;
