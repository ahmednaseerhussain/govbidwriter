import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ListChecks, FileText, Download, Lock } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { getUserPlan } from "@/lib/usage";
import {
  analyzeRfpAction,
  extractRequirementsAction,
  createProposalAction,
} from "../actions";
import { ActionButton } from "@/components/dashboard/action-button";
import { StatusSelect } from "./status-select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, levelBadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "RFP" };

export default async function RfpDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const rfp = await db.rfpDocument.findFirst({
    where: { id, userId: user.id },
    include: {
      analysis: true,
      requirements: { orderBy: { sortOrder: "asc" } },
      proposals: { select: { id: true, title: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!rfp) notFound();

  const plan = await getUserPlan(user.id);
  const matrixLimit = plan.limits.complianceMatrixRows;
  const visibleRequirements = Number.isFinite(matrixLimit)
    ? rfp.requirements.slice(0, matrixLimit)
    : rfp.requirements;
  const hiddenCount = rfp.requirements.length - visibleRequirements.length;

  const analysis = rfp.analysis;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-muted-foreground">
          <Link href="/dashboard/rfps" className="hover:underline">RFPs</Link> / {rfp.title}
        </div>
        <h1 className="mt-1 text-2xl font-bold">{rfp.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {rfp.sourceType === "pdf" ? `PDF: ${rfp.fileName}` : "Pasted text"} ·{" "}
          {rfp.textLength.toLocaleString()} characters · added {formatDate(rfp.createdAt)}
        </p>
      </div>

      {/* Step 1: Analysis */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-accent" /> RFP Analysis
              </CardTitle>
              <CardDescription>
                Key facts, submission instructions, and evaluation criteria.
              </CardDescription>
            </div>
            <ActionButton
              action={analyzeRfpAction}
              fields={{ rfpId: rfp.id }}
              label={analysis ? "Re-analyze" : "Analyze RFP"}
              pendingText="Analyzing…"
              variant={analysis ? "outline" : "default"}
              size="sm"
            />
          </div>
        </CardHeader>
        {analysis && (
          <CardContent className="space-y-5">
            <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">Agency</div>
                <div className="mt-1">{analysis.agency || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">Solicitation #</div>
                <div className="mt-1">{analysis.solicitationNumber || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">Deadline</div>
                <div className="mt-1 font-medium text-destructive">{analysis.deadline || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">Set-aside</div>
                <div className="mt-1">{analysis.setAside || "—"}</div>
              </div>
            </div>

            {parseStringArray(analysis.naicsCodes).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">NAICS</span>
                {parseStringArray(analysis.naicsCodes).map((code) => (
                  <Badge key={code} variant="secondary">{code}</Badge>
                ))}
              </div>
            )}

            {analysis.summary && (
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">Summary</div>
                <p className="mt-1 text-sm leading-relaxed">{analysis.summary}</p>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {(
                [
                  ["Submission instructions", analysis.submissionInstructions],
                  ["Evaluation criteria", analysis.evaluationCriteria],
                  ["Required documents", analysis.requiredDocuments],
                  ["Risks", analysis.risks],
                ] as const
              ).map(([label, json]) => {
                const items = parseStringArray(json);
                if (items.length === 0) return null;
                return (
                  <div key={label}>
                    <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                      {items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Step 2: Compliance matrix */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4 text-accent" /> Compliance Matrix
              </CardTitle>
              <CardDescription>
                Every requirement extracted from the document, tracked to completion.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {rfp.requirements.length > 0 && plan.limits.exportsEnabled && (
                <a href={`/api/export/matrix/${rfp.id}`}>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" /> CSV
                  </Button>
                </a>
              )}
              <ActionButton
                action={extractRequirementsAction}
                fields={{ rfpId: rfp.id }}
                label={rfp.requirements.length > 0 ? "Re-extract" : "Extract requirements"}
                pendingText="Extracting…"
                variant={rfp.requirements.length > 0 ? "outline" : "default"}
                size="sm"
              />
            </div>
          </div>
        </CardHeader>
        {rfp.requirements.length > 0 && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead className="min-w-[260px]">Requirement</TableHead>
                  <TableHead className="min-w-[200px]">Response Needed</TableHead>
                  <TableHead>Required Document</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRequirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="whitespace-nowrap font-mono text-xs">{req.reqId}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{req.section || "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{req.pageReference || "—"}</TableCell>
                    <TableCell className="text-sm">{req.requirementText}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{req.responseNeeded || "—"}</TableCell>
                    <TableCell className="text-sm">{req.requiredDocument || "—"}</TableCell>
                    <TableCell><Badge variant={levelBadgeVariant(req.priority)}>{req.priority}</Badge></TableCell>
                    <TableCell><Badge variant={levelBadgeVariant(req.riskLevel)}>{req.riskLevel}</Badge></TableCell>
                    <TableCell>
                      <StatusSelect requirementId={req.id} status={req.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {hiddenCount > 0 && (
              <Alert variant="info" className="mt-4">
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {hiddenCount} more requirement{hiddenCount === 1 ? "" : "s"} found.{" "}
                  <Link href="/dashboard/billing" className="font-medium underline">
                    Upgrade to Pro
                  </Link>{" "}
                  to see the full matrix and export it.
                </span>
              </Alert>
            )}
          </CardContent>
        )}
      </Card>

      {/* Step 3: Proposal */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-accent" /> Proposal
              </CardTitle>
              <CardDescription>
                Create a structured 11-section proposal draft for this RFP.
              </CardDescription>
            </div>
            <ActionButton
              action={createProposalAction}
              fields={{ rfpId: rfp.id }}
              label="Create proposal draft"
              pendingText="Creating…"
              size="sm"
            />
          </div>
        </CardHeader>
        {rfp.proposals.length > 0 && (
          <CardContent>
            <ul className="divide-y">
              {rfp.proposals.map((p) => (
                <li key={p.id} className="py-2">
                  <Link
                    href={`/dashboard/proposals/${p.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
