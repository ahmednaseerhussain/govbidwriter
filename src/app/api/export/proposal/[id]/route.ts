import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getUserPlan, logUsage } from "@/lib/usage";
import { proposalToMarkdown } from "@/lib/export";
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
  const proposal = await db.proposal.findFirst({
    where: { id, userId: user.id },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const plan = await getUserPlan(user.id);
  if (!plan.limits.exportsEnabled) {
    return NextResponse.json(
      { error: "Exports require the Pro plan." },
      { status: 403 }
    );
  }

  const markdown = proposalToMarkdown(
    proposal.title,
    proposal.sections.map((s) => ({ title: s.title, content: s.content }))
  );
  await logUsage(user.id, "export", "proposal_markdown");
  track("export_downloaded", { type: "proposal_markdown" }, user.id);

  // Confirmation email at most once per day (exports are repeated often).
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (!(await wasEmailSentSince(user.id, "export_ready", dayAgo))) {
    await sendTemplateEmail({
      userId: user.id,
      template: "export_ready",
      payload: { exportType: "proposal Markdown", title: proposal.title },
    });
  }

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugify(proposal.title)}.md"`,
    },
  });
}
