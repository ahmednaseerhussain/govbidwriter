"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { generateStructured, AIProviderError } from "@/lib/ai/provider";
import {
  capabilityStatementPrompt,
  requirementExtractionPrompt,
} from "@/lib/ai/prompts";
import {
  capabilityStatementSchema,
  requirementsListSchema,
  type ExtractedRequirement,
} from "@/lib/ai/schemas";
import { capabilityStatementToMarkdown } from "@/lib/export";
import { splitList } from "@/lib/json";

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

    return {
      requirements: requirements.slice(0, PUBLIC_MATRIX_PREVIEW_ROWS),
      totalFound: requirements.length,
    };
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Extraction failed. Please try again." };
  }
}
