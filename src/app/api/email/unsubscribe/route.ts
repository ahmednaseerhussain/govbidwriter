import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyUnsubscribeSignature } from "@/lib/email/send";

export const dynamic = "force-dynamic";

/** Map unsubscribe category → EmailPreference column. */
const CATEGORY_FIELD: Record<string, string> = {
  product: "productUpdates",
  marketing: "marketingEmails",
  deadline: "deadlineReminders",
  opportunity: "opportunityAlerts",
  usage: "usageAlerts",
};

/**
 * One-click unsubscribe from signed links in non-transactional emails.
 * GET /api/email/unsubscribe?uid=...&cat=...&sig=...
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid") ?? "";
  const cat = url.searchParams.get("cat") ?? "";
  const sig = url.searchParams.get("sig") ?? "";

  const field = CATEGORY_FIELD[cat];
  if (!uid || !field || !sig || !verifyUnsubscribeSignature(uid, cat, sig)) {
    return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  }

  try {
    await db.emailPreference.upsert({
      where: { userId: uid },
      create: { userId: uid, [field]: false },
      update: { [field]: false },
    });
  } catch {
    return new NextResponse("Could not update preferences.", { status: 500 });
  }

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#1a3357;">
<h1 style="font-size:20px;">You're unsubscribed</h1>
<p style="color:#55617a;font-size:14px;">You won't receive these emails anymore. You can re-enable them anytime in your <a href="/dashboard/settings">notification settings</a>.</p>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
