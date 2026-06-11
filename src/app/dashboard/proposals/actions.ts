"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { checkUsage, logUsage, getUserPlan } from "@/lib/usage";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getAIProvider, AIProviderError } from "@/lib/ai/provider";
import { proposalSectionPrompt } from "@/lib/ai/prompts";
import { parseStringArray } from "@/lib/json";
import { PROPOSAL_SECTION_DEFS } from "@/lib/proposal-sections";
import { sendTemplateEmail } from "@/lib/email/send";
import { notify } from "@/lib/notifications";

export type SectionState = { error?: string; saved?: boolean };

/** Sections free-plan users may generate (preview of value); the rest need Pro. */
const FREE_SECTION_LIMIT = 2;

export async function generateSectionAction(
  _prev: SectionState,
  formData: FormData
): Promise<SectionState> {
  const user = await requireUser();
  const sectionId = String(formData.get("sectionId") ?? "");

  const section = await db.proposalSection.findFirst({
    where: { id: sectionId, proposal: { userId: user.id } },
    include: {
      proposal: {
        include: {
          rfpDocument: {
            include: {
              analysis: true,
              requirements: {
                orderBy: [{ priority: "desc" }, { sortOrder: "asc" }],
                take: 15,
              },
            },
          },
        },
      },
    },
  });
  if (!section) return { error: "Section not found." };

  const plan = await getUserPlan(user.id);
  if (!plan.limits.fullProposal && section.sortOrder >= FREE_SECTION_LIMIT) {
    return {
      error:
        "Full proposal generation is a Pro feature. The Free plan can generate the Cover Letter and Executive Summary — upgrade to draft every section.",
    };
  }

  if (!checkRateLimit(`ai:${user.id}`, RATE_LIMITS.aiGeneration).ok) {
    return { error: "Too many generations in a short time. Please wait a bit." };
  }
  const usage = await checkUsage(user.id, "ai_generation");
  if (!usage.allowed) return { error: usage.message };

  const profile = await db.companyProfile.findUnique({
    where: { userId: user.id },
  });
  if (!profile?.companyName) {
    return { error: "Complete your company profile first — drafts are grounded in it." };
  }

  const rfp = section.proposal.rfpDocument;
  const analysis = rfp?.analysis;
  const guidance = PROPOSAL_SECTION_DEFS.find(
    (d) => d.title === section.title
  )?.guidance;

  try {
    const provider = await getAIProvider();
    const content = await provider.generateText(
      proposalSectionPrompt({
        sectionTitle: section.title,
        guidance,
        companyProfile: {
          companyName: profile.companyName,
          ownerName: profile.ownerName ?? undefined,
          email: profile.email ?? undefined,
          phone: profile.phone ?? undefined,
          uei: profile.uei ?? undefined,
          cageCode: profile.cageCode ?? undefined,
          naicsCodes: parseStringArray(profile.naicsCodes),
          certifications: parseStringArray(profile.certifications),
          setAsides: parseStringArray(profile.setAsides),
          services: profile.services ?? undefined,
          differentiators: profile.differentiators ?? undefined,
          pastPerformance: profile.pastPerformance ?? undefined,
          teamBios: profile.teamBios ?? undefined,
          serviceAreas: profile.serviceAreas ?? undefined,
        },
        rfpTitle: analysis?.title || rfp?.title || section.proposal.title,
        analysisSummary: analysis?.summary ?? undefined,
        evaluationCriteria: parseStringArray(analysis?.evaluationCriteria),
        keyRequirements: rfp?.requirements.map(
          (r) => `${r.reqId} (${r.section || "n/a"}): ${r.requirementText}`
        ),
      })
    );

    // Was this the first drafted section? (checked before the update lands)
    const previouslyDrafted = await db.proposalSection.count({
      where: { proposalId: section.proposalId, NOT: { content: "" } },
    });

    await db.proposalSection.update({
      where: { id: section.id },
      data: { content },
    });
    await logUsage(user.id, "ai_generation", `proposal_section:${section.title}`);

    if (previouslyDrafted === 0) {
      await Promise.all([
        sendTemplateEmail({
          userId: user.id,
          template: "proposal_draft_ready",
          payload: {
            proposalTitle: section.proposal.title,
            proposalId: section.proposalId,
          },
        }),
        notify({
          userId: user.id,
          type: "proposal",
          title: `First section drafted: ${section.proposal.title}`,
          body: `"${section.title}" is ready to review and edit.`,
          link: `/dashboard/proposals/${section.proposalId}`,
        }),
      ]);
    }

    revalidatePath(`/dashboard/proposals/${section.proposalId}`);
    return { saved: true };
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Generation failed. Please try again." };
  }
}

export async function saveSectionAction(
  _prev: SectionState,
  formData: FormData
): Promise<SectionState> {
  const user = await requireUser();
  const sectionId = String(formData.get("sectionId") ?? "");
  const content = String(formData.get("content") ?? "").slice(0, 100_000);

  const section = await db.proposalSection.findFirst({
    where: { id: sectionId, proposal: { userId: user.id } },
    select: { id: true, proposalId: true },
  });
  if (!section) return { error: "Section not found." };

  await db.proposalSection.update({
    where: { id: section.id },
    data: { content },
  });
  await db.proposal.update({
    where: { id: section.proposalId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/dashboard/proposals/${section.proposalId}`);
  return { saved: true };
}

export async function updateProposalStatusAction(
  _prev: SectionState,
  formData: FormData
): Promise<SectionState> {
  const user = await requireUser();
  const proposalId = String(formData.get("proposalId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["draft", "in_review", "final"].includes(status)) {
    return { error: "Invalid status." };
  }
  const proposal = await db.proposal.findFirst({
    where: { id: proposalId, userId: user.id },
    select: { id: true },
  });
  if (!proposal) return { error: "Proposal not found." };

  await db.proposal.update({ where: { id: proposal.id }, data: { status } });
  revalidatePath(`/dashboard/proposals/${proposal.id}`);
  return { saved: true };
}
