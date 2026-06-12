"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Level = "low" | "medium" | "high";

type Inputs = {
  value: string;
  deadline: string;
  experience: "yes" | "no";
  certifications: "yes" | "no" | "not_required";
  competition: Level;
  complexity: Level;
  availability: Level;
};

type Result = {
  score: number;
  recommendation: "Bid" | "Maybe" | "No-Bid";
  riskFactors: string[];
  nextSteps: string[];
};

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T23:59:59");
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86_400_000);
}

function score(inputs: Inputs): Result {
  const risks: string[] = [];
  let total = 0;

  // Relevant experience — the strongest predictor of a credible proposal (25 pts)
  if (inputs.experience === "yes") total += 25;
  else {
    total += 5;
    risks.push(
      "No directly relevant experience — evaluators score past performance heavily. Consider teaming with an experienced partner or starting with smaller opportunities."
    );
  }

  // Certifications / licenses (15 pts)
  if (inputs.certifications === "yes" || inputs.certifications === "not_required") total += 15;
  else
    risks.push(
      "Missing required certifications or licenses — many solicitations require them at proposal submission, not award. Verify whether you can obtain them in time."
    );

  // Competition (15 pts)
  total += inputs.competition === "low" ? 15 : inputs.competition === "medium" ? 9 : 4;
  if (inputs.competition === "high")
    risks.push(
      "High competition — expect strong incumbents or many bidders. Your proposal needs a clear discriminator to justify the effort."
    );

  // Complexity (15 pts)
  total += inputs.complexity === "low" ? 15 : inputs.complexity === "medium" ? 10 : 5;
  if (inputs.complexity === "high")
    risks.push(
      "High proposal complexity — multiple volumes, oral presentations, or detailed technical requirements multiply the hours required."
    );

  // Team availability (15 pts)
  total += inputs.availability === "high" ? 15 : inputs.availability === "medium" ? 9 : 3;
  if (inputs.availability === "low")
    risks.push(
      "Low team availability — a rushed proposal usually scores worse than no proposal. Protect your win rate."
    );

  // Time to deadline (15 pts)
  const days = daysUntil(inputs.deadline);
  if (days === null) total += 8;
  else if (days >= 21) total += 15;
  else if (days >= 10) total += 10;
  else if (days >= 3) {
    total += 5;
    risks.push(
      `Only ${days} day${days === 1 ? "" : "s"} to deadline — tight for a compliant response unless the scope is small.`
    );
  } else {
    total += 1;
    risks.push(
      days < 0
        ? "The deadline appears to have passed — verify on SAM.gov before investing any time."
        : "Less than 3 days to deadline — submitting a compliant proposal is very unlikely."
    );
  }

  const recommendation: Result["recommendation"] =
    total >= 70 ? "Bid" : total >= 45 ? "Maybe" : "No-Bid";

  const nextSteps =
    recommendation === "Bid"
      ? [
          "Build the compliance matrix first — confirm there are no disqualifying requirements",
          "Verify SAM.gov registration, set-aside eligibility, and any licenses are current",
          "Block writing time now and assign owners to each proposal section",
          "Attend the site visit / pre-proposal conference if one is scheduled",
        ]
      : recommendation === "Maybe"
        ? [
            "Extract the compliance matrix to surface dealbreaker requirements before committing",
            "Address the risk factors above — teaming can fix experience and capacity gaps",
            "Set a go/no-go checkpoint date: if risks aren't resolved by then, pass",
            "If you pass, request the award notice to study the winner for next time",
          ]
        : [
            "Pass on this one and protect your team's time — win rate matters more than bid count",
            "Save the solicitation: similar requirements will recur, often annually",
            "Fix the gaps it exposed (certifications, past performance, capacity) before the recompete",
            "Look for smaller or subcontract opportunities in the same agency to build history",
          ];

  return { score: total, recommendation, riskFactors: risks, nextSteps };
}

export function BidNoBidCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    value: "",
    deadline: "",
    experience: "yes",
    certifications: "yes",
    competition: "medium",
    complexity: "medium",
    availability: "medium",
  });
  const [result, setResult] = useState<Result | null>(null);

  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const selectClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <Card>
      <CardContent className="p-6">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setResult(score(inputs));
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="value">Estimated opportunity value ($)</Label>
            <Input
              id="value"
              type="number"
              min="0"
              placeholder="250000"
              value={inputs.value}
              onChange={(e) => set("value", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deadline">Proposal deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={inputs.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="experience">Do you have directly relevant experience?</Label>
            <select
              id="experience"
              className={selectClass}
              value={inputs.experience}
              onChange={(e) => set("experience", e.target.value as Inputs["experience"])}
            >
              <option value="yes">Yes — same or very similar scope</option>
              <option value="no">No — this would be new for us</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="certifications">Required certifications / licenses?</Label>
            <select
              id="certifications"
              className={selectClass}
              value={inputs.certifications}
              onChange={(e) => set("certifications", e.target.value as Inputs["certifications"])}
            >
              <option value="yes">We hold everything required</option>
              <option value="no">We&apos;re missing some</option>
              <option value="not_required">None required</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="competition">Expected competition level</Label>
            <select
              id="competition"
              className={selectClass}
              value={inputs.competition}
              onChange={(e) => set("competition", e.target.value as Level)}
            >
              <option value="low">Low — few capable bidders / strong set-aside fit</option>
              <option value="medium">Medium — typical competitive field</option>
              <option value="high">High — strong incumbent or many bidders</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="complexity">Proposal complexity</Label>
            <select
              id="complexity"
              className={selectClass}
              value={inputs.complexity}
              onChange={(e) => set("complexity", e.target.value as Level)}
            >
              <option value="low">Low — short quote or simple volumes</option>
              <option value="medium">Medium — standard technical + price volumes</option>
              <option value="high">High — multiple volumes, orals, detailed plans</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="availability">Team availability to write this proposal</Label>
            <select
              id="availability"
              className={selectClass}
              value={inputs.availability}
              onChange={(e) => set("availability", e.target.value as Level)}
            >
              <option value="high">High — we can dedicate real time to it</option>
              <option value="medium">Medium — we&apos;d fit it around other work</option>
              <option value="low">Low — we&apos;re already stretched</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              <Scale className="h-4 w-4" /> Calculate bid/no-bid score
            </Button>
          </div>
        </form>

        {result && (
          <div className="mt-6 rounded-lg border bg-muted/30 p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-4xl font-extrabold text-primary">
                {result.score}
                <span className="text-lg font-normal text-muted-foreground">/100</span>
              </div>
              <Badge
                variant={
                  result.recommendation === "Bid"
                    ? "accent"
                    : result.recommendation === "Maybe"
                      ? "secondary"
                      : "destructive"
                }
                className="text-sm"
              >
                {result.recommendation === "Bid"
                  ? "✓ Bid — pursue this opportunity"
                  : result.recommendation === "Maybe"
                    ? "~ Maybe — resolve the risks first"
                    : "✗ No-Bid — protect your time"}
              </Badge>
            </div>

            {result.riskFactors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold">Risk factors</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {result.riskFactors.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-sm font-semibold">Next steps</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {result.nextSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-md bg-accent/10 p-4 text-sm">
              <strong>Decided to bid?</strong> Run the RFP through the{" "}
              <Link
                href="/tools/rfp-compliance-matrix-generator"
                className="font-medium text-accent underline"
              >
                compliance matrix generator
              </Link>{" "}
              next — it surfaces dealbreaker requirements in minutes.
            </div>
          </div>
        )}

        {!result && (
          <p className="mt-4 text-xs text-muted-foreground">
            Free tool · rule-based scoring · runs entirely in your browser —
            nothing you enter here is sent to a server.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
