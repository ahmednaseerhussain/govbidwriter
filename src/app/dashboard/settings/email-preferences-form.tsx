"use client";

import { useActionState } from "react";
import { updateEmailPreferencesAction, type SettingsState } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";

const prefs = [
  {
    key: "productUpdates",
    label: "Workflow updates",
    description: "When analyses, matrices, and proposal drafts are ready — plus practical guides.",
  },
  {
    key: "deadlineReminders",
    label: "Deadline reminders",
    description: "An alert a few days before an analyzed RFP's submission deadline.",
  },
  {
    key: "usageAlerts",
    label: "Usage alerts",
    description: "When you approach or reach your monthly plan limits.",
  },
  {
    key: "opportunityAlerts",
    label: "Opportunity alerts",
    description: "New opportunities matching your saved searches.",
  },
  {
    key: "marketingEmails",
    label: "Product news & offers",
    description: "Occasional feature announcements and plan offers.",
  },
] as const;

export function EmailPreferencesForm({
  defaults,
}: {
  defaults: Record<string, boolean>;
}) {
  const [state, formAction] = useActionState<SettingsState, FormData>(
    updateEmailPreferencesAction,
    {}
  );

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email notifications</CardTitle>
          <CardDescription>
            Account and billing emails are always sent. Everything else is up
            to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && <Alert variant="destructive">{state.error}</Alert>}
          {state.saved && <Alert variant="success">Preferences saved.</Alert>}

          <div className="space-y-3">
            {prefs.map((pref) => (
              <label
                key={pref.key}
                className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40"
              >
                <input
                  type="checkbox"
                  name={pref.key}
                  defaultChecked={defaults[pref.key] ?? true}
                  className="mt-0.5 h-4 w-4 accent-[hsl(var(--accent))]"
                />
                <span>
                  <span className="block text-sm font-medium">{pref.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {pref.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <SubmitButton pendingText="Saving…">Save preferences</SubmitButton>
        </CardContent>
      </Card>
    </form>
  );
}
