"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";
import type { ButtonProps } from "@/components/ui/button";

type ActionState = { error?: string };

/**
 * Generic one-click server-action button with pending + error states.
 * Pass the server action plus any hidden fields it needs.
 */
export function ActionButton({
  action,
  fields,
  label,
  pendingText,
  variant = "default",
  size = "default",
  icon,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  fields: Record<string, string>;
  label: React.ReactNode;
  pendingText: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  icon?: React.ReactNode;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  return (
    <div className="space-y-2">
      <form action={formAction}>
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <SubmitButton variant={variant} size={size} pendingText={pendingText}>
          {icon}
          {label}
        </SubmitButton>
      </form>
      {state.error && <Alert variant="destructive">{state.error}</Alert>}
    </div>
  );
}
