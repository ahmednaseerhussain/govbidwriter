export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  /** Section-based body: heading + paragraphs/list items keeps rendering simple and safe. */
  sections: { heading?: string; paragraphs?: string[]; list?: string[] }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-respond-to-your-first-government-rfp",
    title: "How to Respond to Your First Government RFP (Step by Step)",
    description:
      "A practical walkthrough of responding to your first government RFP: reading Sections L and M, building a compliance matrix, and submitting on time.",
    date: "2026-05-12",
    readingMinutes: 8,
    sections: [
      {
        paragraphs: [
          "Your first government RFP is intimidating: 80+ pages, references to FAR clauses you've never heard of, and a deadline that feels too close. The good news is that evaluators aren't looking for beautiful writing — they're looking for compliance and evidence. Here's the process experienced contractors follow.",
        ],
      },
      {
        heading: "1. Read Sections L and M first",
        paragraphs: [
          "Federal RFPs follow a standard structure. Section L tells you exactly what to submit and how to format it (volumes, page limits, fonts). Section M tells you exactly how you'll be scored. Read these before the statement of work — they decide how you spend your limited writing time.",
          "If the RFP doesn't use lettered sections (common in state and local solicitations), look for headings like 'Instructions to Offerors' and 'Evaluation Criteria'.",
        ],
      },
      {
        heading: "2. Build a compliance matrix before writing anything",
        paragraphs: [
          "Go through the document and capture every 'shall', 'must', and 'will provide' as a row: the requirement, where it appears, what your response needs to say, and any document it requires. This becomes your outline, your writing assignment list, and your final pre-submission check.",
          "This is exactly the step GovBidWriter automates — upload the RFP and get a draft matrix in minutes — but whether you use software or a spreadsheet, do not skip it. Most first-time losses are compliance losses, not quality losses.",
        ],
      },
      {
        heading: "3. Confirm you're eligible before investing more time",
        list: [
          "Active SAM.gov registration (takes up to 2 weeks if you're not registered)",
          "The NAICS code's size standard — are you small for this buy?",
          "Set-aside type — 8(a), HUBZone, SDVOSB, WOSB eligibility if applicable",
          "Required licenses, bonding, or insurance minimums",
          "Mandatory site visits or pre-proposal conferences you must attend",
        ],
      },
      {
        heading: "4. Write to the evaluation criteria",
        paragraphs: [
          "Mirror Section M's language in your headings. If evaluators score 'Management Approach', have a section called Management Approach. Make every claim specific and verifiable: name contracts, give metrics, identify people. Generic claims ('extensive experience') score poorly because evaluators can't defend them in a source selection report.",
        ],
      },
      {
        heading: "5. Leave 48 hours for production and submission",
        paragraphs: [
          "Late proposals are rejected — no exceptions, even for email server delays. Finish writing two days early. Use the final day to check formatting against Section L, verify every required form is signed, acknowledge all amendments, and submit with time to confirm receipt.",
        ],
      },
      {
        heading: "The bottom line",
        paragraphs: [
          "Compliance first, evidence second, prose third. A plain proposal that answers every requirement beats an eloquent one that misses a mandatory form. Build the matrix, write to Section M, and submit early.",
        ],
      },
    ],
  },
  {
    slug: "what-is-a-capability-statement",
    title: "What Is a Capability Statement? (With Government-Ready Structure)",
    description:
      "What a capability statement is, why government buyers ask for it, and the exact one-page structure contracting officers expect to see.",
    date: "2026-05-26",
    readingMinutes: 6,
    sections: [
      {
        paragraphs: [
          "A capability statement is the government contracting version of a resume: a one-page document that tells a contracting officer who you are, what you do, and why you're credible — in a format they can skim in 30 seconds. You'll need one for agency outreach, vendor days, and many small-purchase decisions that never become formal solicitations.",
        ],
      },
      {
        heading: "The five sections buyers expect",
        list: [
          "Core competencies — 4-6 bullet points describing your services in the buyer's language (match PWS/SOW vocabulary, not marketing copy)",
          "Differentiators — what makes you the lower-risk choice: certifications, response times, specialized staff, niche experience",
          "Past performance — 2-4 contracts or comparable commercial projects with scope, value range, and outcomes",
          "Company data — UEI, CAGE code, NAICS codes, set-aside certifications (8(a), HUBZone, SDVOSB, WOSB), and acceptance of government purchase cards",
          "Contact block — a real person's name, email, and phone — not info@",
        ],
      },
      {
        heading: "Mistakes that get capability statements ignored",
        list: [
          "More than one page — it signals you don't know the format",
          "Listing every NAICS code you could theoretically perform — pick the 3-6 you actually pursue",
          "No certifications or UEI — buyers can't act on it without your identifiers",
          "Generic services lists that could describe any company in your industry",
          "Stock photos and heavy design over scannable content",
        ],
      },
      {
        heading: "Tailor it per agency",
        paragraphs: [
          "The strongest capability statements are versioned: the core stays the same, but competencies and past performance reorder to match the target agency's mission. A statement aimed at the VA should lead with healthcare-adjacent experience; the same company targeting a school district should lead with education work.",
          "GovBidWriter generates a structured capability statement from your company profile in about a minute — and regenerating it per target industry or agency is the intended workflow.",
        ],
      },
    ],
  },
  {
    slug: "rfp-compliance-matrix-guide",
    title: "The RFP Compliance Matrix: Why You Lose Without One",
    description:
      "What a compliance matrix is, the exact columns to include, and how it prevents the most common reason small businesses lose government bids.",
    date: "2026-06-02",
    readingMinutes: 7,
    sections: [
      {
        paragraphs: [
          "Most first-time government proposals don't lose on quality — they lose on compliance. A missing form, an unacknowledged amendment, a page-limit violation, an unanswered 'shall' statement. The compliance matrix is the tool proposal professionals use to make those losses impossible.",
        ],
      },
      {
        heading: "What a compliance matrix is",
        paragraphs: [
          "A table with one row per requirement in the solicitation. For each requirement it tracks: where it came from (section and page), what it demands, what your response must include, any document it requires, and its current status. During writing it's an assignment tracker; before submission it's a verification checklist; in some procurements you submit it with the proposal as a cross-reference matrix.",
        ],
      },
      {
        heading: "The columns that matter",
        list: [
          "Requirement ID (R-001, R-002... in document order)",
          "RFP section (L.3.1, C.5.4, M.2)",
          "Page reference",
          "Requirement text (the actual 'shall' statement)",
          "Response needed (what your proposal must say or do)",
          "Required document (forms, plans, certificates)",
          "Priority (high = non-compliance means rejection)",
          "Risk (how hard it is for you to satisfy)",
          "Status (not started / in progress / complete)",
        ],
      },
      {
        heading: "Where requirements hide",
        paragraphs: [
          "Requirements aren't only in the statement of work. Check Section L (submission instructions — the most commonly violated), Section M (evaluation criteria you must address), Section F (deliverables and timelines), Section I (clauses with offeror obligations like SAM registration), and amendments, which often change deadlines and add requirements. Q&A documents are also binding.",
        ],
      },
      {
        heading: "Manual vs automated extraction",
        paragraphs: [
          "Building a matrix manually from an 80-page RFP takes an experienced reviewer 3-6 hours. AI extraction gets you a near-complete draft in minutes — you then verify it against the document, which is the workflow GovBidWriter is built around. Either way, the rule is the same: every row gets resolved before submission, and any row you can't satisfy becomes a bid/no-bid conversation, not a surprise.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
