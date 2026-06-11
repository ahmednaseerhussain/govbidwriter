"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ListChecks } from "lucide-react";
import {
  publicComplianceMatrixAction,
  type PublicMatrixState,
} from "../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Badge, levelBadgeVariant } from "@/components/ui/badge";
import { SubmitButton } from "@/components/submit-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MatrixTool() {
  const [state, formAction] = useActionState<PublicMatrixState, FormData>(
    publicComplianceMatrixAction,
    {}
  );

  const hiddenCount =
    state.totalFound && state.requirements
      ? state.totalFound - state.requirements.length
      : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="text">RFP text</Label>
            <Textarea
              id="text"
              name="text"
              rows={10}
              required
              placeholder="Paste the solicitation text here — Sections L and M and the statement of work give the best results."
            />
          </div>

          {state.error && <Alert variant="destructive">{state.error}</Alert>}

          <SubmitButton pendingText="Extracting requirements…">
            <ListChecks className="h-4 w-4" /> Generate compliance matrix
          </SubmitButton>
        </form>

        {state.requirements && (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold">
              Compliance matrix preview
              {state.totalFound ? ` — ${state.totalFound} requirements found` : ""}
            </h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead className="min-w-[240px]">Requirement</TableHead>
                    <TableHead className="min-w-[180px]">Response Needed</TableHead>
                    <TableHead>Required Document</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.requirements.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{req.id}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs">{req.section || "—"}</TableCell>
                      <TableCell className="text-sm">{req.requirementText}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{req.responseNeeded || "—"}</TableCell>
                      <TableCell className="text-sm">{req.requiredDocument || "—"}</TableCell>
                      <TableCell><Badge variant={levelBadgeVariant(req.priority)}>{req.priority}</Badge></TableCell>
                      <TableCell><Badge variant={levelBadgeVariant(req.riskLevel)}>{req.riskLevel}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 rounded-md bg-accent/10 p-4 text-sm">
              {hiddenCount > 0 ? (
                <>
                  <strong>{hiddenCount} more requirements</strong> were found.
                  Create a free account to see the full matrix, track status,
                  and turn it into a proposal draft.{" "}
                </>
              ) : (
                <>
                  <strong>Save this matrix?</strong> Create a free account to
                  store it, track requirement status, and generate a proposal
                  draft.{" "}
                </>
              )}
              <Link href="/signup" className="font-medium text-accent underline">
                Sign up free
              </Link>
            </div>
          </div>
        )}

        {!state.requirements && (
          <p className="mt-4 text-xs text-muted-foreground">
            Free tool · no account required · with an account you can upload
            PDFs directly and save your matrices.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
