"use client";

import { useActionState } from "react";
import { updateAccountAction, type SettingsState } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";

export function SettingsForm({
  defaultName,
  email,
}: {
  defaultName: string;
  email: string;
}) {
  const [state, formAction] = useActionState<SettingsState, FormData>(
    updateAccountAction,
    {}
  );

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && <Alert variant="destructive">{state.error}</Alert>}
          {state.saved && <Alert variant="success">Settings saved.</Alert>}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
            <p className="text-xs text-muted-foreground">
              Email changes aren&apos;t supported yet.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={defaultName} />
          </div>
          <SubmitButton pendingText="Saving…">Save</SubmitButton>
        </CardContent>
      </Card>
    </form>
  );
}
