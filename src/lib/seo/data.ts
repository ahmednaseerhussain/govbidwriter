/**
 * pSEO seed data: 10 industries x 10 states + NAICS codes.
 * Curated, genuinely useful content — quality over volume. Pages are statically
 * generated from this file; no DB reads at build time.
 */

export type Faq = { q: string; a: string };

export type Industry = {
  slug: string;
  name: string;
  /** e.g. "janitorial services contracts" */
  contractNoun: string;
  naicsCodes: string[];
  intro: string;
  commonRequirements: string[];
  documentsNeeded: string[];
  proposalChecklist: string[];
  typicalBuyers: string[];
  faqs: Faq[];
};

export type StateInfo = {
  slug: string;
  name: string;
  abbr: string;
  procurementPortal: { name: string; url: string };
  note: string;
};

export type NaicsEntry = {
  code: string;
  title: string;
  industrySlug?: string;
  sizeStandard: string;
  description: string;
  whatQualifies: string[];
  faqs: Faq[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "janitorial-services",
    name: "Janitorial Services",
    contractNoun: "janitorial services contracts",
    naicsCodes: ["561720"],
    intro:
      "Government janitorial contracts cover routine custodial work in federal buildings, courthouses, military installations, schools, and state facilities. Most solicitations are firm-fixed-price, awarded under NAICS 561720, and frequently set aside for small businesses — including 8(a), HUBZone, and SDVOSB firms. Agencies care most about staffing reliability, quality control, and your ability to pass background checks for building access.",
    commonRequirements: [
      "Performance Work Statement (PWS) compliance — cleaning frequencies by room type, often specified per square foot",
      "Quality Control Plan (QCP) aligned to the agency's Quality Assurance Surveillance Plan (QASP)",
      "Staff background checks / suitability determinations for facility access badges",
      "Green cleaning standards (often CIMS-GB or EPA Safer Choice products)",
      "OSHA-compliant safety program and SDS sheets for all chemicals",
      "Liability insurance, typically $1M per occurrence, and workers' compensation",
    ],
    documentsNeeded: [
      "Capability statement with janitorial past performance",
      "Active SAM.gov registration (UEI) under NAICS 561720",
      "Quality Control Plan",
      "Staffing plan with supervision ratios",
      "Certificates of insurance",
      "Price proposal per the solicitation's pricing schedule (often price per sq. ft. or monthly rate)",
    ],
    proposalChecklist: [
      "Confirm site visit attendance — many janitorial RFPs make it mandatory",
      "Map every PWS task and frequency to a row in your technical approach",
      "Name your on-site supervisor and escalation chain",
      "Include a 30-day phase-in plan covering hiring and badge processing",
      "Verify wage determinations (Service Contract Act) are built into pricing",
      "Acknowledge all amendments on the SF-1449/SF-33",
    ],
    typicalBuyers: ["GSA", "U.S. Army Corps of Engineers", "VA medical centers", "Public school districts", "State facility management departments"],
    faqs: [
      {
        q: "Do I need past government experience to win janitorial contracts?",
        a: "No. Agencies accept relevant commercial past performance — large office buildings, hospitals, and schools all count. Strong references with measurable quality records can outweigh missing federal experience, especially on small business set-asides.",
      },
      {
        q: "What is the Service Contract Act and does it apply?",
        a: "The SCA (now SCLS) requires paying federally-determined minimum wages and benefits to service employees on most federal contracts over $2,500. The wage determination is attached to the solicitation — price your labor from it, not from local market rates.",
      },
      {
        q: "How are janitorial proposals usually evaluated?",
        a: "Most use Lowest Price Technically Acceptable (LPTA) or best value with technical approach, past performance, and price. A compliant, specific quality control plan is the most common technical differentiator.",
      },
    ],
  },
  {
    slug: "security-guard-services",
    name: "Security Guard Services",
    contractNoun: "security guard contracts",
    naicsCodes: ["561612"],
    intro:
      "Government security guard contracts supply armed and unarmed officers for federal buildings, military bases, state facilities, and special events. Solicited under NAICS 561612, these contracts demand state guard licenses, firearms certifications for armed posts, and rigorous personnel vetting. Agencies weigh your training program, supervision model, and ability to fill posts without gaps more heavily than price.",
    commonRequirements: [
      "State security guard licenses and, for armed posts, firearms permits and qualification records",
      "Guard training program meeting agency hour requirements (often 40+ hours pre-assignment)",
      "Post Orders compliance and documented post inspections",
      "Personnel security clearances or suitability determinations",
      "24/7 supervision and post-fill contingency plan (no vacant posts)",
      "Uniform, equipment, and communications specifications",
    ],
    documentsNeeded: [
      "State security agency license (and officer licenses)",
      "Training curriculum and certification records",
      "Capability statement with guard services past performance",
      "Staffing and supervision plan with relief factor math",
      "Insurance certificates (general liability + often $1M+ per occurrence)",
      "Active SAM.gov registration under NAICS 561612",
    ],
    proposalChecklist: [
      "Verify your state license covers every place of performance",
      "Show your relief factor calculation — evaluators check whether staffing math covers leave and training",
      "Document armed certification process and weapon qualification cadence",
      "Include a post-vacancy contingency plan with response times",
      "Address Service Contract Act wage determinations for guard categories",
      "Provide supervisor-to-guard ratios and inspection frequency",
    ],
    typicalBuyers: ["Federal Protective Service partners", "U.S. Marshals Service", "VA facilities", "State court systems", "Municipal governments"],
    faqs: [
      {
        q: "Can a new security company bid on federal guard contracts?",
        a: "Yes, but expect to start with state/local contracts or federal subcontracts. Federal prime contracts usually require demonstrated past performance and licensed, trained guard forces; teaming with an established prime is the most common entry path.",
      },
      {
        q: "What's the difference between armed and unarmed solicitations?",
        a: "Armed posts add firearms licensing, qualification, higher insurance, and higher SCA wage categories. Bid only what your licenses and insurance actually cover — non-compliance is grounds for rejection.",
      },
      {
        q: "How important is the staffing plan?",
        a: "It's usually the deciding technical factor. Evaluators look for realistic relief factors, named supervisors, and a credible plan for filling posts on short notice.",
      },
    ],
  },
  {
    slug: "it-services",
    name: "IT Services",
    contractNoun: "IT services contracts",
    naicsCodes: ["541512", "541511", "541519"],
    intro:
      "Government IT services contracts span help desk support, network administration, cybersecurity, cloud migration, and systems integration. Most fall under NAICS 541512 (Computer Systems Design) with a $34M size standard, keeping the field open to small businesses. Expect compliance-heavy requirements: FedRAMP for cloud, NIST 800-171/CMMC for DoD work, and Section 508 accessibility for anything user-facing.",
    commonRequirements: [
      "NIST SP 800-171 compliance / CMMC level for DoD contracts handling CUI",
      "FedRAMP-authorized cloud services for federal cloud workloads",
      "Section 508 accessibility for user-facing systems",
      "Key personnel with required certifications (Security+, CISSP, PMP, vendor certs)",
      "Service level agreements (SLAs) with response/resolution times",
      "Facility or personnel clearances on classified-adjacent work",
    ],
    documentsNeeded: [
      "Capability statement with IT past performance and certifications matrix",
      "Active SAM.gov registration under 541512/541511",
      "Key personnel resumes mapped to labor categories",
      "Relevant contract references with metrics (uptime, ticket SLAs)",
      "CMMC/NIST self-assessment documentation where applicable",
      "Price proposal by labor category (often a fully-burdened rate table)",
    ],
    proposalChecklist: [
      "Map your technical approach to every PWS/SOO task — evaluators score traceability",
      "Address security compliance explicitly (NIST controls, incident response)",
      "Include a transition-in plan with knowledge transfer milestones",
      "Name key personnel and include signed letters of commitment if required",
      "Match labor categories to the wage determination or contract vehicle rates",
      "Confirm any required contract vehicles (GSA MAS, SEWP, CIO-SP) or note open-market eligibility",
    ],
    typicalBuyers: ["DoD components", "DHS", "VA Office of Information Technology", "State CIO offices", "County and municipal IT departments"],
    faqs: [
      {
        q: "Do I need a GSA Schedule to win government IT work?",
        a: "No — plenty of IT work is solicited on the open market via SAM.gov, and agencies also buy through small business set-asides. A GSA MAS contract helps once you have past performance, but it is not a prerequisite.",
      },
      {
        q: "What is CMMC and when does it apply?",
        a: "Cybersecurity Maturity Model Certification applies to DoD contracts involving Federal Contract Information or Controlled Unclassified Information. Many DoD solicitations now require at least CMMC Level 1 self-assessment; Level 2 requires third-party assessment for CUI.",
      },
      {
        q: "How do agencies evaluate IT proposals?",
        a: "Best-value tradeoff is the norm: technical approach and key personnel usually outweigh price. Specific, metric-backed past performance (uptime, SLA attainment, migration outcomes) is the strongest differentiator.",
      },
    ],
  },
  {
    slug: "software-development",
    name: "Software Development",
    contractNoun: "software development contracts",
    naicsCodes: ["541511"],
    intro:
      "Government software development contracts fund custom applications, system modernization, API integration, and increasingly agile development services. Solicited under NAICS 541511 (Custom Computer Programming Services), they range from small purchase-card tasks to multi-year modernization programs. Agencies increasingly buy agile delivery — expect to demonstrate sprint cadence, DevSecOps practice, and user-centered design rather than just waterfall deliverables.",
    commonRequirements: [
      "Agile delivery methodology with defined ceremonies and artifacts",
      "DevSecOps pipeline with automated testing and security scanning",
      "Section 508 accessibility compliance for all interfaces",
      "NIST 800-53/800-171 security controls depending on data sensitivity",
      "Code ownership and IP terms — government usually takes unlimited rights",
      "Key personnel: technical leads with relevant stack experience",
    ],
    documentsNeeded: [
      "Capability statement highlighting shipped systems and tech stack",
      "Active SAM.gov registration under NAICS 541511",
      "Case studies or past performance with measurable outcomes",
      "Key personnel resumes and commitment letters",
      "Sample artifacts where allowed (sprint reports, release cadence metrics)",
      "Labor-category pricing or firm-fixed-price by milestone",
    ],
    proposalChecklist: [
      "Show a realistic first-90-days plan: discovery, environment access, first release",
      "Describe your definition of done including testing, security, and 508 checks",
      "Map team roles to the solicitation's labor categories or outcomes",
      "Address government IP/data rights explicitly",
      "Include a staffing contingency for key-person turnover",
      "Reference past performance with shipped, in-production systems",
    ],
    typicalBuyers: ["GSA 18F/TTS partners", "DoD software factories", "CMS and HHS", "State health and labor agencies", "City digital services teams"],
    faqs: [
      {
        q: "Can small dev shops win government software contracts?",
        a: "Yes — NAICS 541511 has a $34M size standard and agencies regularly set aside development work for small businesses. Start with smaller task orders, state/local work, or subcontracts under a modernization prime.",
      },
      {
        q: "Do agencies really buy agile development?",
        a: "Increasingly yes. Many solicitations now describe outcomes and ask offerors to propose an agile process, sometimes including a technical challenge or code sample instead of a written technical volume.",
      },
      {
        q: "Who owns the code on government contracts?",
        a: "Typically the government receives unlimited rights to custom-developed code (FAR 52.227-14). Open-source delivery is increasingly common. Price accordingly and flag any pre-existing IP in your proposal.",
      },
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    contractNoun: "construction contracts",
    naicsCodes: ["236220"],
    intro:
      "Government construction contracts cover new builds, renovations, and repairs for federal buildings, military facilities, schools, and infrastructure. Under NAICS 236220 (Commercial and Institutional Building Construction), they carry construction-specific rules: Davis-Bacon prevailing wages, bid/performance/payment bonds, and often a sealed-bid (IFB) process where the lowest responsive, responsible bidder wins. Bonding capacity is the gate that determines what size projects you can pursue.",
    commonRequirements: [
      "Bid bond (typically 20% of bid) plus performance and payment bonds at 100% of contract value",
      "Davis-Bacon Act prevailing wage compliance with certified payroll",
      "Licensed trades and state contractor licenses for the place of performance",
      "Safety program with EMR (experience modification rate) often below 1.0",
      "Buy American Act / domestic material requirements",
      "Superintendent and quality control staffing on site",
    ],
    documentsNeeded: [
      "Surety letter showing single and aggregate bonding capacity",
      "Active SAM.gov registration under NAICS 236220",
      "State contractor license(s)",
      "Safety record: EMR letter and OSHA logs",
      "Past project sheets with values, schedules, and owner references",
      "Bid schedule and any required subcontracting plan",
    ],
    proposalChecklist: [
      "Attend the pre-bid site visit and document existing conditions",
      "Verify the wage determination and build it into labor pricing",
      "Confirm bonding capacity covers the project before bidding",
      "Acknowledge every amendment — unacknowledged amendments disqualify sealed bids",
      "Submit unit prices exactly as the bid schedule requires",
      "Check small business subcontracting requirements for larger projects",
    ],
    typicalBuyers: ["U.S. Army Corps of Engineers", "NAVFAC", "GSA Public Buildings Service", "School districts", "State departments of transportation"],
    faqs: [
      {
        q: "How much bonding do I need to bid federal construction?",
        a: "The Miller Act requires performance and payment bonds on federal construction over $150,000. Your surety's single-project limit effectively caps the size you can bid. The SBA Surety Bond Guarantee program helps small contractors get bonded.",
      },
      {
        q: "What is Davis-Bacon and how does it affect my bid?",
        a: "Davis-Bacon requires paying locally prevailing wages and fringes (published in the solicitation's wage determination) on federal construction over $2,000, with certified weekly payrolls. Underpricing labor against the determination is a common fatal bid error.",
      },
      {
        q: "Are federal construction contracts always lowest-bid?",
        a: "Many are sealed-bid IFBs won by the lowest responsive bidder, but design-build and larger projects often use best-value RFPs where past performance and technical approach matter. Read Section M carefully.",
      },
    ],
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    contractNoun: "landscaping and grounds maintenance contracts",
    naicsCodes: ["561730"],
    intro:
      "Government landscaping contracts cover grounds maintenance, mowing, tree care, irrigation, and snow removal at federal installations, parks, cemeteries, and state facilities. Solicited under NAICS 561730 with an $9.5M size standard, they are accessible first contracts for small firms: recurring scopes, local performance, and frequent small-business set-asides. Agencies evaluate equipment capacity, crew scheduling, and seasonal surge ability.",
    commonRequirements: [
      "Grounds maintenance schedule meeting PWS frequencies (mowing heights, edging, fertilization)",
      "Pesticide/herbicide applicator licenses for chemical applications",
      "Equipment list adequate for the acreage and surfaces specified",
      "Service Contract Act wage compliance for laborers",
      "Snow/storm response times where included in scope",
      "Disposal and composting practices per facility rules",
    ],
    documentsNeeded: [
      "Capability statement with grounds maintenance references",
      "Active SAM.gov registration under NAICS 561720/561730",
      "State pesticide applicator licenses",
      "Equipment inventory list",
      "Insurance certificates",
      "Unit pricing per the schedule (per-acre, per-cut, or monthly)",
    ],
    proposalChecklist: [
      "Walk the site — acreage on paper rarely matches conditions on the ground",
      "Price seasonal variation realistically across base and option years",
      "Document crew size and weekly schedule per area",
      "Address irrigation system responsibilities explicitly",
      "Include licensed applicator details for chemical work",
      "Confirm disposal site arrangements and costs",
    ],
    typicalBuyers: ["National Cemetery Administration", "Military installations", "GSA facilities", "State park systems", "City public works departments"],
    faqs: [
      {
        q: "Are landscaping contracts good first government contracts?",
        a: "Yes. Scopes are familiar, performance is local, and set-asides are common. The National Cemetery Administration and military bases regularly award grounds contracts to first-time federal contractors.",
      },
      {
        q: "How is government landscaping priced?",
        a: "Usually firm-fixed-price monthly or per-service-event rates against defined frequencies, with option years. Build SCA wages, equipment depreciation, and fuel into the rate — change orders are hard to get for underpriced base work.",
      },
      {
        q: "Do I need pesticide licenses?",
        a: "If the PWS includes chemical application (weed control, fertilization, pest treatment), yes — state applicator licenses are typically required at proposal time or before performance. Subcontracting chemical work is an alternative.",
      },
    ],
  },
  {
    slug: "trucking",
    name: "Trucking & Freight",
    contractNoun: "trucking and freight contracts",
    naicsCodes: ["484110", "484121", "484220"],
    intro:
      "Government trucking contracts move freight for military logistics, USPS surface transportation, disaster response, and state highway operations (haul routes, aggregate delivery, snow operations). Authority and safety compliance dominate: an active USDOT/MC number, satisfactory safety rating, and adequate cargo insurance are entry requirements before any proposal content matters.",
    commonRequirements: [
      "Active USDOT and MC operating authority with satisfactory FMCSA safety rating",
      "Cargo insurance (often $100K+) and auto liability ($1M typical)",
      "Driver qualification files, CDLs, and drug/alcohol testing program",
      "ELD compliance and hours-of-service management",
      "TWIC cards or installation access credentials for secure facilities",
      "Equipment specifications (trailer types, capacity, age limits on some contracts)",
    ],
    documentsNeeded: [
      "FMCSA authority documentation and safety rating",
      "Certificates of insurance meeting solicitation minimums",
      "Equipment list with truck/trailer counts and specs",
      "Active SAM.gov registration under the matching 484xxx NAICS",
      "Driver roster summary and safety program description",
      "Rate schedule per the solicitation format (per-mile, per-load, hourly)",
    ],
    proposalChecklist: [
      "Verify your authority class and insurance meet the solicitation minimums exactly",
      "Price deadhead and accessorials realistically into rates",
      "Document surge capacity — government freight often spikes",
      "Address driver vetting for base/facility access requirements",
      "Show on-time performance metrics from existing operations",
      "Confirm ELD and safety compliance status (CSA scores)",
    ],
    typicalBuyers: ["USTRANSCOM and Defense Logistics Agency", "USPS surface transportation", "FEMA (disaster freight)", "State DOTs", "County road departments"],
    faqs: [
      {
        q: "How do I start hauling government freight?",
        a: "Register in SAM.gov under your 484xxx NAICS, then look at USPS surface transportation contracts, state DOT hauling, and FEMA transportation registrations. Many carriers also start as subcontractors for incumbent government freight primes.",
      },
      {
        q: "What insurance do government trucking contracts require?",
        a: "Typically $1M auto liability and $100K cargo at minimum; hazmat or specialized freight requires more. Solicitation minimums are hard requirements — certificates are checked before award.",
      },
      {
        q: "Do owner-operators qualify as small businesses?",
        a: "Yes. Trucking NAICS size standards are revenue-based (around $34-44M), so nearly all independent carriers qualify for small business set-asides.",
      },
    ],
  },
  {
    slug: "medical-supplies",
    name: "Medical Supplies",
    contractNoun: "medical supply contracts",
    naicsCodes: ["423450", "339112"],
    intro:
      "Government medical supply contracts serve the VA, Defense Health Agency, Indian Health Service, and state health systems — from exam gloves and wound care to diagnostic equipment. Distributors and manufacturers face product-specific rules: FDA registration, Trade Agreements Act country-of-origin compliance, and (for VA work especially) frequent vendor-of-record and authorized-distributor requirements.",
    commonRequirements: [
      "FDA establishment registration and device listing where applicable",
      "Trade Agreements Act (TAA) compliant country of origin for most items",
      "Authorized distributor/manufacturer letters of supply",
      "Berry Amendment compliance on some DoD textile/medical items",
      "Cold chain and lot traceability for applicable products",
      "Delivery timelines, often 10-30 days ARO with surge clauses",
    ],
    documentsNeeded: [
      "Product list with manufacturer, part numbers, and country of origin",
      "Letters of supply from manufacturers",
      "FDA registration documentation",
      "Active SAM.gov registration under 423450 or product NAICS",
      "Past performance on supply/delivery contracts",
      "Pricing per the schedule, often by line item (CLIN)",
    ],
    proposalChecklist: [
      "Verify every quoted item is TAA-compliant — non-compliant country of origin is a common rejection",
      "Secure letters of supply before quoting; agencies verify the chain",
      "Quote exact part numbers or document equal-to justification",
      "Confirm delivery timelines with your distributors before committing",
      "Check whether the buy requires VA FSS or open market eligibility",
      "Price freight and shelf-life requirements into line items",
    ],
    typicalBuyers: ["VA medical centers", "Defense Logistics Agency Troop Support", "Indian Health Service", "State public health departments", "County hospital systems"],
    faqs: [
      {
        q: "Can a distributor (non-manufacturer) sell medical supplies to the government?",
        a: "Yes, but on set-asides the SBA Nonmanufacturer Rule applies: you generally must supply the product of a small US manufacturer or obtain a waiver. Letters of supply and authorized-distributor status are routinely verified.",
      },
      {
        q: "What is TAA compliance and why does it matter?",
        a: "The Trade Agreements Act restricts most federal purchases over ~$174K to US-made or designated-country end products. Many common medical products are made in non-designated countries — verify origin per item before quoting.",
      },
      {
        q: "Is a VA Federal Supply Schedule contract required?",
        a: "Not for open-market buys, but the VA prefers FSS for many recurring medical purchases. Winning open-market and emergency buys first is a typical path while pursuing an FSS contract.",
      },
    ],
  },
  {
    slug: "catering",
    name: "Catering & Food Services",
    contractNoun: "catering and food service contracts",
    naicsCodes: ["722320", "722310"],
    intro:
      "Government catering contracts feed military exercises, conferences, training events, emergency operations, and institutional dining at state facilities. Under NAICS 722320 (Caterers) and 722310 (Food Service Contractors), they reward firms that can prove food safety compliance, scale on short notice, and handle dietary requirements. Local and state work (schools, corrections, senior programs) is a common entry point before federal events.",
    commonRequirements: [
      "Health department permits and food handler certifications (ServSafe or equivalent)",
      "HACCP-based food safety plan",
      "Menu compliance with stated nutritional or dietary requirements (halal, kosher, allergens)",
      "Insurance including product liability",
      "Delivery/service timing with setup, service, and breakdown windows",
      "Surge capacity for headcount changes on short notice",
    ],
    documentsNeeded: [
      "Business license and health permits for the place of performance",
      "Food safety certifications (ServSafe manager certificates)",
      "Sample menus with per-person pricing",
      "Active SAM.gov registration under 722320",
      "References from comparable-volume events or institutional clients",
      "Insurance certificates including product liability",
    ],
    proposalChecklist: [
      "Price per-person rates with documented headcount adjustment terms",
      "Address dietary accommodations explicitly (vegetarian, halal, allergen handling)",
      "Confirm kitchen capacity and transport hold-temperature compliance",
      "Include staffing plan for service windows",
      "Verify base/facility access requirements for staff and vehicles",
      "State your cancellation and headcount-change policy within solicitation terms",
    ],
    typicalBuyers: ["Military installations and National Guard", "FEMA and state emergency management", "Job Corps centers", "School districts", "County senior services programs"],
    faqs: [
      {
        q: "How do catering companies find government work?",
        a: "Watch SAM.gov for event and dining solicitations, register with state procurement portals for school/institutional feeding, and contact installation MWR and contracting offices directly — much catering is bought with purchase cards below formal solicitation thresholds.",
      },
      {
        q: "What food safety documentation do agencies require?",
        a: "Current health permits, certified food protection managers (ServSafe), and often a written HACCP plan. Emergency feeding contracts (FEMA, state EM) also audit kitchen capacity and transport temperature logs.",
      },
      {
        q: "How is government catering priced?",
        a: "Usually firm-fixed per-person or per-meal rates by menu tier, with guaranteed minimum headcounts. Build service labor, transport, and disposables into the per-meal rate.",
      },
    ],
  },
  {
    slug: "facilities-maintenance",
    name: "Facilities Maintenance",
    contractNoun: "facilities maintenance contracts",
    naicsCodes: ["561210", "238220"],
    intro:
      "Facilities maintenance contracts bundle HVAC, electrical, plumbing, preventive maintenance, and minor repair into ongoing operations support for government buildings. Under NAICS 561210 (Facilities Support Services), they range from single-building O&M to base operations support (BOS) contracts. Agencies evaluate your CMMS discipline, licensed trades coverage, and response-time performance for emergency calls.",
    commonRequirements: [
      "Preventive maintenance program with CMMS work-order tracking",
      "Licensed trades: HVAC (EPA 608), electrical, plumbing for the jurisdiction",
      "Emergency response times (often 1-2 hours for critical systems)",
      "Service Contract Act wage compliance by trade category",
      "Parts/materials handling with markup caps or government-furnished options",
      "Safety program including lockout/tagout and confined space procedures",
    ],
    documentsNeeded: [
      "Trade licenses for all covered disciplines",
      "Capability statement with O&M past performance",
      "CMMS description and sample reports",
      "Staffing plan by trade with on-call rotation",
      "Insurance certificates",
      "Active SAM.gov registration under 561210",
    ],
    proposalChecklist: [
      "Inventory the covered equipment list and price PM frequencies from it",
      "Show response-time capability with technician locations/on-call plan",
      "Separate firm-fixed PM pricing from IDIQ repair rates clearly",
      "Address parts markup and approval thresholds per the solicitation",
      "Map licensed trades to every system in the PWS",
      "Include QC inspections and KPI reporting cadence",
    ],
    typicalBuyers: ["GSA Public Buildings Service", "Military base operations", "VA facilities", "State university systems", "County facilities departments"],
    faqs: [
      {
        q: "What's the difference between O&M and BOS contracts?",
        a: "Operations & Maintenance covers building systems for one or a few facilities. Base Operations Support bundles many functions (maintenance, grounds, custodial, utilities) across an installation — larger, more complex, and usually requiring substantial past performance or teaming.",
      },
      {
        q: "How is facilities maintenance work priced?",
        a: "Typically a firm-fixed monthly price for preventive maintenance plus pre-priced labor rates and parts terms for repairs above a threshold. Underpricing the PM baseline is the most common new-contractor mistake.",
      },
      {
        q: "Do I need every trade license in-house?",
        a: "No — subcontracting specialty trades is normal. But the proposal must show licensed coverage for every PWS system, and prime contractors typically must self-perform a stated percentage on set-asides.",
      },
    ],
  },
];

export const STATES: StateInfo[] = [
  { slug: "texas", name: "Texas", abbr: "TX", procurementPortal: { name: "Texas SmartBuy / ESBD", url: "https://www.txsmartbuy.gov" }, note: "Texas posts state solicitations on the Electronic State Business Daily (ESBD) and runs a HUB (Historically Underutilized Business) program with subcontracting goals on most contracts over $100K. Major federal buyers include JBSA, Fort Cavazos, and a large VA footprint." },
  { slug: "california", name: "California", abbr: "CA", procurementPortal: { name: "Cal eProcure", url: "https://caleprocure.ca.gov" }, note: "California's Cal eProcure lists state bids and runs SB/DVBE certification — state agencies have a 25% small business participation goal. Federal opportunities concentrate around naval installations, federal courts, and major VA systems." },
  { slug: "florida", name: "Florida", abbr: "FL", procurementPortal: { name: "MyFloridaMarketPlace", url: "https://vendor.myfloridamarketplace.com" }, note: "Florida buys through MyFloridaMarketPlace and certifies woman-, veteran-, and minority-owned firms through the OSD. Federal demand is driven by MacDill AFB, Patrick SFB, Eglin AFB, and extensive VA facilities." },
  { slug: "virginia", name: "Virginia", abbr: "VA", procurementPortal: { name: "eVA", url: "https://eva.virginia.gov" }, note: "Virginia's eVA is one of the most active state portals, with SWaM (Small, Women-owned, and Minority-owned) certification driving set-asides. Northern Virginia is the densest federal contracting market in the country (Pentagon, DHS, intelligence community)." },
  { slug: "new-york", name: "New York", abbr: "NY", procurementPortal: { name: "New York State Contract Reporter", url: "https://www.nyscr.ny.gov" }, note: "New York advertises state work in the Contract Reporter and runs a 30% MWBE participation goal — among the highest in the nation. Federal buyers include Fort Drum, West Point, and large federal civilian offices in NYC." },
  { slug: "georgia", name: "Georgia", abbr: "GA", procurementPortal: { name: "Georgia Procurement Registry", url: "https://ssl.doas.state.ga.us/gpr/" }, note: "Georgia posts bids on the Georgia Procurement Registry (DOAS). Federal demand centers on Fort Eisenhower (cyber), Robins AFB, Fort Stewart, and the CDC in Atlanta." },
  { slug: "arizona", name: "Arizona", abbr: "AZ", procurementPortal: { name: "Arizona Procurement Portal (APP)", url: "https://app.az.gov" }, note: "Arizona buys through the Arizona Procurement Portal. Federal opportunities cluster around Luke AFB, Fort Huachuca (Army intelligence/network), Davis-Monthan AFB, and extensive land-management agencies (BLM, Forest Service)." },
  { slug: "illinois", name: "Illinois", abbr: "IL", procurementPortal: { name: "BidBuy", url: "https://www.bidbuy.illinois.gov" }, note: "Illinois uses BidBuy and a BEP (Business Enterprise Program) with aspirational goals for minority-, woman-, and veteran-owned firms. Federal buyers include Scott AFB (USTRANSCOM), Rock Island Arsenal, and the Great Lakes Naval Station." },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", procurementPortal: { name: "PA eMarketplace / JAGGAER", url: "https://www.emarketplace.state.pa.us" }, note: "Pennsylvania posts solicitations via eMarketplace and certifies small diverse businesses (SDB/VBE) through DGS. Federal demand includes the Defense Logistics Agency in Philadelphia, Tobyhanna Army Depot, and Carlisle Barracks." },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", procurementPortal: { name: "NC eProcurement (eVP)", url: "https://eprocurement.nc.gov" }, note: "North Carolina runs NC eProcurement with HUB certification through the Department of Administration. Fort Liberty, Camp Lejeune, Seymour Johnson AFB, and Cherry Point make it one of the largest military contracting states." },
];

export const NAICS_DETAIL: NaicsEntry[] = [
  {
    code: "541511",
    title: "Custom Computer Programming Services",
    industrySlug: "software-development",
    sizeStandard: "$34 million average annual receipts",
    description:
      "Covers writing, modifying, testing, and supporting custom software to meet a specific customer's needs — custom application development, systems integration coding, and web application development for government agencies.",
    whatQualifies: [
      "Custom application and web development",
      "Legacy system modernization and migration coding",
      "API development and systems integration programming",
      "Agile development teams delivering custom software",
    ],
    faqs: [
      { q: "541511 vs 541512 — which should I use?", a: "Use 541511 when the work is primarily writing custom code; 541512 when it's designing/integrating systems (which may include some development). Many IT firms register both — your SAM profile can list multiple NAICS, and the solicitation's chosen code controls the size standard." },
      { q: "What is the small business size standard for 541511?", a: "$34M in average annual receipts (5-year average). The vast majority of development shops qualify as small, which keeps set-aside competition meaningful." },
    ],
  },
  {
    code: "561720",
    title: "Janitorial Services",
    industrySlug: "janitorial-services",
    sizeStandard: "$22 million average annual receipts",
    description:
      "Covers cleaning building interiors: offices, restrooms, common areas, and specialized cleaning (carpets, windows from inside) on a contract or fee basis. The workhorse code for government custodial contracts.",
    whatQualifies: [
      "Recurring custodial/janitorial contracts in government buildings",
      "Day-porter services",
      "Post-construction and turnover cleaning",
      "Disinfection and specialized interior cleaning programs",
    ],
    faqs: [
      { q: "Is janitorial work usually set aside for small business?", a: "Frequently yes — including 8(a), HUBZone, and SDVOSB set-asides. Janitorial is one of the most common first federal contracts because agencies buy it everywhere and accept commercial past performance." },
      { q: "Does the Service Contract Act apply to 561720 contracts?", a: "Almost always on federal work over $2,500. Wage determinations set minimum wages and health & welfare benefits for custodial categories — price from the determination attached to the solicitation." },
    ],
  },
  {
    code: "236220",
    title: "Commercial and Institutional Building Construction",
    industrySlug: "construction",
    sizeStandard: "$45 million average annual receipts",
    description:
      "Covers construction (new work, additions, alterations, renovation) of commercial and institutional buildings — offices, schools, hospitals, and government facilities. The primary code for federal building construction and renovation.",
    whatQualifies: [
      "New construction of government/institutional buildings",
      "Renovation and alteration (R&A) projects",
      "Design-build of commercial-type facilities",
      "Tenant improvement and building repair projects",
    ],
    faqs: [
      { q: "What bonds are required under 236220 federal contracts?", a: "The Miller Act requires 100% performance and payment bonds on federal construction over $150K, plus bid guarantees on sealed bids. Your surety capacity effectively sets your bidding ceiling." },
      { q: "Do federal construction contracts pay prevailing wages?", a: "Yes — Davis-Bacon wage determinations apply over $2,000, with certified weekly payroll submissions. State public works typically have their own prevailing wage laws." },
    ],
  },
  {
    code: "561612",
    title: "Security Guards and Patrol Services",
    industrySlug: "security-guard-services",
    sizeStandard: "$29 million average annual receipts",
    description:
      "Covers providing guard and patrol services: protecting people and property via security personnel at facilities, events, and installations. Both armed and unarmed officer contracts fall here.",
    whatQualifies: [
      "Armed/unarmed guard posts at government facilities",
      "Mobile patrol and alarm response services",
      "Court and building entry screening support",
      "Event security for government functions",
    ],
    faqs: [
      { q: "What licensing is required to bid 561612 contracts?", a: "A state security agency license for each state of performance, individual guard licenses, and firearms permits for armed posts. Licenses are usually required at proposal submission, not just award." },
      { q: "How competitive are federal guard contracts?", a: "Competitive but heavily set aside — SDVOSB and 8(a) set-asides are common. Strong staffing math (relief factors) and verifiable training programs separate winners from low-price-only bidders." },
    ],
  },
  {
    code: "541330",
    title: "Engineering Services",
    sizeStandard: "$25.5 million average annual receipts (higher for some exceptions)",
    description:
      "Covers applying physical laws and engineering principles to design and develop structures, machines, processes, and systems — civil, mechanical, electrical engineering, and engineering studies for government infrastructure and facilities.",
    whatQualifies: [
      "Civil/structural design for public infrastructure",
      "Mechanical/electrical/plumbing (MEP) engineering",
      "Engineering studies, assessments, and inspections",
      "A&E support under Brooks Act qualifications-based selection",
    ],
    faqs: [
      { q: "How are engineering services procured federally?", a: "Architect-engineer services are selected under the Brooks Act: qualifications-based selection via SF330 submissions, with price negotiated after selection — not low-bid. Build your SF330 library early." },
      { q: "Can engineering firms also bid construction?", a: "Design firms generally can't construct what they designed on the same project (organizational conflict of interest), but design-build teaming with a constructor is common and allowed when solicited that way." },
    ],
  },
  {
    code: "541512",
    title: "Computer Systems Design Services",
    industrySlug: "it-services",
    sizeStandard: "$34 million average annual receipts",
    description:
      "Covers planning and designing computer systems that integrate hardware, software, and communications — systems integration, IT consulting, network design, and managed IT services for agencies.",
    whatQualifies: [
      "IT systems integration and architecture",
      "Network and infrastructure design/management",
      "Help desk and managed services",
      "Cloud migration planning and implementation",
    ],
    faqs: [
      { q: "Is 541512 the most common government IT code?", a: "Yes — it's the default for IT services solicitations, from help desk task orders to large integration programs. Register it in SAM alongside 541511 and 541519 to see the full opportunity stream." },
      { q: "What certifications help win 541512 work?", a: "CMMC/NIST compliance posture, ISO 9001/20000/27001 at the company level, and staff certs (Security+, CISSP, PMP, cloud certs). Many solicitations name minimum certifications for key personnel." },
    ],
  },
  {
    code: "541519",
    title: "Other Computer Related Services",
    industrySlug: "it-services",
    sizeStandard: "$34 million average annual receipts (150-employee exception for IT Value Added Resellers)",
    description:
      "The catch-all code for computer services that aren't custom programming (541511) or systems design (541512) — computer disaster recovery, software installation services, and IT support that doesn't fit the larger codes. Also home to the ITVAR exception used for hardware-plus-services buys.",
    whatQualifies: [
      "Computer disaster recovery and backup services",
      "Software installation and configuration services",
      "IT equipment-plus-integration sales under the ITVAR exception",
      "Miscellaneous computer support not covered by 541511/541512",
    ],
    faqs: [
      {
        q: "When do agencies solicit under 541519 instead of 541512?",
        a: "Most commonly for IT Value Added Reseller (ITVAR) buys — hardware or software purchases bundled with installation and support — which use a 150-employee size standard instead of receipts. Pure services work usually goes out under 541511 or 541512.",
      },
      {
        q: "Should I add 541519 to my SAM profile?",
        a: "If you do any IT services work, yes — listing 541511, 541512, and 541519 together costs nothing and ensures you appear in market research for the full IT opportunity stream. The solicitation's chosen code controls the size standard for each bid.",
      },
    ],
  },
  {
    code: "484110",
    title: "General Freight Trucking, Local",
    industrySlug: "trucking",
    sizeStandard: "$34 million average annual receipts",
    description:
      "Covers local (generally same metropolitan area) trucking of general freight: palletized goods, supplies, and equipment moved within a region. The primary code for local government hauling, base deliveries, and disaster-response freight staged near the event.",
    whatQualifies: [
      "Local delivery and hauling contracts for agencies and installations",
      "Warehouse-to-site freight movement within a metro area",
      "Disaster response freight staging and local distribution",
      "Recurring supply runs between government facilities",
    ],
    faqs: [
      {
        q: "Do I need federal operating authority for local government hauling?",
        a: "Intrastate-only carriers need state authority and a USDOT number; crossing state lines requires interstate (MC) authority. Federal solicitations typically require an active USDOT number, a satisfactory safety rating, and insurance at the solicitation's stated minimums regardless.",
      },
      {
        q: "Are owner-operators competitive on 484110 set-asides?",
        a: "Yes — the receipts-based size standard means nearly every independent carrier qualifies as small. Capacity is the usual constraint, so many owner-operators start with smaller recurring routes or sub-haul for incumbent government freight primes.",
      },
    ],
  },
  {
    code: "423450",
    title: "Medical, Dental, and Hospital Equipment and Supplies Merchant Wholesalers",
    industrySlug: "medical-supplies",
    sizeStandard: "Employee-based (wholesale trade) — verify the current count at sba.gov; the 500-employee Nonmanufacturer Rule governs most set-aside supply buys",
    description:
      "The distributor code for medical, dental, and hospital supplies sold to the VA, Defense Health Agency, Indian Health Service, and state health systems — exam gloves and wound care through diagnostic equipment. Wholesale codes use employee-based size standards rather than receipts.",
    whatQualifies: [
      "Distribution of medical consumables to government health facilities",
      "Medical equipment supply with delivery and warranty support",
      "Dental and laboratory supply contracts",
      "Emergency/surge medical supply response (FEMA, state health departments)",
    ],
    faqs: [
      {
        q: "What is the Nonmanufacturer Rule and does it apply to me?",
        a: "On set-aside supply contracts, a distributor must generally have 500 or fewer employees AND supply the product of a small US manufacturer, unless the SBA has issued a class waiver for that product. Agencies verify letters of supply — secure them before quoting.",
      },
      {
        q: "Why do medical supply quotes get rejected on country of origin?",
        a: "The Trade Agreements Act restricts most federal purchases above the threshold to US-made or designated-country products, and many common medical items are manufactured in non-designated countries. Verify TAA compliance per line item before quoting — it's the most common fatal error in this market.",
      },
    ],
  },
  {
    code: "722320",
    title: "Caterers",
    industrySlug: "catering",
    sizeStandard: "Roughly $10 million average annual receipts — verify the current figure at sba.gov",
    description:
      "Covers providing single-event food services — preparing and serving meals at a location designated by the customer. The code for government event catering, military exercise feeding, training-session meals, and emergency feeding missions.",
    whatQualifies: [
      "Event catering for agency conferences, ceremonies, and training",
      "Field feeding for military exercises and National Guard drills",
      "Emergency/disaster feeding under FEMA or state emergency management",
      "Recurring meal delivery to government programs (senior services, Job Corps)",
    ],
    faqs: [
      {
        q: "How do caterers find government work?",
        a: "Much government catering is bought below formal solicitation thresholds with purchase cards — so register in SAM.gov, then market your capability statement directly to installation contracting offices and event coordinators while watching SAM.gov and state portals for larger feeding contracts.",
      },
      {
        q: "What documentation do feeding contracts require?",
        a: "Current health permits, certified food protection managers (ServSafe or equivalent), often a written HACCP plan, and product liability insurance. Emergency feeding contracts additionally audit kitchen capacity and transport temperature control.",
      },
    ],
  },
  {
    code: "561210",
    title: "Facilities Support Services",
    industrySlug: "facilities-maintenance",
    sizeStandard: "$47 million average annual receipts",
    description:
      "Covers providing several support services within a client's facilities as a bundle — operations and maintenance, janitorial, grounds, security, and mail in one contract. The code for facility O&M and base operations support (BOS) contracts.",
    whatQualifies: [
      "Building operations & maintenance (O&M) contracts",
      "Base operations support bundling multiple facility functions",
      "Combined custodial + maintenance + grounds contracts",
      "Government facility management with CMMS work-order tracking",
    ],
    faqs: [
      {
        q: "When is work solicited under 561210 instead of a single-trade code?",
        a: "When the agency bundles multiple functions into one contract. A custodial-only contract uses 561720; custodial plus HVAC maintenance plus grounds in one PWS typically goes out under 561210. The bundle means broader licensing and staffing requirements — read the PWS scope carefully.",
      },
      {
        q: "Is the high size standard good or bad for small businesses?",
        a: "Good: at $47M in average receipts, established regional facility companies still qualify as 'small', and the government sets aside a large share of facility support work. The practical barrier is past performance breadth, which teaming or a strong subcontractor bench can solve.",
      },
    ],
  },
  {
    code: "561730",
    title: "Landscaping Services",
    industrySlug: "landscaping",
    sizeStandard: "$9.5 million average annual receipts",
    description:
      "Covers landscape care and maintenance: mowing, planting, tree/shrub care, irrigation maintenance, and seasonal grounds work for government installations, parks, and cemeteries.",
    whatQualifies: [
      "Grounds maintenance at government facilities",
      "Mowing and turf management contracts",
      "Tree trimming and removal services",
      "Irrigation maintenance and seasonal cleanup",
    ],
    faqs: [
      { q: "What's the size standard for 561730?", a: "$9.5M average annual receipts — low enough that mid-size regional firms can exceed it. Verify your 5-year average before certifying small on a set-aside." },
      { q: "Where do landscaping opportunities appear?", a: "SAM.gov for federal (cemeteries, bases, federal buildings), plus state portals and county/city sites — local grounds contracts are often simpler first wins with similar requirements." },
    ],
  },
];

/** Lightweight searchable NAICS list for the free NAICS finder tool. */
export const NAICS_SEARCH_LIST: { code: string; title: string; keywords: string }[] = [
  { code: "541511", title: "Custom Computer Programming Services", keywords: "software development coding web apps programming" },
  { code: "541512", title: "Computer Systems Design Services", keywords: "it services systems integration network managed services" },
  { code: "541519", title: "Other Computer Related Services", keywords: "it support computer services miscellaneous" },
  { code: "541330", title: "Engineering Services", keywords: "engineering civil mechanical electrical design" },
  { code: "541611", title: "Administrative Management and General Management Consulting", keywords: "management consulting business advisory" },
  { code: "541618", title: "Other Management Consulting Services", keywords: "consulting management other" },
  { code: "541690", title: "Other Scientific and Technical Consulting Services", keywords: "technical consulting scientific advisory" },
  { code: "541715", title: "R&D in Physical, Engineering, and Life Sciences", keywords: "research development R&D laboratory science" },
  { code: "541810", title: "Advertising Agencies", keywords: "advertising marketing campaigns media" },
  { code: "541613", title: "Marketing Consulting Services", keywords: "marketing consulting brand strategy" },
  { code: "541430", title: "Graphic Design Services", keywords: "graphic design branding visual creative" },
  { code: "541930", title: "Translation and Interpretation Services", keywords: "translation interpretation language" },
  { code: "561110", title: "Office Administrative Services", keywords: "office administration admin support" },
  { code: "561210", title: "Facilities Support Services", keywords: "facilities maintenance operations base support O&M" },
  { code: "561311", title: "Employment Placement Agencies", keywords: "staffing placement recruiting" },
  { code: "561320", title: "Temporary Help Services", keywords: "temp staffing temporary labor" },
  { code: "561612", title: "Security Guards and Patrol Services", keywords: "security guards patrol armed unarmed" },
  { code: "561621", title: "Security Systems Services", keywords: "security systems alarms cameras access control" },
  { code: "561720", title: "Janitorial Services", keywords: "janitorial cleaning custodial" },
  { code: "561730", title: "Landscaping Services", keywords: "landscaping grounds maintenance mowing lawn" },
  { code: "561790", title: "Other Services to Buildings and Dwellings", keywords: "building services pressure washing gutter" },
  { code: "562111", title: "Solid Waste Collection", keywords: "waste trash collection refuse hauling" },
  { code: "236220", title: "Commercial and Institutional Building Construction", keywords: "construction commercial building general contractor" },
  { code: "237310", title: "Highway, Street, and Bridge Construction", keywords: "highway road bridge paving construction" },
  { code: "238110", title: "Poured Concrete Foundation and Structure Contractors", keywords: "concrete foundation contractors" },
  { code: "238210", title: "Electrical Contractors", keywords: "electrical wiring contractors electrician" },
  { code: "238220", title: "Plumbing, Heating, and Air-Conditioning Contractors", keywords: "plumbing hvac heating air conditioning mechanical" },
  { code: "238320", title: "Painting and Wall Covering Contractors", keywords: "painting contractors wall covering" },
  { code: "238990", title: "All Other Specialty Trade Contractors", keywords: "specialty trades fencing paving misc construction" },
  { code: "484110", title: "General Freight Trucking, Local", keywords: "trucking local freight hauling delivery" },
  { code: "484121", title: "General Freight Trucking, Long-Distance, Truckload", keywords: "trucking long distance truckload freight" },
  { code: "484220", title: "Specialized Freight (except Used Goods) Trucking, Local", keywords: "specialized freight dump truck aggregate hauling" },
  { code: "485510", title: "Charter Bus Industry", keywords: "charter bus transportation passenger" },
  { code: "488510", title: "Freight Transportation Arrangement", keywords: "freight broker logistics arrangement" },
  { code: "423450", title: "Medical, Dental, and Hospital Equipment and Supplies Merchant Wholesalers", keywords: "medical supplies equipment distributor wholesale" },
  { code: "339112", title: "Surgical and Medical Instrument Manufacturing", keywords: "medical instruments surgical manufacturing" },
  { code: "722310", title: "Food Service Contractors", keywords: "food service dining cafeteria institutional" },
  { code: "722320", title: "Caterers", keywords: "catering events meals food" },
  { code: "611430", title: "Professional and Management Development Training", keywords: "training professional development courses" },
  { code: "611710", title: "Educational Support Services", keywords: "education support tutoring services" },
  { code: "624230", title: "Emergency and Other Relief Services", keywords: "emergency relief disaster services" },
  { code: "812320", title: "Drycleaning and Laundry Services (except Coin-Operated)", keywords: "laundry drycleaning linen services" },
  { code: "541214", title: "Payroll Services", keywords: "payroll accounting services" },
  { code: "541219", title: "Other Accounting Services", keywords: "accounting bookkeeping financial services" },
];

// ---- lookups ----

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function getState(slug: string): StateInfo | undefined {
  return STATES.find((s) => s.slug === slug);
}

export function getNaics(code: string): NaicsEntry | undefined {
  return NAICS_DETAIL.find((n) => n.code === code);
}

export function industriesForNaics(code: string): Industry[] {
  return INDUSTRIES.filter((i) => i.naicsCodes.includes(code));
}
