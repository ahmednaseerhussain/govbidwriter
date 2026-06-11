import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { isMockMode } from "@/lib/ai/provider";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account.</p>
      </div>

      <SettingsForm defaultName={user.name ?? ""} email={user.email} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integrations</CardTitle>
          <CardDescription>
            Service status for this deployment. Configure keys in your
            environment (.env) to switch from mock to live mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span>AI provider (Fable 5)</span>
              <Badge variant={isMockMode() ? "warning" : "success"}>
                {isMockMode() ? "Mock mode" : "Live"}
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>Stripe billing</span>
              <Badge variant={isStripeConfigured() ? "success" : "warning"}>
                {isStripeConfigured() ? "Live" : "Mock mode"}
              </Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>SAM.gov opportunity search</span>
              <Badge variant="secondary">Coming soon</Badge>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
