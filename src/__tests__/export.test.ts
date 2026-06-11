import { describe, it, expect } from "vitest";
import {
  requirementsToCsv,
  proposalToMarkdown,
  capabilityStatementToMarkdown,
} from "@/lib/export";

describe("requirementsToCsv", () => {
  it("escapes commas, quotes, and newlines", () => {
    const csv = requirementsToCsv([
      {
        reqId: "R-001",
        section: "L.3",
        pageReference: "p. 1",
        requirementText: 'Offeror "shall" submit, on time\nno exceptions',
        responseNeeded: null,
        requiredDocument: null,
        priority: "high",
        riskLevel: "low",
        status: "not_started",
      },
    ]);
    const lines = csv.split("\r\n");
    expect(lines[0]).toContain("Requirement ID");
    expect(lines[1]).toContain('"Offeror ""shall"" submit, on time\nno exceptions"'.split("\n")[0]);
    // 9 columns in header
    expect(lines[0].split(",")).toHaveLength(9);
  });
});

describe("proposalToMarkdown", () => {
  it("includes title, all sections, and the disclaimer", () => {
    const md = proposalToMarkdown("Test Proposal", [
      { title: "Cover Letter", content: "## Cover Letter\nHello" },
      { title: "Executive Summary", content: "" },
    ]);
    expect(md).toContain("# Test Proposal");
    expect(md).toContain("## Cover Letter");
    expect(md).toContain("## Executive Summary");
    expect(md).toContain("_(not yet drafted)_");
    expect(md).toContain("official solicitation");
  });
});

describe("capabilityStatementToMarkdown", () => {
  it("renders all five sections", () => {
    const md = capabilityStatementToMarkdown(
      {
        companyOverview: "We do things.",
        coreCompetencies: ["A", "B"],
        differentiators: ["C"],
        pastPerformance: ["D"],
        naicsCodes: ["541511"],
        contactBlock: "Acme\njane@acme.com",
      },
      "Acme"
    );
    expect(md).toContain("## Company Overview");
    expect(md).toContain("## Core Competencies");
    expect(md).toContain("## Differentiators");
    expect(md).toContain("## Past Performance");
    expect(md).toContain("541511");
    expect(md).toContain("## Contact");
  });
});
