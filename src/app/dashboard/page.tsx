import Link from "next/link";
import { Building2, FileSearch, FileText, Sparkles, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getUsageSummary } from "@/lib/usage";
import { isMockMode } from "@/lib/ai/provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const [profile, rfps, proposals, usage] = await Promise.all([
    db.companyProfile.findUnique({ where: { userId: user.id } }),
    db.rfpDocument.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.proposal.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    getUsageSummary(user.id),
  ]);

  const steps = [
    {
      done: Boolean(profile?.companyName),
      label: "Complete your company profile",
      href: "/dashboard/company-profile",
    },
    {
      done: rfps.length > 0,
      label: "Upload or paste your first RFP",
      href: "/dashboard/rfps/new",
    },
    {
      done: proposals.length > 0,
      label: "Generate a proposal draft",
      href: rfps.length > 0 ? `/dashboard/rfps/${rfps[0].id}` : "/dashboard/rfps/new",
    },
  ];
  const nextStep = steps.find((s) => !s.done);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            {usage.plan.name} plan · {usage.generations.used}/
            {Number.isFinite(usage.generations.limit) ? usage.generations.limit : "∞"}{" "}
            AI generations used this month
          </p>
        </div>
        <Link href="/dashboard/rfps/new">
          <Button>
            <FileSearch className="h-4 w-4" />
            New RFP
          </Button>
        </Link>
      </div>

      {isMockMode() && (
        <Alert variant="info">
          <strong>Demo mode:</strong> DEEPSEEK_API_KEY is not set, so AI features
          return realistic sample output. Add your key to .env to enable real
          generation.
        </Alert>
      )}

      {nextStep && (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent" />
              <span className="font-medium">Next step: {nextStep.label}</span>
            </div>
            <Link href={nextStep.href}>
              <Button size="sm" variant="accent">
                Go <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Company profile
            </CardDescription>
            <CardTitle className="text-xl">
              {profile?.companyName ? "Complete" : "Not set up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/company-profile"
              className="text-sm text-primary hover:underline"
            >
              {profile?.companyName ? "Edit profile" : "Set up now"} →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" /> RFPs analyzed
            </CardDescription>
            <CardTitle className="text-xl">{rfps.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/rfps" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Proposals
            </CardDescription>
            <CardTitle className="text-xl">{proposals.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/proposals" className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent RFPs</CardTitle>
          </CardHeader>
          <CardContent>
            {rfps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No RFPs yet.{" "}
                <Link href="/dashboard/rfps/new" className="text-primary hover:underline">
                  Upload your first one
                </Link>{" "}
                to get a compliance matrix in minutes.
              </p>
            ) : (
              <ul className="divide-y">
                {rfps.map((rfp) => (
                  <li key={rfp.id} className="flex items-center justify-between py-2">
                    <Link
                      href={`/dashboard/rfps/${rfp.id}`}
                      className="truncate text-sm font-medium hover:text-primary"
                    >
                      {rfp.title}
                    </Link>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                      {formatDate(rfp.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {proposals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Proposals you generate from analyzed RFPs will appear here.
              </p>
            ) : (
              <ul className="divide-y">
                {proposals.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2">
                    <Link
                      href={`/dashboard/proposals/${p.id}`}
                      className="truncate text-sm font-medium hover:text-primary"
                    >
                      {p.title}
                    </Link>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {p.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
