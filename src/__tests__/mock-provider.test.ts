import { describe, it, expect } from "vitest";
import { MockProvider } from "@/lib/ai/mock";
import {
  capabilityStatementSchema,
  rfpAnalysisSchema,
  requirementsListSchema,
} from "@/lib/ai/schemas";

/**
 * The mock-mode contract: every structured output from MockProvider must
 * validate against the same zod schemas used for real AI output. If these
 * fail, the zero-key demo experience is broken.
 */
describe("MockProvider schema compliance", () => {
  const provider = new MockProvider();

  it("capability statement output matches schema", async () => {
    const raw = await provider.generateText({
      kind: "capability_statement",
      system: "",
      user: "",
      context: { companyName: "Test Co" },
    });
    const parsed = capabilityStatementSchema.safeParse(JSON.parse(raw));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.companyOverview).toContain("Test Co");
      expect(parsed.data.coreCompetencies.length).toBeGreaterThan(0);
    }
  });

  it("rfp analysis output matches schema", async () => {
    const raw = await provider.generateText({
      kind: "rfp_analysis",
      system: "",
      user: "",
      context: {},
    });
    const parsed = rfpAnalysisSchema.safeParse(JSON.parse(raw));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.evaluationCriteria.length).toBeGreaterThan(0);
      expect(parsed.data.requiredDocuments.length).toBeGreaterThan(0);
    }
  });

  it("requirement extraction output matches schema with sequential ids", async () => {
    const raw = await provider.generateText({
      kind: "requirement_extraction",
      system: "",
      user: "",
      context: {},
    });
    const parsed = requirementsListSchema.safeParse(JSON.parse(raw));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.requirements.length).toBeGreaterThanOrEqual(5);
      expect(parsed.data.requirements[0].id).toBe("R-001");
      for (const r of parsed.data.requirements) {
        expect(["low", "medium", "high"]).toContain(r.priority);
        expect(["low", "medium", "high"]).toContain(r.riskLevel);
      }
    }
  });

  it("proposal section output is markdown with the section heading", async () => {
    const raw = await provider.generateText({
      kind: "proposal_section",
      system: "",
      user: "",
      context: { sectionTitle: "Technical Approach", companyName: "Test Co" },
    });
    expect(raw).toContain("## Technical Approach");
    expect(raw).toContain("Test Co");
  });
});
