"use client";

import { useActionState } from "react";
import { upgradeAction, downgradeAction, type BillingState } from "./actions";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";

export function BillingActions({ isPro }: { isPro: boolean }) {
  const [upState, upAction] = useActionState<BillingState, FormData>(
    upgradeAction,
    {}
  );
  const [downState, downAction] = useActionState<BillingState, FormData>(
    downgradeAction,
    {}
  );

  const state = isPro ? downState : upState;

  return (
    <div className="space-y-3">
      {state.error && <Alert variant="destructive">{state.error}</Alert>}
      {state.success && <Alert variant="success">{state.success}</Alert>}

      {isPro ? (
        <form action={downAction}>
          <SubmitButton variant="outline" pendingText="Canceling…">
            Cancel Pro subscription
          </SubmitButton>
        </form>
      ) : (
        <form action={upAction}>
          <SubmitButton pendingText="Upgrading…">
            Upgrade to Pro — $79/month
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
