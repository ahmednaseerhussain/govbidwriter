import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getUserPlan, logUsage } from "@/lib/usage";
import { requirementsToCsv } from "@/lib/export";
import { slugify } from "@/lib/utils";
import { sendTemplateEmail, wasEmailSentSince } from "@/lib/email/send";
import { track } from "@/lib/analytics";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const rfp = await db.rfpDocument.findFirst({
    where: { id, userId: user.id },
    include: { requirements: { orderBy: { sortOrder: "asc" } } },
  });
  if (!rfp) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const plan = await getUserPlan(user.id);
  if (!plan.limits.exportsEnabled) {
    return NextResponse.json(
      { error: "Exports require the Pro plan." },
      { status: 403 }
    );
  }

  const csv = requirementsToCsv(rfp.requirements);
  await logUsage(user.id, "export", "matrix_csv");
  track("export_downloaded", { type: "matrix_csv" }, user.id);

  // Confirmation email at most once per day (exports are repeated often).
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (!(await wasEmailSentSince(user.id, "export_ready", dayAgo))) {
    await sendTemplateEmail({
      userId: user.id,
      template: "export_ready",
      payload: { exportType: "compliance matrix CSV", title: rfp.title },
    });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="compliance-matrix-${slugify(rfp.title)}.csv"`,
    },
  });
}
