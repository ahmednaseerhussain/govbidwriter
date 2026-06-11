import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getUsageSummary } from "@/lib/usage";
import { Alert } from "@/components/ui/alert";
import { RfpUploadForm } from "./upload-form";

export const metadata: Metadata = { title: "New RFP" };

export default async function NewRfpPage() {
  const user = await requireUser();
  const usage = await getUsageSummary(user.id);
  const remaining = Number.isFinite(usage.uploads.limit)
    ? usage.uploads.limit - usage.uploads.used
    : Infinity;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New RFP</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload the solicitation PDF, or paste the text if you have a scanned
          document or just a section of it.
        </p>
      </div>

      {remaining <= 0 ? (
        <Alert variant="warning">
          You&apos;ve used your {usage.uploads.limit} RFP upload
          {usage.uploads.limit === 1 ? "" : "s"} for this month on the{" "}
          {usage.plan.name} plan. Upgrade to Pro for 20 uploads per month.
        </Alert>
      ) : (
        Number.isFinite(usage.uploads.limit) && (
          <p className="text-sm text-muted-foreground">
            {remaining} of {usage.uploads.limit} uploads remaining this month.
          </p>
        )
      )}

      <RfpUploadForm />
    </div>
  );
}
