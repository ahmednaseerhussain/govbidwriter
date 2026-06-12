"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ClipboardCheck, FileText, ListOrdered, CalendarClock, ShieldCheck } from "lucide-react";
import { publicChecklistAction, type PublicChecklistState } from "../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";

export function ChecklistTool() {
  const [state, formAction] = useActionState<PublicChecklistState, FormData>(
    publicChecklistAction,
    {}
  );

  const sections = state.result
    ? [
        {
          icon: FileText,
          title: "Required documents detected",
          items: state.result.requiredDocuments,
        },
        {
          icon: ListOrdered,
          title: "Submission steps",
          items: state.result.submissionSteps,
        },
        ...(state.result.deadlines.length > 0
          ? [
              {
                icon: CalendarClock,
                title: "Deadline mentions found in the text",
                items: state.result.deadlines,
              },
            ]
          : []),
        {
          icon: ShieldCheck,
          title: "Final compliance checks",
          items: state.result.complianceChecks,
        },
      ]
    : [];

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
              placeholder="Paste the solicitation text — the instructions section (Section L or 'Instructions to Offerors') gives the best results."
            />
          </div>

          {state.error && <Alert variant="destructive">{state.error}</Alert>}

          <SubmitButton pendingText="Building checklist…">
            <ClipboardCheck className="h-4 w-4" /> Generate checklist
          </SubmitButton>
        </form>

        {state.result && (
          <div className="mt-6 space-y-5">
            {sections.map((section) => (
              <div key={section.title} className="rounded-lg border p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <section.icon className="h-4 w-4 text-accent" />
                  {section.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--accent))]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Alert variant="info">
              This checklist is keyword-detected from the text you pasted — a
              fast first pass, not a compliance guarantee. Verify every item
              against the official solicitation and its amendments.
            </Alert>

            <div className="rounded-md bg-accent/10 p-4 text-sm">
              <strong>Want requirement-level detail?</strong> The{" "}
              <Link
                href="/tools/rfp-compliance-matrix-generator"
                className="font-medium text-accent underline"
              >
                compliance matrix generator
              </Link>{" "}
              extracts every individual &quot;shall&quot; statement — and a free account
              tracks each one to done.{" "}
              <Link href="/signup" className="font-medium text-accent underline">
                Sign up free
              </Link>
            </div>
          </div>
        )}

        {!state.result && (
          <p className="mt-4 text-xs text-muted-foreground">
            Free tool · no account required · rule-based document detection —
            works without AI and never invents requirements.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
