"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FileText } from "lucide-react";
import { publicExecutiveSummaryAction, type PublicTextToolState } from "../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";

export function ExecutiveSummaryTool() {
  const [state, formAction] = useActionState<PublicTextToolState, FormData>(
    publicExecutiveSummaryAction,
    {}
  );

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company name (optional)</Label>
              <Input id="companyName" name="companyName" placeholder="Acme Federal Services LLC" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="agency">Issuing agency (optional)</Label>
              <Input id="agency" name="agency" placeholder="Department of Veterans Affairs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rfpSummary">What does the RFP ask for? *</Label>
            <Textarea
              id="rfpSummary"
              name="rfpSummary"
              required
              rows={4}
              placeholder="Summarize the solicitation in your own words: scope, place of performance, contract length, anything emphasized in the evaluation criteria…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="strengths">Your company&apos;s key strengths *</Label>
            <Textarea
              id="strengths"
              name="strengths"
              required
              rows={4}
              placeholder="Relevant experience, certifications, key personnel, anything that makes you the lower-risk choice. One point per line works well…"
            />
          </div>

          {state.error && <Alert variant="destructive">{state.error}</Alert>}

          <SubmitButton pendingText="Drafting…">
            <FileText className="h-4 w-4" /> Generate executive summary
          </SubmitButton>
        </form>

        {state.markdown && (
          <div className="mt-6 rounded-lg border bg-muted/30 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Your executive summary draft</h3>
              <CopyButton text={state.markdown} label="Copy Markdown" />
            </div>
            <Markdown content={state.markdown} />
            <div className="mt-4 rounded-md bg-accent/10 p-4 text-sm">
              <strong>This is one section of eleven.</strong> Create a free
              account, upload the actual RFP, and GovBidWriter drafts the full
              proposal — grounded in the real requirements, not a summary.{" "}
              <Link href="/signup" className="font-medium text-accent underline">
                Create the full proposal
              </Link>
            </div>
          </div>
        )}
        {!state.markdown && (
          <p className="mt-4 text-xs text-muted-foreground">
            Free tool · no account required · output is an AI-assisted draft —
            verify every statement against the official solicitation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
