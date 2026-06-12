import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { processDueEnrollments } from "@/lib/email/sequences";
import { sendTemplateEmail } from "@/lib/email/send";
import { notify } from "@/lib/notifications";

export const dynamic = "force-dynamic";

/**
 * Email cron: processes due sequence steps and deadline reminders.
 *
 * Call on a schedule (Vercel Cron, or any scheduler):
 *   GET /api/cron/process-emails
 *   Authorization: Bearer <CRON_SECRET>   (or ?secret=<CRON_SECRET>)
 *
 * vercel.json schedules this ONCE DAILY — the Vercel Hobby plan rejects
 * deployments with sub-daily cron expressions. The logic below is idempotent
 * and window-based, so daily cadence (with Hobby's ±59min jitter) is safe.
 * Replace with a proper background-job service (Inngest/QStash) post-launch.
 */

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Without a secret, only allow in development so the route can be tested.
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

/** Reminder stages, widest first. With a daily cron, each fires at most once. */
const REMINDER_STAGES = [
  { label: "7d", days: 7, human: "in about a week" },
  { label: "3d", days: 3, human: "in 3 days" },
  { label: "1d", days: 1, human: "tomorrow" },
] as const;

function parseStages(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

async function processDeadlineReminders(): Promise<number> {
  const now = new Date();
  const maxWindow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcoming = await db.rfpAnalysis.findMany({
    where: { deadlineAt: { gte: now, lte: maxWindow } },
    include: {
      rfpDocument: { select: { id: true, title: true, userId: true } },
    },
    take: 100,
  });

  let sent = 0;
  for (const analysis of upcoming) {
    if (!analysis.deadlineAt) continue;
    const sentStages = parseStages(analysis.remindersSent);
    const daysUntil =
      (analysis.deadlineAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);

    // Tightest stage whose window we're inside and that hasn't been sent.
    const stage = [...REMINDER_STAGES]
      .reverse()
      .find((s) => daysUntil <= s.days && !sentStages.includes(s.label));
    if (!stage) continue;

    const rfp = analysis.rfpDocument;
    // Mark all stages at/above this window as covered so a late first run
    // (e.g. RFP analyzed 2 days before deadline) sends one email, not three.
    const newStages = Array.from(
      new Set([
        ...sentStages,
        ...REMINDER_STAGES.filter((s) => s.days >= stage.days).map((s) => s.label),
      ])
    );

    await Promise.all([
      sendTemplateEmail({
        userId: rfp.userId,
        template: "deadline_reminder",
        payload: {
          rfpTitle: rfp.title,
          rfpId: rfp.id,
          deadline:
            analysis.deadline || analysis.deadlineAt.toDateString() || "",
          stage: stage.human,
        },
      }),
      notify({
        userId: rfp.userId,
        type: "deadline",
        title: `Deadline ${stage.human}: ${rfp.title}`,
        body: analysis.deadline || undefined,
        link: `/dashboard/rfps/${rfp.id}`,
      }),
      db.rfpAnalysis.update({
        where: { id: analysis.id },
        data: { remindersSent: JSON.stringify(newStages) },
      }),
    ]);
    sent++;
  }
  return sent;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [sequenceEmails, deadlineReminders] = await Promise.all([
      processDueEnrollments(),
      processDeadlineReminders(),
    ]);
    return NextResponse.json({
      ok: true,
      sequenceEmails,
      deadlineReminders,
      processedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("cron process-emails failed:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
