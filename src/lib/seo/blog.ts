export type BlogCategory =
  | "RFP Basics"
  | "Proposal Writing"
  | "Compliance Matrix"
  | "Capability Statements"
  | "NAICS & SAM.gov"
  | "Set-Asides";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "RFP Basics",
  "Proposal Writing",
  "Compliance Matrix",
  "Capability Statements",
  "NAICS & SAM.gov",
  "Set-Asides",
];

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
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
    category: "RFP Basics",
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
    category: "Capability Statements",
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
    category: "Compliance Matrix",
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
  {
    slug: "how-to-find-your-naics-code",
    title: "How to Find Your NAICS Code (Government Contracting Guide)",
    description:
      "How to find the right NAICS codes for government contracting, why the size standard attached to each code matters, and which codes to register in SAM.gov.",
    category: "NAICS & SAM.gov",
    date: "2026-06-05",
    readingMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Every government solicitation is issued under a NAICS code, and that code decides two things: whether the opportunity appears in your searches, and whether you count as a 'small business' for set-asides. Picking the right codes is one of the first — and most consequential — registration decisions a contractor makes.",
        ],
      },
      {
        heading: "What a NAICS code actually does in contracting",
        paragraphs: [
          "The North American Industry Classification System assigns a six-digit code to every line of business. In government contracting it's not just statistics: the contracting officer assigns one NAICS code to each solicitation, and that code's SBA size standard (a revenue cap or employee cap) determines who qualifies as small for that buy. The same company can be 'small' under one code and 'large' under another.",
        ],
      },
      {
        heading: "Three ways to find your codes",
        list: [
          "Search by what you do: use a keyword search (our free NAICS Code Finder covers the codes most common in government work) and read the official definitions at census.gov/naics",
          "Reverse-engineer from real solicitations: search SAM.gov for the work you want and note which NAICS codes agencies actually use for it — this beats theory every time",
          "Check your competitors: look up similar companies in SAM.gov's entity search and see which codes they registered",
        ],
      },
      {
        heading: "Primary vs. secondary codes in SAM.gov",
        paragraphs: [
          "SAM.gov asks for one primary NAICS code and lets you list as many secondaries as apply. Your primary should be the work you most want to win. Secondaries cost nothing and make you visible in market research — but only list codes you can credibly perform; agencies do look.",
          "A practical rule: register the 3–6 codes you'd actually bid under. An entity profile with forty codes signals a company that does nothing in particular.",
        ],
      },
      {
        heading: "Size standards: the part everyone gets wrong",
        paragraphs: [
          "Each code carries an SBA size standard — for example, roughly $34M average annual receipts for IT services codes, $22M for janitorial, $9.5M for landscaping, and employee-based caps for wholesale and manufacturing codes. Your size is measured per code, per solicitation, using a 5-year receipts average (or employee count).",
          "Before certifying as small on any bid, verify against the current SBA size standards table — misrepresentation has severe penalties, and standards are adjusted for inflation every few years.",
        ],
      },
      {
        heading: "The bottom line",
        paragraphs: [
          "Pick codes from real solicitations, not abstract definitions. Register a focused set in SAM.gov, know your size status under each, and set SAM.gov saved searches on those codes — that's your opportunity pipeline from day one.",
        ],
      },
    ],
  },
  {
    slug: "bid-no-bid-decision-guide",
    title: "The Bid/No-Bid Decision: A Guide for Small Contractors",
    description:
      "How to decide which government opportunities to pursue: the six factors that predict wins, a scoring framework, and why disciplined no-bids raise your win rate.",
    category: "RFP Basics",
    date: "2026-06-08",
    readingMinutes: 7,
    sections: [
      {
        paragraphs: [
          "The most expensive mistake in government contracting isn't losing a bid — it's writing proposals you were never going to win. Every response costs 20 to 100+ hours. The contractors who grow are rarely the ones who bid the most; they're the ones who choose the best.",
        ],
      },
      {
        heading: "The six factors that predict whether you should bid",
        list: [
          "Relevant experience: can you point to work of similar scope and size? Past performance is the heaviest evaluation factor on most service contracts.",
          "Eligibility: do you hold the required certifications, licenses, bonding, and set-aside status — today, not hypothetically?",
          "Competition: is there an entrenched incumbent? Is the set-aside type one you qualify for? A recompete with a well-reviewed incumbent is steep odds.",
          "Complexity vs. capacity: multiple volumes and oral presentations demand real hours. A rushed proposal usually scores worse than no proposal.",
          "Timeline: three weeks is workable; four days rarely is — unless the scope is small and your library is strong.",
          "Profitability: price-to-win against the wage determination and your cost structure. Winning unprofitable work is worse than losing.",
        ],
      },
      {
        heading: "A simple scoring discipline",
        paragraphs: [
          "Score each factor and set a threshold — bid above it, pass below it, and treat the middle band as 'fix the risks first' (find a teaming partner, get the certification, request clarification). The exact weights matter less than applying them consistently, before anyone falls in love with the opportunity. Our free Bid/No-Bid Calculator implements exactly this kind of weighted model if you want a starting point.",
        ],
      },
      {
        heading: "When to bid anyway",
        paragraphs: [
          "Strategic exceptions exist: entering a target agency to start building history, positioning for a recompete you intend to win next cycle, or keeping a key team billable. Make those exceptions explicitly and budget the loss — the danger isn't the strategic bid, it's calling every long shot 'strategic'.",
        ],
      },
      {
        heading: "What a healthy pipeline looks like",
        paragraphs: [
          "Established small contractors typically win 20–40% of well-qualified pursuits. If your win rate is under 10%, your filter is broken, not your writing. Track every decision — bid or pass — and review quarterly: the no-bid log tells you which capability gaps (certifications, past performance, bonding) are costing you the most opportunities, which is exactly what to fix next.",
        ],
      },
    ],
  },
  {
    slug: "common-government-proposal-mistakes",
    title: "10 Common Government Proposal Mistakes (And How to Avoid Them)",
    description:
      "The mistakes that get small business proposals rejected or scored down — from late submission and unacknowledged amendments to ignoring Section M — with practical fixes.",
    category: "Proposal Writing",
    date: "2026-06-10",
    readingMinutes: 8,
    sections: [
      {
        paragraphs: [
          "Evaluators reject or down-score most losing proposals for predictable, preventable reasons. Here are the ten we see most — roughly in order of how often they end a small business's bid.",
        ],
      },
      {
        heading: "Fatal compliance mistakes",
        list: [
          "1. Late submission — rejected with no exceptions, even for email delays. Fix: finish 48 hours early; submit 24 hours early.",
          "2. Unacknowledged amendments — a missing acknowledgment can void an otherwise perfect bid. Fix: check SAM.gov for amendments the day before submission.",
          "3. Missing required documents — unsigned forms, absent bonding letters, no certificates of insurance. Fix: build a submission checklist from the instructions section and assign every item an owner.",
          "4. Format violations — exceeded page limits, wrong fonts, wrong volume structure. Evaluators may stop reading at the page limit. Fix: check Section L formatting rules before writing, not after.",
        ],
      },
      {
        heading: "Scoring mistakes",
        list: [
          "5. Ignoring Section M — writing what you want to say instead of what's scored. Fix: mirror the evaluation factors as your section headings.",
          "6. Unanswered 'shall' statements — every requirement needs a response. Fix: build a compliance matrix and verify every row before submission.",
          "7. Generic claims — 'extensive experience' and 'commitment to excellence' score poorly because evaluators can't defend them in writing. Fix: name contracts, give metrics, identify people.",
          "8. Boilerplate that ignores this agency — evaluators recognize a template blast instantly. Fix: reference the agency's mission, facility, and PWS specifics throughout.",
        ],
      },
      {
        heading: "Business mistakes",
        list: [
          "9. Pricing against the market instead of the wage determination — Service Contract Act and Davis-Bacon rates are floors; pricing below them is non-compliant, pricing without them is unprofitable. Fix: build labor costs from the determination attached to the solicitation.",
          "10. Bidding everything — the meta-mistake that causes the other nine by spreading your hours too thin. Fix: a disciplined bid/no-bid decision before any writing starts.",
        ],
      },
      {
        heading: "The pattern behind all ten",
        paragraphs: [
          "Almost every item on this list is mechanical, not creative: read the instructions, track the requirements, verify before submission. That's why a compliance matrix and a submission checklist — built the day the RFP arrives — prevent more losses than any amount of elegant prose. Compliance gets you evaluated; evidence gets you scored; only then does writing quality matter.",
        ],
      },
    ],
  },
  {
    slug: "how-to-read-sections-l-and-m",
    title: "How to Read Sections L and M in a Federal RFP",
    description:
      "Sections L and M decide how you write and how you're scored. What each contains, how they map to your proposal outline, and what to do when they conflict.",
    category: "RFP Basics",
    date: "2026-06-11",
    readingMinutes: 7,
    sections: [
      {
        paragraphs: [
          "Experienced proposal writers read a federal RFP in a specific order — and it starts at the back. Section L tells you exactly what to submit and how; Section M tells you exactly how you'll be scored. Together they're the assignment and the grading rubric. The statement of work only tells you what the job is.",
        ],
      },
      {
        heading: "Section L: Instructions to Offerors",
        paragraphs: [
          "Section L governs the mechanics of your response: volume structure (technical, past performance, price), page limits, fonts and margins, file formats, submission method and deadline, required forms, and what each volume must contain. Treat every sentence as a requirement — formatting violations are scored down or excluded, and contracting officers have rejected proposals over fonts.",
        ],
        list: [
          "Build your proposal skeleton directly from L's volume and section structure",
          "Put every required form and attachment on your submission checklist",
          "Note the Q&A cutoff date — it's your only channel to fix ambiguities",
        ],
      },
      {
        heading: "Section M: Evaluation Factors for Award",
        paragraphs: [
          "Section M lists the factors (technical approach, past performance, price...), their relative weights, and the award basis — lowest price technically acceptable (LPTA) or best-value tradeoff. This is where you learn whether a premium approach can win or whether only price matters.",
          "Mirror M's language in your headings and topic sentences. If M scores 'Management Approach', have a section called Management Approach that opens by answering it. Evaluators write score justifications against M's words — make those sentences easy to lift from your proposal.",
        ],
      },
      {
        heading: "When L and M don't line up",
        paragraphs: [
          "It happens: M scores something L never asks you to submit, or the SOW includes requirements neither mentions. Resolve conflicts through the Q&A process before the cutoff — answers become amendments, which are binding. Where you can't get clarification, satisfy the strictest reading and note your interpretation explicitly in the proposal.",
        ],
      },
      {
        heading: "No lettered sections? (State and local RFPs)",
        paragraphs: [
          "State and local solicitations use the same logic under different names: look for 'Instructions to Proposers/Offerors' and 'Evaluation Criteria' or 'Basis of Award'. The discipline is identical — outline from the instructions, write to the scoring criteria, and capture both in your compliance matrix.",
        ],
      },
    ],
  },
  {
    slug: "past-performance-for-government-bids",
    title: "How to Prepare Past Performance for Government Bids",
    description:
      "How small businesses build past performance for government proposals: using commercial work, the reference format agencies expect, questionnaires, and what to do with no history.",
    category: "Proposal Writing",
    date: "2026-06-12",
    readingMinutes: 7,
    sections: [
      {
        paragraphs: [
          "Past performance is the evaluation factor that intimidates new contractors most — and the one with the most misconceptions. You don't need government contracts to have past performance, and 'no record' is legally neutral, not disqualifying. Here's how to build a past performance volume that scores.",
        ],
      },
      {
        heading: "Commercial work counts",
        paragraphs: [
          "Agencies evaluate relevant past performance, not federal past performance. If you've cleaned hospitals, secured stadiums, built office networks, or paved parking lots commercially, that history is admissible evidence. What matters is relevance: similar scope, similar scale, recent (typically the last 3–5 years), and verifiable.",
        ],
      },
      {
        heading: "The reference format agencies expect",
        list: [
          "Project name and client organization",
          "Contract number (if any), period of performance, and dollar value",
          "Your role — prime or subcontractor — and what you self-performed",
          "Scope summary in 2–3 sentences with scale (square footage, headcount, user count)",
          "Measurable outcome: on-time rate, inspection results, renewals exercised",
          "A reference contact who knows the work — name, title, phone, email",
        ],
      },
      {
        heading: "Prepare your references before you need them",
        paragraphs: [
          "Many solicitations send past performance questionnaires (PPQs) directly to your references, and an unreturned questionnaire can score as neutral or be a missed requirement. Call each reference before submitting their name: confirm their contact details, tell them which solicitation may contact them, and make sure they remember the work favorably. A stale phone number on a reference sheet is a self-inflicted wound.",
        ],
      },
      {
        heading: "If you truly have no history",
        list: [
          "Lean on key personnel: your project manager's experience at a previous employer is evaluable evidence on most solicitations",
          "Team or joint-venture with an experienced partner and use their record where rules allow",
          "Subcontract first: a year under a government prime creates exactly the references you're missing",
          "Start with state, local, and simplified acquisitions, where past performance requirements are lighter",
        ],
      },
      {
        heading: "Write outcomes, not adjectives",
        paragraphs: [
          "Evaluators must justify scores in writing. '24 months, zero missed services, 100% inspection pass rate, two renewals exercised' gives them a defensible sentence; 'excellent service and total commitment to quality' gives them nothing. Quantify everything you can, and keep a living past performance library so each new bid starts from proven text instead of a blank page.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
