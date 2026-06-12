import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getUsageSummary } from "@/lib/usage";
import { isStripeConfigured, isMockBillingAllowed } from "@/lib/billing/stripe";
import { PLANS } from "@/lib/billing/plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { BillingActions } from "./billing-actions";

export const metadata: Metadata = { title: "Billing" };

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Number.isFinite(limit) && limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function BillingPage() {
  const user = await requireUser();
  const usage = await getUsageSummary(user.id);
  const isPro = usage.plan.id === "pro";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan and see this month&apos;s usage.
        </p>
      </div>

      {!isStripeConfigured() &&
        (isMockBillingAllowed() ? (
          <Alert variant="info">
            <strong>Mock billing mode:</strong> Stripe keys are not configured.
            Plan changes apply instantly to your local account with no charge —
            ideal for testing the full Pro experience.
          </Alert>
        ) : (
          <Alert variant="info">
            <strong>Billing is in setup mode:</strong> paid checkout isn&apos;t
            enabled yet. Everything you create is saved to your account, and
            you&apos;ll be able to upgrade as soon as billing goes live.
          </Alert>
        ))}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current plan</CardTitle>
            <Badge variant={isPro ? "accent" : "secondary"}>
              {usage.plan.name}
            </Badge>
          </div>
          <CardDescription>{usage.plan.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>AI generations</span>
                <span className="text-muted-foreground">
                  {usage.generations.used}/
                  {Number.isFinite(usage.generations.limit)
                    ? usage.generations.limit
                    : "∞"}
                </span>
              </div>
              <UsageBar used={usage.generations.used} limit={usage.generations.limit} />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>RFP uploads</span>
                <span className="text-muted-foreground">
                  {usage.uploads.used}/
                  {Number.isFinite(usage.uploads.limit) ? usage.uploads.limit : "∞"}
                </span>
              </div>
              <UsageBar used={usage.uploads.used} limit={usage.uploads.limit} />
            </div>
          </div>

          <BillingActions isPro={isPro} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.values(PLANS).map((plan) => (
          <Card key={plan.id} className={plan.id === usage.plan.id ? "border-accent" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                {plan.id === usage.plan.id && <Badge variant="accent">Current</Badge>}
              </div>
              <div className="text-2xl font-bold">
                ${plan.priceMonthly}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
