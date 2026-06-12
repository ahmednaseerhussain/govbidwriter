"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { splitList, toJsonString, parseStringArray } from "@/lib/json";
import { checkUsage, logUsage } from "@/lib/usage";
import { generateStructured, AIProviderError } from "@/lib/ai/provider";
import { capabilityStatementPrompt } from "@/lib/ai/prompts";
import { capabilityStatementSchema, type CapabilityStatement } from "@/lib/ai/schemas";
import { capabilityStatementToMarkdown } from "@/lib/export";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendTemplateEmail } from "@/lib/email/send";
import { track } from "@/lib/analytics";
import { notify } from "@/lib/notifications";

const profileSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required.").max(200),
  website: z.string().trim().max(300).optional(),
  ownerName: z.string().trim().max(200).optional(),
  email: z.string().trim().max(254).optional(),
  phone: z.string().trim().max(50).optional(),
  address: z.string().trim().max(500).optional(),
  uei: z.string().trim().max(20).optional(),
  cageCode: z.string().trim().max(10).optional(),
  naicsCodes: z.string().max(1000).optional(),
  certifications: z.string().max(1000).optional(),
  setAsides: z.string().max(1000).optional(),
  services: z.string().max(5000).optional(),
  differentiators: z.string().max(5000).optional(),
  pastPerformance: z.string().max(8000).optional(),
  teamBios: z.string().max(8000).optional(),
  serviceAreas: z.string().max(1000).optional(),
});

export type ProfileFormState = { error?: string; saved?: boolean };

export async function saveCompanyProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await requireUser();

  const raw = Object.fromEntries(
    Object.keys(profileSchema.shape).map((key) => [
      key,
      String(formData.get(key) ?? ""),
    ])
  );
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const data = {
    companyName: d.companyName,
    website: d.website || null,
    ownerName: d.ownerName || null,
    email: d.email || null,
    phone: d.phone || null,
    address: d.address || null,
    uei: d.uei || null,
    cageCode: d.cageCode || null,
    naicsCodes: toJsonString(splitList(d.naicsCodes)),
    certifications: toJsonString(splitList(d.certifications)),
    setAsides: toJsonString(splitList(d.setAsides)),
    services: d.services || null,
    differentiators: d.differentiators || null,
    pastPerformance: d.pastPerformance || null,
    teamBios: d.teamBios || null,
    serviceAreas: d.serviceAreas || null,
  };

  await db.companyProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  });

  track("profile_saved", { hasServices: Boolean(d.services) }, user.id);
  revalidatePath("/dashboard/company-profile");
  return { saved: true };
}

export type CapStatementState = {
  error?: string;
  markdown?: string;
  result?: CapabilityStatement;
};

export async function generateCapabilityStatementAction(
  _prev: CapStatementState,
  formData: FormData
): Promise<CapStatementState> {
  const user = await requireUser();

  if (!checkRateLimit(`ai:${user.id}`, RATE_LIMITS.aiGeneration).ok) {
    return { error: "Too many generations in a short time. Please wait a bit." };
  }

  const usage = await checkUsage(user.id, "ai_generation");
  if (!usage.allowed) return { error: usage.message };

  const profile = await db.companyProfile.findUnique({
    where: { userId: user.id },
  });
  if (!profile?.companyName) {
    return { error: "Save your company profile first — generation is grounded in it." };
  }

  const targetIndustry = String(formData.get("targetIndustry") ?? "").slice(0, 200);
  const targetAgency = String(formData.get("targetAgency") ?? "").slice(0, 200);

  try {
    const result = await generateStructured(
      capabilityStatementPrompt(
        {
          companyName: profile.companyName,
          website: profile.website ?? undefined,
          ownerName: profile.ownerName ?? undefined,
          email: profile.email ?? undefined,
          phone: profile.phone ?? undefined,
          address: profile.address ?? undefined,
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
        targetIndustry || undefined,
        targetAgency || undefined
      ),
      capabilityStatementSchema
    );

    const markdown = capabilityStatementToMarkdown(result, profile.companyName);

    track("capability_statement_generated", { targetIndustry }, user.id);
    await Promise.all([
      logUsage(user.id, "ai_generation", "capability_statement"),
      db.generatedTool.create({
        data: {
          userId: user.id,
          toolType: "capability_statement",
          input: JSON.stringify({ targetIndustry, targetAgency }),
          output: markdown,
        },
      }),
      sendTemplateEmail({
        userId: user.id,
        template: "capability_statement_ready",
        payload: { targetIndustry },
      }),
      notify({
        userId: user.id,
        type: "proposal",
        title: "Capability statement generated",
        body: targetIndustry ? `Tailored for ${targetIndustry}.` : undefined,
        link: "/dashboard/company-profile",
      }),
    ]);

    return { result, markdown };
  } catch (err) {
    if (err instanceof AIProviderError) return { error: err.message };
    return { error: "Generation failed. Please try again." };
  }
}
