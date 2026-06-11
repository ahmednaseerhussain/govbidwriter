import "server-only";
import type { AIProvider, AIRequest } from "./provider";

/**
 * Deterministic mock provider — active when DEEPSEEK_API_KEY is missing.
 * Produces realistic, schema-valid output for every workflow so the entire
 * app (including builds and demos) works with zero external keys.
 */
export class MockProvider implements AIProvider {
  readonly name = "mock";

  async generateText(req: AIRequest): Promise<string> {
    // Small artificial delay so loading states are visible in dev.
    await new Promise((r) => setTimeout(r, 400));
    const ctx = req.context ?? {};
    switch (req.kind) {
      case "capability_statement":
        return JSON.stringify(mockCapabilityStatement(ctx));
      case "rfp_analysis":
        return JSON.stringify(mockRfpAnalysis(ctx));
      case "requirement_extraction":
        return JSON.stringify(mockRequirements(ctx));
      case "proposal_outline":
        return JSON.stringify(mockProposalOutline());
      case "proposal_section":
        return mockProposalSection(ctx);
      case "proposal_review":
        return mockProposalReview();
      default:
        return "This is mock AI output. Set DEEPSEEK_API_KEY in .env to enable real generation with DeepSeek.";
    }
  }
}

function mockCapabilityStatement(ctx: Record<string, string>) {
  const company = ctx.companyName || "Your Company LLC";
  const industry = ctx.targetIndustry || "professional services";
  const naics = (ctx.naicsCodes || "541511").split(",").map((s) => s.trim()).filter(Boolean);
  return {
    companyOverview: `${company} is a small business providing ${industry} to federal, state, and local government agencies. We combine hands-on delivery experience with disciplined project management to help agencies meet mission requirements on schedule and within budget. Our team holds the certifications and clearances commonly required for government work, and we maintain active registration in SAM.gov.`,
    coreCompetencies: [
      `Full-service ${industry} for government facilities and programs`,
      "Contract transition and phase-in planning with zero service disruption",
      "Quality control programs aligned with agency QASP requirements",
      "Reporting and invoicing compliant with government standards",
    ],
    differentiators: [
      "Responsive small-business service with direct access to company leadership",
      "Documented past performance with on-time, on-budget delivery",
      "Established hiring pipeline for cleared and certified personnel",
      "Mature quality control plan adapted to each contract's PWS",
    ],
    pastPerformance: [
      `${industry[0].toUpperCase() + industry.slice(1)} support contract — delivered 24 months of service with 100% on-time performance and zero quality deficiencies.`,
      "Municipal services agreement — scaled staffing 40% within 30 days to meet expanded scope.",
    ],
    naicsCodes: naics,
    contactBlock: `${company}\n${ctx.ownerName || "Owner / Capture Lead"}\n${ctx.email || "contact@example.com"} | ${ctx.phone || "(555) 555-0100"}\nUEI: ${ctx.uei || "PENDING"} | CAGE: ${ctx.cageCode || "PENDING"}`,
  };
}

function mockRfpAnalysis(ctx: Record<string, string>) {
  const title = ctx.title || "Facilities Support Services";
  return {
    title,
    agency: "Department of Example Services",
    solicitationNumber: "EX-25-R-0042",
    deadline: "2026-07-15 14:00 ET",
    naicsCodes: ["561720"],
    setAside: "Total Small Business Set-Aside",
    summary: `The agency is seeking a contractor to provide ${title.toLowerCase()} including all labor, supervision, equipment, and supplies. The base period is 12 months with four 12-month option periods. Offers are evaluated on technical approach, past performance, and price. This is mock analysis output — set DEEPSEEK_API_KEY to analyze your actual RFP text.`,
    submissionInstructions: [
      "Submit proposals electronically via email to the Contracting Officer by the deadline.",
      "Volume I: Technical Proposal (not to exceed 20 pages).",
      "Volume II: Past Performance (3 references from the last 3 years).",
      "Volume III: Price Proposal using the provided pricing schedule.",
    ],
    evaluationCriteria: [
      "Factor 1: Technical Approach (most important)",
      "Factor 2: Past Performance",
      "Factor 3: Price (evaluated for fairness and reasonableness)",
    ],
    requiredDocuments: [
      "Completed SF-1449 with all amendments acknowledged",
      "Technical proposal volume",
      "Past performance references",
      "Completed pricing schedule",
      "Active SAM.gov registration",
    ],
    risks: [
      "Short turnaround between site visit and proposal due date",
      "Incumbent contractor advantage on staffing continuity",
      "Strict page limits — non-compliant volumes may be rejected",
    ],
  };
}

function mockRequirements(_ctx: Record<string, string>) {
  const rows = [
    {
      section: "L.3.1",
      pageReference: "p. 42",
      requirementText: "Offeror shall submit a Technical Proposal not exceeding 20 pages, 12-point font, 1-inch margins.",
      responseNeeded: "Format proposal volume to page/font limits; confirm compliance in cover letter.",
      requiredDocument: "Technical Proposal (Volume I)",
      priority: "high",
      riskLevel: "high",
    },
    {
      section: "L.3.2",
      pageReference: "p. 43",
      requirementText: "Offeror shall provide three (3) past performance references for contracts of similar size and scope completed within the last three (3) years.",
      responseNeeded: "Compile 3 references with contract values, periods, and points of contact.",
      requiredDocument: "Past Performance Volume (Volume II)",
      priority: "high",
      riskLevel: "medium",
    },
    {
      section: "C.5.1",
      pageReference: "p. 12",
      requirementText: "Contractor shall provide all management, supervision, labor, materials, and equipment required to perform services described in the PWS.",
      responseNeeded: "Describe staffing model, supervision structure, and equipment plan in Technical Approach.",
      requiredDocument: "",
      priority: "high",
      riskLevel: "medium",
    },
    {
      section: "C.5.4",
      pageReference: "p. 15",
      requirementText: "Contractor shall maintain a Quality Control Plan (QCP) and submit it within 15 days of award.",
      responseNeeded: "Summarize QCP approach in proposal; commit to 15-day post-award delivery.",
      requiredDocument: "Quality Control Plan (post-award)",
      priority: "medium",
      riskLevel: "medium",
    },
    {
      section: "M.2",
      pageReference: "p. 51",
      requirementText: "Proposals will be evaluated on Technical Approach, Past Performance, and Price. Technical Approach is significantly more important than Price.",
      responseNeeded: "Weight proposal effort toward the technical volume; map response to each evaluation factor.",
      requiredDocument: "",
      priority: "medium",
      riskLevel: "low",
    },
    {
      section: "F.4",
      pageReference: "p. 8",
      requirementText: "Services shall commence no later than 30 calendar days after contract award.",
      responseNeeded: "Provide a 30-day phase-in/transition plan in Management Approach.",
      requiredDocument: "Transition Plan",
      priority: "medium",
      riskLevel: "medium",
    },
    {
      section: "I.7",
      pageReference: "p. 27",
      requirementText: "Offeror must be registered and active in SAM.gov at time of offer submission.",
      responseNeeded: "Verify SAM.gov registration is active; include UEI and CAGE in cover letter.",
      requiredDocument: "SAM.gov registration confirmation",
      priority: "high",
      riskLevel: "low",
    },
  ];
  return {
    requirements: rows.map((r, i) => ({
      id: `R-${String(i + 1).padStart(3, "0")}`,
      status: "not_started",
      ...r,
    })),
  };
}

function mockProposalOutline() {
  return {
    sections: [
      { title: "Cover Letter", guidance: "Identify the solicitation, confirm compliance, state UEI/CAGE." },
      { title: "Executive Summary", guidance: "Why your company, in one page, mapped to evaluation factors." },
      { title: "Understanding of Requirements", guidance: "Restate the agency's mission need and scope in your own words." },
      { title: "Technical Approach", guidance: "How you will perform each PWS task; methods, tools, standards." },
      { title: "Management Approach", guidance: "Org chart, supervision, communication, transition plan." },
      { title: "Staffing Plan", guidance: "Key personnel, qualifications, recruiting and retention." },
      { title: "Quality Control Plan", guidance: "Inspections, metrics, corrective action aligned to the QASP." },
      { title: "Past Performance", guidance: "Relevant contracts with outcomes and references." },
      { title: "Risk Management", guidance: "Top risks and concrete mitigations." },
      { title: "Pricing Narrative", guidance: "Basis of estimate and pricing assumptions (no detailed rates here)." },
      { title: "Submission Checklist", guidance: "Every required document and formatting rule, checked off." },
    ],
  };
}

function mockProposalSection(ctx: Record<string, string>): string {
  const section = ctx.sectionTitle || "Section";
  const company = ctx.companyName || "Your Company LLC";
  const rfp = ctx.rfpTitle || "the solicitation";
  return `## ${section}

${company} is pleased to respond to ${rfp}. This draft was produced in mock mode (set DEEPSEEK_API_KEY for tailored generation), but follows the structure evaluators expect for a ${section.toLowerCase()}.

${company} brings directly relevant experience to this requirement. Our approach is built on three commitments: full compliance with every stated requirement, continuity of service from day one, and measurable quality backed by our internal quality control program.

- **Compliance first.** Every element of this section maps to the solicitation's stated requirements and evaluation criteria.
- **Proven delivery.** We apply the same processes that earned strong past performance ratings on comparable contracts.
- **Accountable management.** A named project manager with decision authority serves as the government's single point of contact.

We welcome the opportunity to discuss our approach and demonstrate why ${company} is the low-risk choice for this requirement.

> Draft note: verify all facts, names, and claims against your company records and the official solicitation before submission.`;
}

function mockProposalReview(): string {
  return `## Proposal Review (mock)

**Overall:** Solid structure; strengthen the win themes and compliance traceability.

1. **Compliance:** Add a cross-reference matrix mapping each Section L instruction to a proposal page.
2. **Evaluation alignment:** Mirror Section M factor language in the Executive Summary headings.
3. **Specificity:** Replace generic claims ("extensive experience") with named contracts, metrics, and outcomes.
4. **Risk:** The staffing plan should name a contingency source for cleared personnel.
5. **Polish:** Normalize tense and remove first-person plural inconsistencies.

Set DEEPSEEK_API_KEY for a review tailored to your actual draft.`;
}
