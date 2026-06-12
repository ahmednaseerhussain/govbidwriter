"use client";

import Link from "next/link";
import { useActionState } from "react";
import { History } from "lucide-react";
import { publicPastPerformanceAction, type PublicTextToolState } from "../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";

export function PastPerformanceTool() {
  const [state, formAction] = useActionState<PublicTextToolState, FormData>(
    publicPastPerformanceAction,
    {}
  );

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="projectName">Client / project name *</Label>
              <Input
                id="projectName"
                name="projectName"
                required
                placeholder="Office cleaning contract — Mercy Hospital"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contractValue">Contract value (optional)</Label>
              <Input id="contractValue" name="contractValue" placeholder="$180,000/year" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dates">Period of performance (optional)</Label>
              <Input id="dates" name="dates" placeholder="Jan 2023 – present" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="relevance">Relevance to the work you&apos;re bidding (optional)</Label>
              <Input
                id="relevance"
                name="relevance"
                placeholder="Same scope as the VA solicitation we're pursuing"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="scope">Scope of work *</Label>
            <Textarea
              id="scope"
              name="scope"
              required
              rows={3}
              placeholder="What did you actually do? E.g. Daily janitorial services for a 120,000 sq ft medical facility: patient areas, offices, floor care, disinfection program, 8-person crew with on-site supervisor…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="outcome">Result / outcome *</Label>
            <Textarea
              id="outcome"
              name="outcome"
              required
              rows={2}
              placeholder="E.g. 24 months with zero missed services, passed 100% of facility inspections, contract renewed twice…"
            />
          </div>

          {state.error && <Alert variant="destructive">{state.error}</Alert>}

          <SubmitButton pendingText="Writing…">
            <History className="h-4 w-4" /> Write past performance
          </SubmitButton>
        </form>

        {state.markdown && (
          <div className="mt-6 rounded-lg border bg-muted/30 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Your past performance write-up</h3>
              <CopyButton text={state.markdown} label="Copy Markdown" />
            </div>
            <Markdown content={state.markdown} />
            <div className="mt-4 rounded-md bg-accent/10 p-4 text-sm">
              <strong>Writing a full proposal?</strong> A free account stores
              your past performance in your company profile so every proposal
              section can draw on it.{" "}
              <Link href="/signup" className="font-medium text-accent underline">
                Sign up free
              </Link>
            </div>
          </div>
        )}
        {!state.markdown && (
          <p className="mt-4 text-xs text-muted-foreground">
            Free tool · no account required · commercial projects count as past
            performance too — that&apos;s exactly what this tool helps you frame.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
