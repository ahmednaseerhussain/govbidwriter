"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { extractPdfText, MAX_PDF_BYTES } from "@/lib/pdf/extract";
import { checkUsage, logUsage } from "@/lib/usage";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { generateStructured, AIProviderError } from "@/lib/ai/provider";
import { rfpAnalysisPrompt, requirementExtractionPrompt } from "@/lib/ai/prompts";
import { rfpAnalysisSchema, requirementsListSchema } from "@/lib/ai/schemas";
import { toJsonString } from "@/lib/json";
import { PROPOSAL_SECTION_DEFS } from "@/lib/proposal-sections";
import { parseDeadlineDate } from "@/lib/utils";
import { sendTemplateEmail } from "@/lib/email/send";
import { notify } from "@/lib/notifications";

export type RfpFormState = { error?: string };

const MIN_TEXT_CHARS = 200;
const MAX_TEXT_CHARS = 800_000;

export async function createRfpAction(
  _prev: RfpFormState,
  formData: FormData
): Promise<RfpFormState> {
  const user = await requireUser();

  if (!checkRateLimit(`upload:${user.id}`, RATE_LIMITS.upload).ok) {
    return { error: "Too many uploads in a short time. Please wait a bit." };
  }

  const usage = await checkUsage(user.id, "rfp_upload");
  if (!usage.allowed) return { error: usage.message };

  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const mode = String(formData.get("mode") ?? "paste");

  let textContent = "";
  let fileName: string | null = null;
  let sourceType = "paste";

  if (mode === "pdf") {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Choose a PDF file to upload." };
    }
    if (file.size > MAX_PDF_BYTES) {
      return { error: "PDF exceeds the 10MB size limit." };
    }
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return { error: "Only PDF files are accepted. You can also paste the RFP text." };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const extraction = await extractPdfText(buffer);
    if (!extraction.ok) {
      return { error: extraction.error };
    }
    textContent = extraction.text;
    fileName = file.name.slice(0, 255);
    sourceType = "pdf";
  } else {
    textContent = String(formData.get("text") ?? "").trim();
    if (textContent.length < MIN_TEXT_CHARS) {
      return {
        error: `Paste at least ${MIN_TEXT_CHARS} characters of RFP text so analysis has something to work with.`,
      };
    }
  }

  if (textContent.length > MAX_TEXT_CHARS) {
    textContent = textContent.slice(0, MAX_TEXT_CHARS);
  }

  const rfp = await db.rfpDocument.create({
    data: {
      userId: user.id,
      title: title || fileName?.replace(/\.pdf$/i, "") || "Untitled RFP",
      fileName,
      sourceType,
      textContent,
      textLength: textContent.length,
    },
  });

  await logUsage(user.id, "rfp_upload", sourceType);
  await Promise.all([
    sendTemplateEmail({
      userId: user.id,
      template: "rfp_uploaded",
      payload: {
        rfpTitle: rfp.title,
        rfpId: rfp.id,
        chars: textContent.length.toLocaleString(),
      },
    }),
    notify({
      userId: user.id,
      type: "rfp",
      title: `RFP added: ${rfp.title}`,
      body: "Next: run the analysis, then extract the compliance matrix.",
      link: `/dashboard/rfps/${rfp.id}`,
    }),
  ]);
  redirect(`/dashboard/rfps/${rfp.id}`);
}

async function getOwnedRfp(rfpId: string, userId: string) {
  return db.rfpDocument.findFirst({ where: { id: rfpId, userId } });
}

export type AnalyzeState = { error?: string };

export async function analyzeRfpAction(
  _prev: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  const user = await requireUser();
  const rfpId = String(formData.get("rfpId") ?? "");
  const rfp = await getOwnedRfp(rfpId, user.id);
  if (!rfp) return { error: "RFP not found." };

  if (!checkRateLimit(`ai:${user.id}`, RATE_LIMITS.aiGeneration).ok) {
    return { error: "Too many generations in a short time. Please wait a bit." };
  }
  const usage = await checkUsage(user.id, "ai_generation");
  if (!usage.allowed) return { error: usage.message };

  try {
    const analysis = await generateStructured(
      rfpAnalysisPrompt(rfp.textContent, rfp.title),
      rfpAnalysisSchema
    );

    const analysisData = {
      title: analysis.title || rfp.title,
      agency: analysis.agency,
      solicitationNumber: analysis.solicitationNumber,
      deadline: analysis.deadline,
      deadlineAt: parseDeadlineDate(analysis.deadline),
      naicsCodes: toJsonString(analysis.naicsCodes),
      setAside: analysis.setAside,
      summary: analysis.summary,
      submissionInstructions: toJsonString(analysis.submissionInstructions),
      evaluationCriteria: toJsonString(analysis.evaluationCriteria),
      requiredDocuments: toJsonString(analysis.requiredDocuments),
      risks: toJsonString(analysis.risks),
    };

    await db.rfpAnalysis.upsert({
      where: { rfpDocumentId: rfp.id },
      create: { rfpDocumentId: rfp.id, ...analysisData },
      // Re-analysis resets the reminder dedupe so a changed deadline re-alerts.
      update: { ...analysisData, remindersSent: null },
    });

    await logUsage(user.id, "ai_generation", "rfp_analysis");
    await Promise.all([
      sendTemplateEmail({
        userId: user.id,
        template: "rfp_analysis_complete",
        payload: {
          rfpTitle: rfp.title,
          rfpId: rfp.id,
          deadline: analysis.deadline || "",
        },
      }),
      notify({
        userId: user.id,
        type: "rfp",
        title: `Analysis ready: ${rfp.title}`,
        body: analysis.deadline ? `Deadline found: ${analysis.deadline}` : undefined,
        link: `/dashboard/rfps/${rfp.id}`,
      }),
    ]);
    revalidatePath(`/dashboard/rfps/${rfp.id}`);
    return {};
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Analysis failed. Please try again." };
  }
}

export async function extractRequirementsAction(
  _prev: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  const user = await requireUser();
  const rfpId = String(formData.get("rfpId") ?? "");
  const rfp = await getOwnedRfp(rfpId, user.id);
  if (!rfp) return { error: "RFP not found." };

  if (!checkRateLimit(`ai:${user.id}`, RATE_LIMITS.aiGeneration).ok) {
    return { error: "Too many generations in a short time. Please wait a bit." };
  }
  const usage = await checkUsage(user.id, "ai_generation");
  if (!usage.allowed) return { error: usage.message };

  try {
    const { requirements } = await generateStructured(
      requirementExtractionPrompt(rfp.textContent),
      requirementsListSchema
    );
    if (requirements.length === 0) {
      return { error: "No requirements could be extracted from this document." };
    }

    await db.$transaction([
      db.rfpRequirement.deleteMany({ where: { rfpDocumentId: rfp.id } }),
      db.rfpRequirement.createMany({
        data: requirements.map((r, i) => ({
          rfpDocumentId: rfp.id,
          reqId: r.id || `R-${String(i + 1).padStart(3, "0")}`,
          section: r.section || null,
          pageReference: r.pageReference || null,
          requirementText: r.requirementText,
          responseNeeded: r.responseNeeded || null,
          requiredDocument: r.requiredDocument || null,
          priority: r.priority,
          riskLevel: r.riskLevel,
          status: "not_started",
          sortOrder: i,
        })),
      }),
    ]);

    await logUsage(user.id, "ai_generation", "requirement_extraction");
    await Promise.all([
      sendTemplateEmail({
        userId: user.id,
        template: "compliance_matrix_ready",
        payload: {
          rfpTitle: rfp.title,
          rfpId: rfp.id,
          count: String(requirements.length),
        },
      }),
      notify({
        userId: user.id,
        type: "rfp",
        title: `Compliance matrix ready: ${requirements.length} requirements`,
        body: `Extracted from ${rfp.title}. Verify against the official solicitation.`,
        link: `/dashboard/rfps/${rfp.id}`,
      }),
    ]);
    revalidatePath(`/dashboard/rfps/${rfp.id}`);
    return {};
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Requirement extraction failed. Please try again." };
  }
}

const statusSchema = z.enum(["not_started", "in_progress", "complete"]);

export async function updateRequirementStatusAction(
  requirementId: string,
  status: string
): Promise<void> {
  const user = await requireUser();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return;

  // Ownership check via the parent document.
  const requirement = await db.rfpRequirement.findFirst({
    where: { id: requirementId, rfpDocument: { userId: user.id } },
    select: { id: true, rfpDocumentId: true },
  });
  if (!requirement) return;

  await db.rfpRequirement.update({
    where: { id: requirement.id },
    data: { status: parsed.data },
  });
  revalidatePath(`/dashboard/rfps/${requirement.rfpDocumentId}`);
}

export async function createProposalAction(
  _prev: AnalyzeState,
  formData: FormData
): Promise<AnalyzeState> {
  const user = await requireUser();
  const rfpId = String(formData.get("rfpId") ?? "");
  const rfp = await getOwnedRfp(rfpId, user.id);
  if (!rfp) return { error: "RFP not found." };

  const proposal = await db.proposal.create({
    data: {
      userId: user.id,
      rfpDocumentId: rfp.id,
      title: `Proposal — ${rfp.title}`,
      status: "draft",
      sections: {
        create: PROPOSAL_SECTION_DEFS.map((s, i) => ({
          sortOrder: i,
          title: s.title,
          content: "",
        })),
      },
    },
  });

  await notify({
    userId: user.id,
    type: "proposal",
    title: `Proposal created: ${proposal.title}`,
    body: "Generate each section from your company profile and the RFP analysis.",
    link: `/dashboard/proposals/${proposal.id}`,
  });

  redirect(`/dashboard/proposals/${proposal.id}`);
}
