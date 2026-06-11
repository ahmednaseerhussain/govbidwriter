"use client";

import { useActionState } from "react";
import { signupAction, type AuthFormState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";

export function SignupForm() {
  const [state, formAction] = useActionState<AuthFormState, FormData>(
    signupAction,
    {}
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state.error && <Alert variant="destructive">{state.error}</Alert>}
      <div className="space-y-1.5">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" autoComplete="name" placeholder="Jane Contractor" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
      </div>
      <SubmitButton className="w-full" pendingText="Creating account…">
        Create free account
      </SubmitButton>
    </form>
  );
}
