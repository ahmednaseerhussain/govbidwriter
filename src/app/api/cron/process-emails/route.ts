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
 * Replace with a proper background-job service (Inngest/QStash) post-launch.
 */

const REMINDER_WINDOW_DAYS = 3;

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

async function processDeadlineReminders(): Promise<number> {
  const now = new Date();
  const windowEnd = new Date(
    now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );

  const upcoming = await db.rfpAnalysis.findMany({
    where: {
      reminderSentAt: null,
      deadlineAt: { gte: now, lte: windowEnd },
    },
    include: {
      rfpDocument: { select: { id: true, title: true, userId: true } },
    },
    take: 50,
  });

  let sent = 0;
  for (const analysis of upcoming) {
    const rfp = analysis.rfpDocument;
    await Promise.all([
      sendTemplateEmail({
        userId: rfp.userId,
        template: "deadline_reminder",
        payload: {
          rfpTitle: rfp.title,
          rfpId: rfp.id,
          deadline: analysis.deadline || analysis.deadlineAt?.toDateString() || "",
        },
      }),
      notify({
        userId: rfp.userId,
        type: "deadline",
        title: `Deadline approaching: ${rfp.title}`,
        body: analysis.deadline || undefined,
        link: `/dashboard/rfps/${rfp.id}`,
      }),
      db.rfpAnalysis.update({
        where: { id: analysis.id },
        data: { reminderSentAt: now },
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
