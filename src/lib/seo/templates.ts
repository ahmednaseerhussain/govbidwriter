import type { Faq } from "./data";

/**
 * Template library seed data. Each entry renders a /templates/[slug] page:
 * use case, section-by-section structure preview, tips, FAQs, and CTAs.
 * The flagship 11-section proposal template keeps its dedicated page at
 * /government-contract-proposal-template.
 */

export type TemplateSection = { title: string; body: string };

export type TemplateDef = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whoFor: string;
  sections: TemplateSection[];
  tips: string[];
  faqs: Faq[];
  /** Primary "generate this with AI" destination. */
  cta: { label: string; href: string };
  relatedIndustrySlug?: string;
};

export const TEMPLATES: TemplateDef[] = [
  {
    slug: "janitorial-proposal-template",
    name: "Janitorial Services Proposal Template",
    metaTitle: "Janitorial Proposal Template for Government Contracts",
    metaDescription:
      "Free janitorial services proposal template for government bids: technical approach, staffing plan, quality control, phase-in, and pricing — structured for PWS-based custodial solicitations.",
    intro:
      "Government janitorial solicitations are PWS-driven: the agency specifies cleaning tasks and frequencies, and your proposal must prove you can perform every one of them reliably. This template structures a custodial proposal the way janitorial evaluators score them — heavy on staffing math, quality control, and phase-in credibility.",
    whoFor:
      "Custodial and cleaning companies bidding federal building custodial contracts, school district cleaning, VA facilities, or state/municipal janitorial work — typically under NAICS 561720.",
    sections: [
      {
        title: "1. Cover Letter & Understanding of Requirements",
        body: "Reference the solicitation number, acknowledge all amendments, and show in two sentences that you understand the facility type, square footage, and service level the PWS describes.",
      },
      {
        title: "2. Technical Approach (PWS Task Matrix)",
        body: "Map every PWS task and frequency to how you'll perform it — room types, methods, products, and equipment. Evaluators check this against the PWS line by line; mirror its numbering.",
      },
      {
        title: "3. Staffing Plan",
        body: "Headcount by shift with supervision ratios, your hiring and background-check pipeline, and coverage math that accounts for leave and turnover. Name the on-site supervisor if possible.",
      },
      {
        title: "4. Quality Control Plan",
        body: "Inspection schedules, checklists, deficiency correction timelines, and how your QCP aligns to the agency's QASP. This is the most common technical differentiator in custodial awards.",
      },
      {
        title: "5. Phase-In / Transition Plan",
        body: "A 30-day plan covering hiring, badging, equipment staging, and shadowing the incumbent — with zero service disruption as the explicit commitment.",
      },
      {
        title: "6. Past Performance",
        body: "2–4 references of comparable size and facility type (hospitals, offices, schools). Commercial work counts — include square footage, duration, and quality outcomes.",
      },
      {
        title: "7. Safety & Compliance",
        body: "OSHA program, SDS handling, green cleaning standards (CIMS-GB/Safer Choice where specified), and insurance certificates.",
      },
      {
        title: "8. Pricing",
        body: "Priced exactly per the solicitation's schedule (per square foot or monthly), with Service Contract Act wage determination rates built into your labor costs.",
      },
    ],
    tips: [
      "Attend the site visit — many janitorial RFPs make it mandatory, and pricing without seeing the facility is how contracts lose money",
      "Price from the wage determination attached to the solicitation, not local market rates",
      "Quantify quality history: inspection pass rates and contract renewals beat adjectives",
    ],
    faqs: [
      {
        q: "Do I need federal experience to win a janitorial contract?",
        a: "No — agencies accept comparable commercial past performance (offices, hospitals, schools). Small business set-asides keep the field accessible, and a specific, credible quality control plan often outweighs a thin federal résumé.",
      },
      {
        q: "What gets janitorial proposals rejected most often?",
        a: "Missing the mandatory site visit, pricing that ignores the wage determination, generic quality plans that don't reference the agency's QASP, and unacknowledged amendments.",
      },
    ],
    cta: { label: "Generate your janitorial proposal with AI", href: "/signup" },
    relatedIndustrySlug: "janitorial-services",
  },
  {
    slug: "security-guard-proposal-template",
    name: "Security Guard Services Proposal Template",
    metaTitle: "Security Guard Proposal Template for Government Contracts",
    metaDescription:
      "Free security guard services proposal template for government bids: post staffing with relief factors, training program, licensing, supervision model, and pricing — built for NAICS 561612 solicitations.",
    intro:
      "Security guard evaluations turn on one question: can you fill every post, every shift, with licensed and trained officers — without gaps? This template structures a guard services proposal around the staffing math, training records, and supervision model evaluators scrutinize hardest.",
    whoFor:
      "Licensed security companies bidding armed or unarmed guard contracts for federal buildings, courts, state facilities, or municipal sites — typically under NAICS 561612.",
    sections: [
      {
        title: "1. Cover Letter & Licensing Summary",
        body: "Solicitation reference, amendment acknowledgments, and an up-front statement of your state agency license plus armed certifications covering every place of performance.",
      },
      {
        title: "2. Technical Approach & Post Orders Compliance",
        body: "How you'll perform each post per the Post Orders: access control, patrols, reporting, and emergency response procedures.",
      },
      {
        title: "3. Staffing Plan with Relief Factor",
        body: "Post-by-post coverage math showing your relief factor (typically 1.5–1.7 officers per 24/7 post) covering leave, training, and turnover. Evaluators check this arithmetic.",
      },
      {
        title: "4. Training Program",
        body: "Pre-assignment hours, curriculum, firearms qualification cadence for armed posts, and refresher schedule — mapped to the agency's stated hour requirements.",
      },
      {
        title: "5. Supervision & Quality Control",
        body: "Supervisor-to-guard ratios, post inspection frequency, and your no-vacant-post contingency plan with response times for call-offs.",
      },
      {
        title: "6. Personnel Vetting",
        body: "Background check process, suitability determination support, and clearance handling where required.",
      },
      {
        title: "7. Past Performance",
        body: "Guard contracts of comparable post count and security level, with fill-rate and incident-response metrics.",
      },
      {
        title: "8. Pricing",
        body: "Hourly or monthly rates per post type, built from the Service Contract Act wage determination's guard categories, with armed/unarmed differentials.",
      },
    ],
    tips: [
      "Show the relief factor calculation explicitly — staffing math is the deciding technical factor in most guard awards",
      "Bid only posts your licenses and insurance actually cover; non-compliance is grounds for rejection",
      "Include a named 24/7 operations contact and call-off response procedure",
    ],
    faqs: [
      {
        q: "Can a new security company win federal guard work?",
        a: "Federal primes usually require demonstrated past performance and licensed guard forces, so most new firms start with state/local contracts or subcontract under an established prime to build history.",
      },
      {
        q: "What's different about armed post proposals?",
        a: "Firearms licensing and qualification records, higher insurance minimums, and higher SCA wage categories. Every armed requirement must be addressed explicitly — agencies verify before award.",
      },
    ],
    cta: { label: "Generate your security proposal with AI", href: "/signup" },
    relatedIndustrySlug: "security-guard-services",
  },
  {
    slug: "it-services-proposal-template",
    name: "IT Services Proposal Template",
    metaTitle: "IT Services Proposal Template for Government Contracts",
    metaDescription:
      "Free IT services proposal template for government bids: technical approach with PWS traceability, key personnel, security compliance (NIST/CMMC), transition plan, and labor-category pricing.",
    intro:
      "Government IT proposals are scored on traceability and risk: does your approach address every PWS task, are your people certified, and is your security posture real? This template structures an IT services response around those three tests — for help desk, network operations, cybersecurity, and integration work.",
    whoFor:
      "IT services firms bidding help desk, network administration, cybersecurity, cloud, or systems integration solicitations — typically under NAICS 541512, 541511, or 541519.",
    sections: [
      {
        title: "1. Executive Summary",
        body: "The agency's mission need, your solution at a glance, and 2–3 discriminators with evidence — mirroring Section M's factor language.",
      },
      {
        title: "2. Technical Approach (PWS Traceability)",
        body: "Task-by-task response to the PWS/SOO with your methodology, tools, and SLAs. Use the PWS numbering so evaluators can score traceability directly.",
      },
      {
        title: "3. Key Personnel & Certifications Matrix",
        body: "Named personnel mapped to labor categories with required certs (Security+, CISSP, PMP, cloud certifications) and signed commitment letters where required.",
      },
      {
        title: "4. Security & Compliance",
        body: "NIST 800-171/CMMC posture for DoD work, FedRAMP services for cloud, Section 508 for user-facing systems, and your incident response process.",
      },
      {
        title: "5. Transition-In Plan",
        body: "Knowledge transfer milestones, environment access, tool deployment, and the date you reach full performance — with risk mitigations for incumbent non-cooperation.",
      },
      {
        title: "6. Management Approach",
        body: "Governance cadence, escalation paths, SLA reporting, and surge handling.",
      },
      {
        title: "7. Past Performance",
        body: "Contracts with metrics evaluators can defend: uptime percentages, SLA attainment, ticket volumes, migration outcomes.",
      },
      {
        title: "8. Pricing",
        body: "Fully-burdened rates by labor category matching the solicitation's structure, or firm-fixed-price by milestone for project work.",
      },
    ],
    tips: [
      "Mirror PWS task numbering in your technical approach — evaluators score traceability, not prose quality",
      "Address security compliance even when the RFP is vague; it signals lower risk",
      "Metric-backed past performance (99.9% uptime, 95% first-call resolution) is the strongest differentiator in IT evaluations",
    ],
    faqs: [
      {
        q: "Do I need a GSA Schedule to bid government IT work?",
        a: "No — substantial IT work is solicited open-market on SAM.gov and through small business set-asides. A GSA MAS contract helps once you have past performance, but it isn't a prerequisite.",
      },
      {
        q: "How should small IT firms handle CMMC requirements?",
        a: "For DoD work involving CUI, expect at least a current NIST 800-171 self-assessment score in SPRS, with CMMC certification phasing in. State and civilian work usually has lighter requirements — read each solicitation's security section carefully.",
      },
    ],
    cta: { label: "Generate your IT proposal with AI", href: "/signup" },
    relatedIndustrySlug: "it-services",
  },
  {
    slug: "construction-proposal-template",
    name: "Construction Proposal / Bid Template",
    metaTitle: "Construction Proposal Template for Government Contracts",
    metaDescription:
      "Free government construction proposal template: bid schedule compliance, bonding, project approach, schedule, safety record (EMR), Davis-Bacon pricing, and subcontracting plan.",
    intro:
      "Government construction bids live or die on responsiveness: exact bid schedule compliance, bonding in place, every amendment acknowledged. This template covers both sealed-bid (IFB) responsiveness and the technical volumes best-value construction RFPs require.",
    whoFor:
      "General and specialty contractors bidding federal renovation/new construction, school and municipal projects, or state DOT work — typically under NAICS 236220 and related codes.",
    sections: [
      {
        title: "1. Bid Forms & Acknowledgments",
        body: "The signed bid schedule exactly as issued, every amendment acknowledged, and bid guarantee attached. On sealed bids, an error here disqualifies regardless of price.",
      },
      {
        title: "2. Bonding & Financial Capacity",
        body: "Surety letter showing single and aggregate capacity covering this project (Miller Act: 100% performance and payment bonds over $150K federal).",
      },
      {
        title: "3. Project Approach & Schedule",
        body: "Phasing, critical path schedule, site logistics, and how you'll maintain facility operations during construction where required.",
      },
      {
        title: "4. Key Personnel & Subcontractors",
        body: "Superintendent and PM with comparable project experience, licensed trades coverage, and your subcontracting plan where small business goals apply.",
      },
      {
        title: "5. Safety Program",
        body: "EMR (ideally below 1.0), OSHA logs, site-specific safety plan, and competent-person designations.",
      },
      {
        title: "6. Quality Control",
        body: "Inspection and testing plan, submittal management, and deficiency correction process — aligned to the spec sections.",
      },
      {
        title: "7. Past Performance",
        body: "Comparable projects with values, schedules met, and owner references — emphasize on-time, on-budget completion percentages.",
      },
      {
        title: "8. Pricing (Davis-Bacon Compliant)",
        body: "Unit prices exactly per the bid schedule, with prevailing wages from the solicitation's wage determination built into labor costs.",
      },
    ],
    tips: [
      "Verify bonding capacity before bidding, not after — your surety's single-project limit is your ceiling",
      "Unacknowledged amendments are the most common sealed-bid disqualifier",
      "Walk the site: pricing federal renovation work from drawings alone is a classic loss-maker",
    ],
    faqs: [
      {
        q: "Are federal construction contracts always lowest-bid?",
        a: "Many are sealed-bid IFBs won by the lowest responsive, responsible bidder — but design-build and larger projects often use best-value RFPs where past performance and approach matter. Section M (or the evaluation section) tells you which game you're playing.",
      },
      {
        q: "How does Davis-Bacon affect my bid?",
        a: "You must pay the prevailing wages in the solicitation's wage determination and submit certified weekly payrolls. Bid using those rates — underpricing labor against the determination is a common fatal error.",
      },
    ],
    cta: { label: "Build your construction bid with AI", href: "/signup" },
    relatedIndustrySlug: "construction",
  },
  {
    slug: "past-performance-template",
    name: "Past Performance Template",
    metaTitle: "Past Performance Template for Government Proposals",
    metaDescription:
      "Free past performance template for government contracts: the reference format and write-up structure evaluators expect, with guidance on using commercial projects and quantifying outcomes.",
    intro:
      "Past performance is how agencies de-risk an award: evidence you've done comparable work, recently, with verifiable results. This template gives you the standard reference format plus the write-up structure that scores well — and it works with commercial projects, which absolutely count.",
    whoFor:
      "Any contractor assembling a past performance volume or the past performance section of a capability statement — especially first-time bidders converting commercial history into government-ready references.",
    sections: [
      {
        title: "Reference Header Block",
        body: "Project name · Client organization · Contract number (if any) · Period of performance · Contract value · Your role (prime/sub) · Reference contact with phone and email.",
      },
      {
        title: "Scope Summary",
        body: "2–3 sentences on what you actually performed: services, scale (square footage, user count, post count), and operating environment.",
      },
      {
        title: "Relevance Statement",
        body: "One explicit sentence connecting this project to the target solicitation: same scope, similar size, same compliance regime. Don't make evaluators infer it.",
      },
      {
        title: "Performance Narrative",
        body: "How you executed: staffing model, quality control, communication cadence, and any problem you solved — the recovery story is often the most persuasive part.",
      },
      {
        title: "Measurable Outcomes",
        body: "Numbers evaluators can defend in a source selection report: on-time percentage, inspection pass rate, renewals exercised, SLA attainment, dollars saved.",
      },
    ],
    tips: [
      "3–5 references from the last 3–5 years is the typical requirement — check the solicitation for minimum values and required forms",
      "Warn your references: agencies send past performance questionnaires, and an unreturned questionnaire can score as neutral or worse",
      "Pick relevance over prestige — a same-scope commercial contract beats a bigger but unrelated one",
    ],
    faqs: [
      {
        q: "What if I have no past performance at all?",
        a: "By regulation (FAR 15.305), offerors without a record of past performance may not be evaluated favorably or unfavorably — a neutral rating. Pair that neutrality with strong key personnel experience and a detailed technical approach, or team with an experienced partner.",
      },
      {
        q: "Can I use subcontract work as past performance?",
        a: "Yes — identify your role honestly and describe the portion you self-performed. A reference from the prime contractor carries real weight.",
      },
    ],
    cta: { label: "Write your past performance with AI", href: "/tools/past-performance-writer" },
  },
  {
    slug: "quality-control-plan-template",
    name: "Quality Control Plan Template",
    metaTitle: "Quality Control Plan (QCP) Template for Government Contracts",
    metaDescription:
      "Free quality control plan template for government service contracts: inspection schedules, deficiency correction, QASP alignment, and reporting — the structure agencies expect in a QCP.",
    intro:
      "Service contracts (janitorial, grounds, security, facilities) almost always require a Quality Control Plan — and it's usually the most heavily weighted technical document. The winning pattern: your QCP mirrors the agency's QASP, so the government can see its surveillance plan and your inspection plan as two halves of one system.",
    whoFor:
      "Service contractors submitting QCPs with proposals or post-award — custodial, grounds, security, facilities maintenance, and food service under PWS-based contracts.",
    sections: [
      {
        title: "1. Quality Policy & Responsibility",
        body: "Who owns quality (named QC manager and their authority to correct deficiencies), and the chain from finding to fix.",
      },
      {
        title: "2. Performance Standards Matrix",
        body: "Each PWS task with its standard, the acceptable quality level (AQL), and how it maps to the agency's QASP surveillance method.",
      },
      {
        title: "3. Inspection System",
        body: "Scheduled and unscheduled inspections by area and frequency, checklists used, and who performs them. Include customer-complaint intake as an inspection trigger.",
      },
      {
        title: "4. Deficiency Identification & Correction",
        body: "Documentation, correction timelines by severity, root-cause analysis for repeats, and preventive action.",
      },
      {
        title: "5. Records & Reporting",
        body: "Inspection logs, monthly quality reports to the COR, and how records are retained and made available for government review.",
      },
      {
        title: "6. Training & Communication",
        body: "How quality standards reach your workforce: initial training, refreshers after deficiencies, and toolbox talks.",
      },
    ],
    tips: [
      "Get the QASP from the solicitation and reference its surveillance methods explicitly — generic QCPs score poorly",
      "Set internal AQLs slightly tighter than the government's so you catch issues before the COR does",
      "Keep inspection checklists as appendices — they make the plan concrete and demonstrable",
    ],
    faqs: [
      {
        q: "What's the difference between a QCP and a QASP?",
        a: "The QCP is yours — how you ensure quality. The QASP is the government's — how they surveil your performance. The strongest proposals align the two explicitly, table to table.",
      },
      {
        q: "How long should a QCP be?",
        a: "Long enough to be operational, not aspirational — typically 5–15 pages plus checklist appendices for a single-facility service contract. Respect any page limits in Section L.",
      },
    ],
    cta: { label: "Draft your QCP with AI", href: "/signup" },
  },
  {
    slug: "staffing-plan-template",
    name: "Staffing Plan Template",
    metaTitle: "Staffing Plan Template for Government Contracts",
    metaDescription:
      "Free staffing plan template for government service contracts: positions and coverage math, recruitment pipeline, key personnel, contingency planning, and phase-in staffing.",
    intro:
      "A staffing plan answers the evaluator's core anxiety: will this contractor actually have qualified people on site from day one — and keep them there? This template structures the headcount math, hiring pipeline, and contingency planning that make a staffing plan credible.",
    whoFor:
      "Service contractors whose solicitations require a staffing or management plan — janitorial, security, facilities, food service, and labor-based IT support contracts.",
    sections: [
      {
        title: "1. Organizational Chart",
        body: "From corporate oversight to on-site supervision to line staff, with names where possible and the contract's reporting relationships.",
      },
      {
        title: "2. Position Descriptions & Coverage Math",
        body: "Each position with qualifications, certifications, and shift coverage — including relief factors for 24/7 posts and seasonal adjustments where relevant.",
      },
      {
        title: "3. Key Personnel",
        body: "Project/site manager and supervisors with their relevant experience, plus letters of commitment where the solicitation requires them.",
      },
      {
        title: "4. Recruitment & Retention",
        body: "Your hiring pipeline (sources, timeline from offer to badge), wage/benefit posture against the wage determination, and retention measures with your actual turnover rate if it's good.",
      },
      {
        title: "5. Phase-In Staffing",
        body: "Week-by-week hiring and onboarding from award to full performance, including incumbent-staff capture strategy (commonly 60–90% on service contracts).",
      },
      {
        title: "6. Contingency Plan",
        body: "Coverage for call-offs, surges, and key-person loss: cross-trained backups, on-call lists, and time-to-fill commitments.",
      },
    ],
    tips: [
      "Make the math visible: positions × shifts × relief factor — evaluators check whether your headcount actually covers the schedule",
      "Address incumbent staff capture explicitly on recompetes; it's your fastest path to day-one capability",
      "Tie wages to the wage determination — staffing plans priced below it signal performance risk",
    ],
    faqs: [
      {
        q: "What's a relief factor and why does it matter?",
        a: "The multiplier converting posts into headcount once leave, training, and turnover are counted — typically 1.5–1.7 employees per 24/7 post. Omitting it is the most common staffing plan error and evaluators specifically look for it.",
      },
      {
        q: "Do I need to name every employee before award?",
        a: "No — name key personnel (managers, supervisors) and describe the pipeline for line positions. Solicitations state which roles require resumes or commitment letters.",
      },
    ],
    cta: { label: "Draft your staffing plan with AI", href: "/signup" },
  },
  {
    slug: "capability-statement-template",
    name: "Capability Statement Template",
    metaTitle: "Capability Statement Template for Government Contractors",
    metaDescription:
      "Free capability statement template: the one-page format contracting officers expect — core competencies, differentiators, past performance, company data block with UEI/CAGE/NAICS, and contact.",
    intro:
      "The capability statement is your government-contracting resume: one page, scannable in 30 seconds, in the exact format contracting officers expect. This template covers the five standard sections and the company-data block that makes you actionable in a buyer's vendor research.",
    whoFor:
      "Every government contractor — it's required for agency outreach, vendor days, and prime/sub teaming conversations, and it's often requested for purchases that never become formal solicitations.",
    sections: [
      {
        title: "1. Core Competencies",
        body: "4–6 bullets describing your services in the buyer's vocabulary (PWS/SOW language, not marketing copy), led by the services you actually want to win.",
      },
      {
        title: "2. Differentiators",
        body: "3–5 reasons you're the lower-risk choice: certifications, response times, specialized staff, niche depth. Specific and verifiable beats superlative.",
      },
      {
        title: "3. Past Performance",
        body: "2–4 contracts or comparable commercial projects with scope, value range, and outcome — clients named where permitted.",
      },
      {
        title: "4. Company Data Block",
        body: "UEI · CAGE code · primary NAICS codes · set-aside certifications (8(a), HUBZone, WOSB, SDVOSB) · acceptance of government purchase cards. Without this block, a buyer can't act.",
      },
      {
        title: "5. Contact Block",
        body: "A real person's name, direct phone, and email — not info@ — plus website and address.",
      },
    ],
    tips: [
      "One page, always — a second page signals you don't know the format",
      "Version it per agency: reorder competencies and past performance to match each target's mission",
      "List only the 3–6 NAICS codes you actively pursue, not everything you could theoretically do",
    ],
    faqs: [
      {
        q: "PDF or Word? Designed or plain?",
        a: "A clean single-page PDF. Light branding is fine, but scannable content beats heavy design — contracting officers skim dozens of these during market research.",
      },
      {
        q: "Where will I actually use it?",
        a: "Agency small business office outreach, SAM.gov interested-vendor lists, industry days, prime contractor supplier registrations, and attached to quotes on simplified acquisitions.",
      },
    ],
    cta: { label: "Generate yours free", href: "/tools/capability-statement-generator" },
  },
];

export function getTemplate(slug: string): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
