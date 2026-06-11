import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Lock } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getUserPlan } from "@/lib/usage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { SectionEditor } from "./section-editor";

export const metadata: Metadata = { title: "Proposal Editor" };

export default async function ProposalEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const proposal = await db.proposal.findFirst({
    where: { id, userId: user.id },
    include: {
      sections: { orderBy: { sortOrder: "asc" } },
      rfpDocument: { select: { id: true, title: true } },
    },
  });
  if (!proposal) notFound();

  const plan = await getUserPlan(user.id);
  const drafted = proposal.sections.filter((s) => s.content.trim()).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">
            <Link href="/dashboard/proposals" className="hover:underline">
              Proposals
            </Link>{" "}
            / {proposal.title}
          </div>
          <h1 className="mt-1 text-2xl font-bold">{proposal.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {proposal.rfpDocument ? (
              <>
                Based on{" "}
                <Link
                  href={`/dashboard/rfps/${proposal.rfpDocument.id}`}
                  className="text-primary hover:underline"
                >
                  {proposal.rfpDocument.title}
                </Link>{" "}
                ·{" "}
              </>
            ) : null}
            {drafted}/{proposal.sections.length} sections drafted ·{" "}
            <Badge variant="secondary">{proposal.status}</Badge>
          </p>
        </div>
        {plan.limits.exportsEnabled ? (
          <a href={`/api/export/proposal/${proposal.id}`}>
            <Button variant="outline">
              <Download className="h-4 w-4" /> Export Markdown
            </Button>
          </a>
        ) : (
          <Link href="/dashboard/billing">
            <Button variant="outline">
              <Lock className="h-4 w-4" /> Export (Pro)
            </Button>
          </Link>
        )}
      </div>

      {!plan.limits.fullProposal && (
        <Alert variant="info">
          Free plan: you can generate the <strong>Cover Letter</strong> and{" "}
          <strong>Executive Summary</strong>. Editing is unlimited.{" "}
          <Link href="/dashboard/billing" className="font-medium underline">
            Upgrade to Pro
          </Link>{" "}
          to draft all 11 sections and export.
        </Alert>
      )}

      <div className="space-y-4">
        {proposal.sections.map((section) => (
          <SectionEditor
            key={section.id}
            section={{
              id: section.id,
              title: section.title,
              content: section.content,
              sortOrder: section.sortOrder,
            }}
          />
        ))}
      </div>
    </div>
  );
}
