"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import {
  publicCapabilityStatementAction,
  type PublicCapStatementState,
} from "../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";

export function CapStatementTool() {
  const [state, formAction] = useActionState<PublicCapStatementState, FormData>(
    publicCapabilityStatementAction,
    {}
  );

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Company name *</Label>
              <Input id="companyName" name="companyName" required placeholder="Acme Federal Services LLC" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetIndustry">Target industry</Label>
              <Input id="targetIndustry" name="targetIndustry" placeholder="e.g. IT services, janitorial" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="naicsCodes">NAICS codes</Label>
              <Input id="naicsCodes" name="naicsCodes" placeholder="541511, 541512" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="certifications">Certifications</Label>
              <Input id="certifications" name="certifications" placeholder="8(a), WOSB, HUBZone" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Contact email</Label>
              <Input id="email" name="email" type="email" placeholder="you@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="(555) 555-0100" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="services">What services do you provide? *</Label>
            <Textarea
              id="services"
              name="services"
              required
              rows={3}
              placeholder="e.g. Commercial janitorial services for offices and medical facilities: daily cleaning, floor care, disinfection programs…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pastPerformance">Past performance (optional)</Label>
            <Textarea
              id="pastPerformance"
              name="pastPerformance"
              rows={2}
              placeholder="One project per line with scope and outcome."
            />
          </div>

          {state.error && <Alert variant="destructive">{state.error}</Alert>}

          <SubmitButton pendingText="Generating…">
            <Sparkles className="h-4 w-4" /> Generate capability statement
          </SubmitButton>
        </form>

        {state.markdown && (
          <div className="mt-6 rounded-lg border bg-muted/30 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Your capability statement</h3>
              <CopyButton text={state.markdown} label="Copy Markdown" />
            </div>
            <Markdown content={state.markdown} />
            <div className="mt-4 rounded-md bg-accent/10 p-4 text-sm">
              <strong>Want to reuse this?</strong> Create a free account to save
              your company profile and regenerate per target agency.{" "}
              <Link href="/signup" className="font-medium text-accent underline">
                Sign up free
              </Link>
            </div>
          </div>
        )}
        {!state.markdown && (
          <p className="mt-4 text-xs text-muted-foreground">
            Free tool · no account required ·{" "}
            <Link href="/signup" className="underline">
              create an account
            </Link>{" "}
            to save a full company profile and get higher limits.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ToolSignupCta() {
  return (
    <Link href="/signup">
      <Button variant="accent">Sign up free</Button>
    </Link>
  );
}
