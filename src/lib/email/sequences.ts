import "server-only";
import { db } from "@/lib/db";
import { sendTemplateEmail } from "./send";

/**
 * Email sequences (drip campaigns).
 *
 * Sequence definitions are seeded into the DB on first use; enrollments track
 * each user's position. The cron route advances due enrollments.
 */

// Delays are relative to the previous step (or enrollment for the first).
// Day 0 is the welcome email, sent directly at signup.
const NURTURE_STEPS: { delayHours: number; template: string }[] = [
  { delayHours: 24, template: "nurture_profile" }, // day 1: complete profile
  { delayHours: 48, template: "nurture_upload" }, // day 3: upload an RFP
  { delayHours: 48, template: "nurture_compliance" }, // day 5: compliance matrix
  { delayHours: 48, template: "nurture_upgrade" }, // day 7: upgrade/export
];

/** Idempotently seed the nurture sequence and return its id. */
export async function ensureNurtureSequence(): Promise<string> {
  const existing = await db.emailSequence.findUnique({
    where: { name: "nurture" },
    include: { steps: true },
  });
  if (existing && existing.steps.length === NURTURE_STEPS.length) {
    return existing.id;
  }
  if (existing) {
    await db.emailSequenceStep.deleteMany({ where: { sequenceId: existing.id } });
    await db.emailSequenceStep.createMany({
      data: NURTURE_STEPS.map((s, i) => ({
        sequenceId: existing.id,
        stepOrder: i,
        delayHours: s.delayHours,
        template: s.template,
      })),
    });
    return existing.id;
  }
  const created = await db.emailSequence.create({
    data: {
      name: "nurture",
      steps: {
        create: NURTURE_STEPS.map((s, i) => ({
          stepOrder: i,
          delayHours: s.delayHours,
          template: s.template,
        })),
      },
    },
  });
  return created.id;
}

/** Enroll a user in the nurture sequence (no-op if already enrolled). */
export async function enrollInNurture(userId: string): Promise<void> {
  try {
    const sequenceId = await ensureNurtureSequence();
    const firstDelay = NURTURE_STEPS[0]?.delayHours ?? 48;
    await db.emailSequenceEnrollment.upsert({
      where: { userId_sequenceId: { userId, sequenceId } },
      create: {
        userId,
        sequenceId,
        currentStep: 0,
        nextSendAt: new Date(Date.now() + firstDelay * 60 * 60 * 1000),
      },
      update: {}, // already enrolled — leave as-is
    });
  } catch (err) {
    console.error("enrollInNurture failed:", err);
  }
}

/**
 * Send every due sequence step. Returns the number of emails processed.
 * Called from the cron route.
 */
export async function processDueEnrollments(limit = 50): Promise<number> {
  const due = await db.emailSequenceEnrollment.findMany({
    where: { completedAt: null, nextSendAt: { lte: new Date() } },
    include: { sequence: { include: { steps: { orderBy: { stepOrder: "asc" } } } } },
    take: limit,
  });

  let processed = 0;
  for (const enrollment of due) {
    const steps = enrollment.sequence.steps;
    const step = steps[enrollment.currentStep];
    if (!step) {
      await db.emailSequenceEnrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: new Date(), nextSendAt: null },
      });
      continue;
    }

    await sendTemplateEmail({
      userId: enrollment.userId,
      template: step.template,
    });
    processed++;

    const nextStep = steps[enrollment.currentStep + 1];
    await db.emailSequenceEnrollment.update({
      where: { id: enrollment.id },
      data: nextStep
        ? {
            currentStep: enrollment.currentStep + 1,
            nextSendAt: new Date(Date.now() + nextStep.delayHours * 60 * 60 * 1000),
          }
        : { completedAt: new Date(), nextSendAt: null },
    });
  }
  return processed;
}
