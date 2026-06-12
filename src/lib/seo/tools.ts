/**
 * Registry of all free public tools. The /tools hub, homepage, footer, and
 * sitemap all render from this list — add a tool here and every surface
 * picks it up.
 */

export type FreeTool = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  /** lucide icon name used by surfaces that render icons */
  icon:
    | "ListChecks"
    | "BadgeCheck"
    | "Search"
    | "Scale"
    | "History"
    | "FileText"
    | "ClipboardCheck"
    | "ShieldCheck";
  /** true when output comes from the AI provider (mock-capable) */
  usesAi: boolean;
};

export const FREE_TOOLS: FreeTool[] = [
  {
    slug: "rfp-compliance-matrix-generator",
    name: "RFP Compliance Matrix Generator",
    shortName: "Compliance Matrix",
    description:
      "Paste RFP text and extract every requirement into a matrix — sections, priorities, risks, and required documents.",
    icon: "ListChecks",
    usesAi: true,
  },
  {
    slug: "capability-statement-generator",
    name: "Capability Statement Generator",
    shortName: "Capability Statement",
    description:
      "Generate a government-ready capability statement from your company details: overview, competencies, differentiators, past performance.",
    icon: "BadgeCheck",
    usesAi: true,
  },
  {
    slug: "naics-code-finder",
    name: "NAICS Code Finder",
    shortName: "NAICS Finder",
    description:
      "Search government contracting NAICS codes by service type or keyword, with guides for the most common codes.",
    icon: "Search",
    usesAi: false,
  },
  {
    slug: "bid-no-bid-calculator",
    name: "Bid / No-Bid Calculator",
    shortName: "Bid/No-Bid",
    description:
      "Score whether an opportunity is worth pursuing — experience fit, competition, complexity, and capacity in one 0–100 score.",
    icon: "Scale",
    usesAi: false,
  },
  {
    slug: "past-performance-writer",
    name: "Past Performance Writer",
    shortName: "Past Performance",
    description:
      "Turn project history into proposal-ready past performance write-ups: full paragraph, short version, and reference format.",
    icon: "History",
    usesAi: true,
  },
  {
    slug: "executive-summary-generator",
    name: "Executive Summary Generator",
    shortName: "Executive Summary",
    description:
      "Generate a proposal executive summary from the RFP's key points and your company strengths.",
    icon: "FileText",
    usesAi: true,
  },
  {
    slug: "proposal-checklist-generator",
    name: "Proposal Checklist Generator",
    shortName: "Proposal Checklist",
    description:
      "Paste RFP text and get a submission checklist: required documents, submission steps, and deadline reminders.",
    icon: "ClipboardCheck",
    usesAi: false,
  },
  {
    slug: "set-aside-eligibility-checker",
    name: "Set-Aside Eligibility Checker",
    shortName: "Set-Aside Checker",
    description:
      "Answer a few questions to see which small business set-aside programs you may qualify for — 8(a), HUBZone, WOSB, SDVOSB.",
    icon: "ShieldCheck",
    usesAi: false,
  },
];

export function getTool(slug: string): FreeTool | undefined {
  return FREE_TOOLS.find((t) => t.slug === slug);
}
