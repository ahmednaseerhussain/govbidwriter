"use client";

import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import {
  generateCapabilityStatementAction,
  type CapStatementState,
} from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubmitButton } from "@/components/submit-button";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";

export function CapabilityGenerator({ hasProfile }: { hasProfile: boolean }) {
  const [state, formAction] = useActionState<CapStatementState, FormData>(
    generateCapabilityStatementAction,
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-accent" />
          Capability Statement Generator
        </CardTitle>
        <CardDescription>
          Generates a structured capability statement from your saved profile.
          Counts as 1 AI generation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasProfile && (
          <Alert variant="warning">
            Save your company profile above first — generation is grounded in it.
          </Alert>
        )}
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="targetIndustry">Target industry</Label>
              <Input
                id="targetIndustry"
                name="targetIndustry"
                placeholder="e.g. janitorial services"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetAgency">Target agency (optional)</Label>
              <Input
                id="targetAgency"
                name="targetAgency"
                placeholder="e.g. Department of Veterans Affairs"
              />
            </div>
          </div>
          <SubmitButton disabled={!hasProfile} pendingText="Generating…">
            <Sparkles className="h-4 w-4" />
            Generate capability statement
          </SubmitButton>
        </form>

        {state.error && <Alert variant="destructive">{state.error}</Alert>}

        {state.markdown && (
          <div className="rounded-lg border bg-muted/30 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Your capability statement</h3>
              <CopyButton text={state.markdown} label="Copy Markdown" />
            </div>
            <Markdown content={state.markdown} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
