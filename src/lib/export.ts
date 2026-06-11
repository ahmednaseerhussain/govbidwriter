import type { CapabilityStatement } from "@/lib/ai/schemas";
import { DISCLAIMER } from "@/lib/utils";

export function capabilityStatementToMarkdown(
  cs: CapabilityStatement,
  companyName: string
): string {
  return [
    `# Capability Statement — ${companyName}`,
    ``,
    `## Company Overview`,
    cs.companyOverview,
    ``,
    `## Core Competencies`,
    ...cs.coreCompetencies.map((c) => `- ${c}`),
    ``,
    `## Differentiators`,
    ...cs.differentiators.map((d) => `- ${d}`),
    ``,
    `## Past Performance`,
    ...cs.pastPerformance.map((p) => `- ${p}`),
    ``,
    `## NAICS Codes`,
    cs.naicsCodes.length ? cs.naicsCodes.join(", ") : "—",
    ``,
    `## Contact`,
    cs.contactBlock,
    ``,
    `---`,
    `*${DISCLAIMER}*`,
  ].join("\n");
}

function csvEscape(value: string): string {
  const v = value ?? "";
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export type MatrixRow = {
  reqId: string;
  section: string | null;
  pageReference: string | null;
  requirementText: string;
  responseNeeded: string | null;
  requiredDocument: string | null;
  priority: string;
  riskLevel: string;
  status: string;
};

export function requirementsToCsv(rows: MatrixRow[]): string {
  const header = [
    "Requirement ID",
    "RFP Section",
    "Page Reference",
    "Requirement",
    "Response Needed",
    "Required Document",
    "Priority",
    "Risk",
    "Status",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.reqId,
        r.section ?? "",
        r.pageReference ?? "",
        r.requirementText,
        r.responseNeeded ?? "",
        r.requiredDocument ?? "",
        r.priority,
        r.riskLevel,
        r.status,
      ]
        .map(csvEscape)
        .join(",")
    );
  }
  return lines.join("\r\n");
}

export function proposalToMarkdown(
  title: string,
  sections: { title: string; content: string }[]
): string {
  const parts = [`# ${title}`, ""];
  for (const s of sections) {
    const body = s.content.trim();
    // Sections already start with "## Heading" when AI-generated; add one if missing.
    if (body.startsWith("#")) {
      parts.push(body, "");
    } else {
      parts.push(`## ${s.title}`, "", body || "_(not yet drafted)_", "");
    }
  }
  parts.push("---", `*${DISCLAIMER}*`);
  return parts.join("\n");
}
