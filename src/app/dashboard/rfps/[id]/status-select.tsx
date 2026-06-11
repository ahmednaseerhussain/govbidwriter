"use client";

import { useTransition } from "react";
import { updateRequirementStatusAction } from "../actions";
import { cn } from "@/lib/utils";

const options = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "complete", label: "Complete" },
];

export function StatusSelect({
  requirementId,
  status,
}: {
  requirementId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const value = e.target.value;
        startTransition(() => updateRequirementStatusAction(requirementId, value));
      }}
      className={cn(
        "h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        pending && "opacity-50"
      )}
      aria-label="Requirement status"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
