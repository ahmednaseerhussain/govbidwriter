"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { generateStructured, getAIProvider, AIProviderError } from "@/lib/ai/provider";
import {
  capabilityStatementPrompt,
  requirementExtractionPrompt,
  pastPerformancePrompt,
  executiveSummaryPrompt,
} from "@/lib/ai/prompts";
import {
  capabilityStatementSchema,
  requirementsListSchema,
  type ExtractedRequirement,
} from "@/lib/ai/schemas";
import { capabilityStatementToMarkdown } from "@/lib/export";
import { splitList } from "@/lib/json";
import { track } from "@/lib/analytics";

/**
 * Public (unauthenticated) tool actions. These are lead magnets:
 * strictly IP rate-limited, results truncated, with signup CTAs in the UI.
 */

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

export type PublicCapStatementState = {
  error?: string;
  markdown?: string;
};

const publicCapSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required.").max(200),
  services: z.string().trim().min(10, "Describe your services (a few lines).").max(3000),
  targetIndustry: z.string().trim().max(200).optional(),
  naicsCodes: z.string().trim().max(300).optional(),
  certifications: z.string().trim().max(300).optional(),
  pastPerformance: z.string().trim().max(3000).optional(),
  email: z.string().trim().max(254).optional(),
  phone: z.string().trim().max(50).optional(),
});

export async function publicCapabilityStatementAction(
  _prev: PublicCapStatementState,
  formData: FormData
): Promise<PublicCapStatementState> {
  const ip = await clientIp();
  const limit = checkRateLimit(`pub-cap:${ip}`, RATE_LIMITS.publicTool);
  if (!limit.ok) {
    return {
      error: `Free tool limit reached. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or create a free account for monthly quota.`,
    };
  }

  const parsed = publicCapSchema.safeParse(
    Object.fromEntries(
      ["companyName", "services", "targetIndustry", "naicsCodes", "certifications", "pastPerformance", "email", "phone"].map(
        (k) => [k, String(formData.get(k) ?? "")]
      )
    )
  );
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  try {
    const result = await generateStructured(
      capabilityStatementPrompt(
        {
          companyName: d.companyName,
          services: d.services,
          naicsCodes: splitList(d.naicsCodes),
          certifications: splitList(d.certifications),
          pastPerformance: d.pastPerformance,
          email: d.email,
          phone: d.phone,
        },
        d.targetIndustry || undefined
      ),
      capabilityStatementSchema
    );
    const markdown = capabilityStatementToMarkdown(result, d.companyName);

    await db.generatedTool.create({
      data: {
        toolType: "capability_statement_public",
        input: JSON.stringify({ targetIndustry: d.targetIndustry }),
        output: markdown,
      },
    });
    track("tool_used", { tool: "capability_statement_public" });

    return { markdown };
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Generation failed. Please try again." };
  }
}

export type PublicMatrixState = {
  error?: string;
  requirements?: ExtractedRequirement[];
  totalFound?: number;
};

const PUBLIC_MATRIX_PREVIEW_ROWS = 8;

export async function publicComplianceMatrixAction(
  _prev: PublicMatrixState,
  formData: FormData
): Promise<PublicMatrixState> {
  const ip = await clientIp();
  const limit = checkRateLimit(`pub-matrix:${ip}`, RATE_LIMITS.publicTool);
  if (!limit.ok) {
    return {
      error: `Free tool limit reached. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or create a free account for monthly quota.`,
    };
  }

  const text = String(formData.get("text") ?? "").trim();
  if (text.length < 200) {
    return { error: "Paste at least 200 characters of RFP text." };
  }

  try {
    const { requirements } = await generateStructured(
      requirementExtractionPrompt(text.slice(0, 100_000)),
      requirementsListSchema
    );
    if (requirements.length === 0) {
      return { error: "No requirements could be extracted from this text." };
    }

    await db.generatedTool.create({
      data: {
        toolType: "compliance_matrix_public",
        input: JSON.stringify({ chars: text.length }),
        output: JSON.stringify({ count: requirements.length }),
      },
    });
    track("tool_used", { tool: "compliance_matrix_public", count: requirements.length });

    return {
      requirements: requirements.slice(0, PUBLIC_MATRIX_PREVIEW_ROWS),
      totalFound: requirements.length,
    };
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Extraction failed. Please try again." };
  }
}

// ---- Past performance writer ----

export type PublicTextToolState = {
  error?: string;
  markdown?: string;
};

const pastPerfSchema = z.object({
  projectName: z.string().trim().min(2, "Project or client name is required.").max(200),
  scope: z.string().trim().min(20, "Describe the scope of work (a few sentences).").max(4000),
  contractValue: z.string().trim().max(100).optional(),
  dates: z.string().trim().max(100).optional(),
  outcome: z.string().trim().min(10, "Describe the result or outcome.").max(2000),
  relevance: z.string().trim().max(2000).optional(),
});

export async function publicPastPerformanceAction(
  _prev: PublicTextToolState,
  formData: FormData
): Promise<PublicTextToolState> {
  const ip = await clientIp();
  const limit = checkRateLimit(`pub-pastperf:${ip}`, RATE_LIMITS.publicTool);
  if (!limit.ok) {
    return {
      error: `Free tool limit reached. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or create a free account for monthly quota.`,
    };
  }

  const parsed = pastPerfSchema.safeParse(
    Object.fromEntries(
      ["projectName", "scope", "contractValue", "dates", "outcome", "relevance"].map((k) => [
        k,
        String(formData.get(k) ?? ""),
      ])
    )
  );
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const provider = await getAIProvider();
    const markdown = await provider.generateText(pastPerformancePrompt(parsed.data));

    await db.generatedTool.create({
      data: {
        toolType: "past_performance_public",
        input: JSON.stringify({ chars: parsed.data.scope.length }),
        output: markdown.slice(0, 20_000),
      },
    });
    track("tool_used", { tool: "past_performance_public" });

    return { markdown };
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Generation failed. Please try again." };
  }
}

// ---- Executive summary generator ----

const execSummarySchema = z.object({
  rfpSummary: z.string().trim().min(30, "Summarize what the RFP asks for (a few sentences).").max(5000),
  strengths: z.string().trim().min(20, "List your company's key strengths.").max(5000),
  agency: z.string().trim().max(200).optional(),
  companyName: z.string().trim().max(200).optional(),
});

export async function publicExecutiveSummaryAction(
  _prev: PublicTextToolState,
  formData: FormData
): Promise<PublicTextToolState> {
  const ip = await clientIp();
  const limit = checkRateLimit(`pub-execsum:${ip}`, RATE_LIMITS.publicTool);
  if (!limit.ok) {
    return {
      error: `Free tool limit reached. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or create a free account for monthly quota.`,
    };
  }

  const parsed = execSummarySchema.safeParse(
    Object.fromEntries(
      ["rfpSummary", "strengths", "agency", "companyName"].map((k) => [
        k,
        String(formData.get(k) ?? ""),
      ])
    )
  );
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const provider = await getAIProvider();
    const markdown = await provider.generateText(executiveSummaryPrompt(parsed.data));

    await db.generatedTool.create({
      data: {
        toolType: "executive_summary_public",
        input: JSON.stringify({ agency: parsed.data.agency }),
        output: markdown.slice(0, 20_000),
      },
    });
    track("tool_used", { tool: "executive_summary_public" });

    return { markdown };
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Generation failed. Please try again." };
  }
}

// ---- Proposal checklist generator (rule-based, no AI) ----

export type ChecklistResult = {
  requiredDocuments: string[];
  submissionSteps: string[];
  deadlines: string[];
  complianceChecks: string[];
};

export type PublicChecklistState = {
  error?: string;
  result?: ChecklistResult;
};

/** Document/form keywords scanned for in RFP text (lowercase). */
const DOC_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /capability statement/, label: "Capability statement" },
  { pattern: /\bsf[- ]?1449\b/, label: "SF-1449 (Solicitation/Contract/Order form) — signed" },
  { pattern: /\bsf[- ]?33\b/, label: "SF-33 (Solicitation, Offer and Award form) — signed" },
  { pattern: /\bsf[- ]?30\b|amendment/, label: "Amendment acknowledgments (SF-30 / Block 14)" },
  { pattern: /technical (proposal|volume|approach)/, label: "Technical proposal / approach volume" },
  { pattern: /price (proposal|volume|schedule)|cost proposal|pricing schedule|bid schedule/, label: "Price proposal per the solicitation's pricing schedule" },
  { pattern: /past performance/, label: "Past performance references" },
  { pattern: /quality (control|assurance) plan|\bqcp\b/, label: "Quality Control Plan" },
  { pattern: /staffing plan|management plan|key personnel/, label: "Staffing / management plan with key personnel" },
  { pattern: /resume/, label: "Key personnel resumes" },
  { pattern: /certificate of insurance|liability insurance|insurance requirement/, label: "Certificates of insurance" },
  { pattern: /bid bond|performance bond|payment bond|surety/, label: "Bonding documentation (bid/performance/payment bonds)" },
  { pattern: /license|licensure|certification requirement/, label: "Licenses / certifications required for performance" },
  { pattern: /safety (plan|program)|accident prevention plan/, label: "Safety plan / program" },
  { pattern: /transition|phase[- ]in/, label: "Transition / phase-in plan" },
  { pattern: /subcontracting plan/, label: "Small business subcontracting plan" },
  { pattern: /reps? and certs|representations and certifications|far 52\.212-3/, label: "Representations and certifications (SAM.gov / FAR 52.212-3)" },
  { pattern: /site visit|pre[- ]?(bid|proposal) (conference|meeting)/, label: "Site visit / pre-proposal conference attendance record" },
  { pattern: /financial statement|financial capability/, label: "Financial capability documentation" },
  { pattern: /warranty/, label: "Warranty terms" },
];

const DEADLINE_REGEX =
  /(?:due|deadline|no later than|nlt|must be (?:received|submitted)|closes?|closing date)[^.\n]{0,120}/gi;

export async function publicChecklistAction(
  _prev: PublicChecklistState,
  formData: FormData
): Promise<PublicChecklistState> {
  const ip = await clientIp();
  const limit = checkRateLimit(`pub-checklist:${ip}`, RATE_LIMITS.publicTool);
  if (!limit.ok) {
    return {
      error: `Free tool limit reached. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or create a free account for monthly quota.`,
    };
  }

  const text = String(formData.get("text") ?? "").trim();
  if (text.length < 200) {
    return { error: "Please paste at least 200 characters of RFP text so we can build the checklist." };
  }
  const lower = text.slice(0, 200_000).toLowerCase();

  const requiredDocuments = DOC_PATTERNS.filter((d) => d.pattern.test(lower)).map(
    (d) => d.label
  );
  if (requiredDocuments.length === 0) {
    requiredDocuments.push(
      "No specific documents detected — check the solicitation's instructions section (Section L or 'Instructions to Offerors') manually."
    );
  }

  const deadlineMatches = Array.from(
    new Set(
      (text.match(DEADLINE_REGEX) || [])
        .map((m) => m.trim().replace(/\s+/g, " "))
        .filter((m) => m.length > 15)
        .slice(0, 6)
    )
  );

  const submissionSteps = [
    "Read the instructions section (Section L / 'Instructions to Offerors') end to end before writing",
    lower.includes("sam.gov") || lower.includes("sam registration")
      ? "Verify your SAM.gov registration is active and representations are current"
      : "Verify your SAM.gov registration is active (required for nearly all federal work)",
    lower.match(/site visit|pre[- ]?(bid|proposal)/)
      ? "Attend the site visit / pre-proposal conference — it may be mandatory"
      : "Check whether a site visit or pre-proposal conference is scheduled",
    "Submit questions before the Q&A cutoff and monitor for amendments",
    "Assemble every required document from the checklist below, in the format/volume structure specified",
    "Acknowledge all amendments on the required form",
    lower.includes("email") && lower.match(/submit|submission/)
      ? "Confirm the submission email address, file format, and size limits — send early and request a read receipt"
      : "Confirm the exact submission method (portal, email, or physical) and address",
    "Submit at least 24 hours early — late proposals are rejected with no exceptions",
  ];

  const complianceChecks = [
    "Every 'shall' and 'must' statement has a response (build a compliance matrix)",
    "Page limits, fonts, and margins match the formatting instructions exactly",
    "Evaluation criteria language is mirrored in your section headings",
    "All forms are signed by an authorized representative",
    "Pricing matches the solicitation's schedule structure line by line",
    "Wage determination rates (SCA/Davis-Bacon) are built into pricing where applicable",
  ];

  await db.generatedTool.create({
    data: {
      toolType: "proposal_checklist_public",
      input: JSON.stringify({ chars: text.length }),
      output: JSON.stringify({ documents: requiredDocuments.length, deadlines: deadlineMatches.length }),
    },
  });
  track("tool_used", { tool: "proposal_checklist_public" });

  return {
    result: {
      requiredDocuments,
      submissionSteps,
      deadlines: deadlineMatches,
      complianceChecks,
    },
  };
}
