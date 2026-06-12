"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

type Answers = {
  isSmall: "yes" | "no" | "unsure";
  womanOwned: boolean;
  veteranOwned: boolean;
  serviceDisabled: boolean;
  disadvantaged: boolean;
  hubzoneLocation: boolean;
  hubzoneEmployees: boolean;
};

type Program = {
  name: string;
  status: "likely" | "possible";
  detail: string;
  verify: string;
};

function evaluate(a: Answers): { programs: Program[]; smallBlocked: boolean } {
  if (a.isSmall === "no") return { programs: [], smallBlocked: true };

  const programs: Program[] = [];
  const qualifier = a.isSmall === "unsure" ? "possible" : "likely";

  programs.push({
    name: "Small Business Set-Asides",
    status: qualifier as Program["status"],
    detail:
      "Federal contracts between $10K and $250K are automatically reserved for small businesses, and agencies set aside many larger ones. This is the broadest program — no special certification beyond SAM.gov self-certification.",
    verify:
      "Check your NAICS code's size standard (revenue or employee based) at sba.gov/size-standards.",
  });

  if (a.womanOwned)
    programs.push({
      name: "WOSB / EDWOSB (Woman-Owned Small Business)",
      status: qualifier as Program["status"],
      detail:
        "For businesses at least 51% owned and controlled by women. WOSB set-asides apply in industries where women are underrepresented; EDWOSB adds an economic disadvantage requirement and unlocks more set-asides.",
      verify: "Certify (free) through the SBA at wosb.certify.sba.gov.",
    });

  if (a.serviceDisabled)
    programs.push({
      name: "SDVOSB (Service-Disabled Veteran-Owned)",
      status: qualifier as Program["status"],
      detail:
        "For businesses at least 51% owned and controlled by one or more service-disabled veterans. The VA in particular sets aside a large share of its contracts for SDVOSBs ('Vets First').",
      verify: "Certification is through SBA VetCert at veterans.certify.sba.gov.",
    });
  else if (a.veteranOwned)
    programs.push({
      name: "VOSB (Veteran-Owned Small Business)",
      status: qualifier as Program["status"],
      detail:
        "For businesses at least 51% owned and controlled by veterans. VOSB set-asides are most significant at the VA; some states run parallel veteran preference programs.",
      verify: "Certification is through SBA VetCert at veterans.certify.sba.gov.",
    });

  if (a.disadvantaged)
    programs.push({
      name: "8(a) Business Development Program",
      status: "possible",
      detail:
        "A 9-year program for small businesses at least 51% owned by socially and economically disadvantaged individuals (personal net worth under $850K excluding home/business). 8(a) firms can receive sole-source awards up to $4.5M ($7M manufacturing) — the most powerful set-aside that exists.",
      verify:
        "Eligibility is fact-specific (net worth, assets, income tests). Review criteria at sba.gov/8a and apply via certify.sba.gov.",
    });

  if (a.hubzoneLocation)
    programs.push({
      name: "HUBZone Program",
      status: a.hubzoneEmployees ? (qualifier as Program["status"]) : "possible",
      detail:
        "For small businesses with a principal office in a Historically Underutilized Business Zone AND at least 35% of employees living in a HUBZone. The government has a 3% HUBZone contracting goal, and HUBZone firms get a 10% price preference in full-and-open competition.",
      verify: a.hubzoneEmployees
        ? "Confirm your address on the official map at maps.certify.sba.gov, then apply via certify.sba.gov."
        : "You'll also need 35% of employees residing in a HUBZone — check the map at maps.certify.sba.gov.",
    });

  return { programs, smallBlocked: false };
}

export function SetAsideChecker() {
  const [answers, setAnswers] = useState<Answers>({
    isSmall: "yes",
    womanOwned: false,
    veteranOwned: false,
    serviceDisabled: false,
    disadvantaged: false,
    hubzoneLocation: false,
    hubzoneEmployees: false,
  });
  const [result, setResult] = useState<ReturnType<typeof evaluate> | null>(null);

  const checkboxRow = (
    key: keyof Omit<Answers, "isSmall">,
    label: string,
    hint?: string
  ) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-[hsl(var(--accent))]"
        checked={answers[key]}
        onChange={(e) => setAnswers((p) => ({ ...p, [key]: e.target.checked }))}
      />
      <span className="text-sm">
        {label}
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setResult(evaluate(answers));
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="isSmall">
              Is your business &quot;small&quot; under your NAICS code&apos;s SBA size standard?
            </Label>
            <select
              id="isSmall"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={answers.isSmall}
              onChange={(e) =>
                setAnswers((p) => ({ ...p, isSmall: e.target.value as Answers["isSmall"] }))
              }
            >
              <option value="yes">Yes — under the revenue/employee threshold</option>
              <option value="unsure">Not sure</option>
              <option value="no">No — we exceed the size standard</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Size standards vary by NAICS code (e.g. $9.5M for landscaping, $34M for IT
              services). Find yours with the{" "}
              <Link href="/tools/naics-code-finder" className="text-primary underline">
                NAICS finder
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {checkboxRow("womanOwned", "At least 51% owned and controlled by women")}
            {checkboxRow("veteranOwned", "At least 51% owned and controlled by veterans")}
            {checkboxRow(
              "serviceDisabled",
              "Majority owner is a service-disabled veteran",
              "VA disability rating, any percentage"
            )}
            {checkboxRow(
              "disadvantaged",
              "Majority owner is socially and economically disadvantaged",
              "Basis for the 8(a) program — includes personal net worth limits"
            )}
            {checkboxRow(
              "hubzoneLocation",
              "Principal office is located in a HUBZone",
              "Check the map at maps.certify.sba.gov"
            )}
            {checkboxRow(
              "hubzoneEmployees",
              "At least 35% of employees live in a HUBZone"
            )}
          </div>

          <Button type="submit">
            <ShieldCheck className="h-4 w-4" /> Check eligibility
          </Button>
        </form>

        {result && (
          <div className="mt-6">
            {result.smallBlocked ? (
              <Alert variant="info">
                Set-aside programs require qualifying as a small business under
                your NAICS code&apos;s size standard. Businesses over the threshold
                compete on unrestricted contracts — or can team as a
                subcontractor with small primes on set-aside work.
              </Alert>
            ) : (
              <>
                <h3 className="font-semibold">
                  You may be eligible for {result.programs.length} program
                  {result.programs.length === 1 ? "" : "s"}
                </h3>
                <div className="mt-3 space-y-3">
                  {result.programs.map((p) => (
                    <div key={p.name} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold">{p.name}</h4>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.status === "likely"
                              ? "bg-accent/15 text-accent"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.status === "likely" ? "Likely eligible" : "Possibly eligible"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">{p.detail}</p>
                      <p className="mt-1.5 text-xs font-medium text-foreground">
                        How to verify: <span className="font-normal text-muted-foreground">{p.verify}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <Alert variant="info" className="mt-4">
                  <strong>This is an informational screening, not a determination.</strong>{" "}
                  Eligibility rules have detailed requirements (ownership structure,
                  control, net worth, citizenship). Verify with the SBA at
                  certify.sba.gov and ensure your SAM.gov representations match
                  before bidding set-aside work — misrepresentation carries severe
                  penalties.
                </Alert>
              </>
            )}
          </div>
        )}

        {!result && (
          <p className="mt-4 text-xs text-muted-foreground">
            Free tool · runs entirely in your browser — nothing you select is
            sent to a server.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
