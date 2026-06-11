import Link from "next/link";
import { buildMetadata, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { PROPOSAL_SECTION_DEFS } from "@/lib/proposal-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Government Contract Proposal Template (11 Sections, Free)",
  description:
    "A free government contract proposal template with all 11 sections evaluators expect — cover letter through submission checklist — with guidance for each.",
  path: "/government-contract-proposal-template",
});

const faqs = [
  {
    q: "Does every government proposal need all 11 sections?",
    a: "No — always follow the solicitation's Section L (or 'Instructions to Offerors') exactly. This template covers the sections most RFPs request; cut or merge to match what the solicitation actually asks for. Extra unrequested volumes can even count against page limits.",
  },
  {
    q: "How long should a government proposal be?",
    a: "Exactly as long as the solicitation allows. Page limits are strictly enforced — content beyond the limit is typically not read or causes rejection. With no stated limit, 10–25 pages of technical content fits most small contracts.",
  },
  {
    q: "Should I write the Executive Summary first or last?",
    a: "Last. It should summarize the win themes that emerged while writing the technical and management sections, mapped to the evaluation criteria in Section M.",
  },
  {
    q: "Can AI write my proposal?",
    a: "AI can produce a strong, structured first draft grounded in your company profile — that's exactly what GovBidWriter does. You must still verify every fact, tailor claims to your real past performance, and check the final document against the official solicitation.",
  },
];

const sectionDetails: Record<string, string[]> = {
  "Cover Letter": [
    "Solicitation number and title, exactly as published",
    "A one-sentence compliance statement ('This proposal complies with all requirements of...')",
    "UEI, CAGE code, and business size/set-aside status",
    "Authorized signer with direct contact info",
  ],
  "Executive Summary": [
    "Open with the agency's mission need, not your company history",
    "One win theme per evaluation factor from Section M",
    "Quantified proof points (metrics, contract outcomes)",
    "Keep it to one page unless instructed otherwise",
  ],
  "Understanding of Requirements": [
    "Restate the scope in your own words — never copy-paste the PWS",
    "Name the operational challenges the agency faces",
    "Show familiarity with the environment (site, systems, population served)",
  ],
  "Technical Approach": [
    "Mirror the PWS/SOW task structure so evaluators can trace coverage",
    "For each task: method, tools, standards, and quality checkpoints",
    "State assumptions explicitly rather than leaving gaps",
  ],
  "Management Approach": [
    "Org chart with names where possible, roles where not",
    "Communication cadence with the CO/COR (reports, meetings, escalation)",
    "Phase-in/transition plan with a day-by-day first 30 days",
  ],
  "Staffing Plan": [
    "Key personnel with qualifications mapped to solicitation requirements",
    "Staffing math: coverage, relief factors, surge capacity",
    "Recruiting pipeline and retention practices",
  ],
  "Quality Control Plan": [
    "Inspection schedule tied to the PWS performance standards",
    "Metrics you'll track and report",
    "Deficiency identification and corrective action loop",
  ],
  "Past Performance": [
    "2–4 contracts of similar scope/size from the last 3 years",
    "For each: customer, period, value range, scope, outcome, reference contact",
    "No federal work? Use state/local or commercial contracts with measurable results",
  ],
  "Risk Management": [
    "3–5 risks specific to this contract (not generic boilerplate)",
    "For each: likelihood, impact, and a mitigation you own",
  ],
  "Pricing Narrative": [
    "Basis of estimate: how you built the price (wage determinations, materials, escalation)",
    "Assumptions and exclusions, clearly stated",
    "Detailed rates belong in the separate pricing volume if one is required",
  ],
  "Submission Checklist": [
    "Every required form (SF-1449/SF-33, reps & certs) — signed",
    "All amendments acknowledged",
    "Page limits, fonts, and margins verified against Section L",
    "Submission method, address, and deadline confirmed; submit early",
  ],
};

export default function ProposalTemplatePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/templates" },
            { name: "Proposal Template", path: "/government-contract-proposal-template" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <article className="container max-w-4xl py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/templates" className="hover:underline">Templates</Link> / Proposal Template
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
          Government Contract Proposal Template
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          The 11 sections evaluators expect in a government proposal, in the
          order they expect them — with what belongs in each. This is the same
          structure GovBidWriter uses to generate drafts.
        </p>

        <div className="mt-8 space-y-4">
          {PROPOSAL_SECTION_DEFS.map((section, i) => (
            <Card key={section.title}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {i + 1}. {section.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{section.guidance}</p>
              </CardHeader>
              {sectionDetails[section.title] && (
                <CardContent>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {sectionDetails[section.title].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <section className="my-12 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">
            Skip the blank page entirely
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            GovBidWriter fills this exact template from your company profile and
            the RFP you upload — all 11 sections, drafted and editable.
          </p>
          <Link href="/signup" className="mt-4 inline-block">
            <Button variant="accent">Generate a draft from your RFP</Button>
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 border-t pt-6 text-sm">
          Related:{" "}
          <Link href="/tools/rfp-compliance-matrix-generator" className="text-primary hover:underline">
            Compliance Matrix Generator
          </Link>
          {" · "}
          <Link href="/tools/capability-statement-generator" className="text-primary hover:underline">
            Capability Statement Generator
          </Link>
          {" · "}
          <Link href="/blog/how-to-respond-to-your-first-government-rfp" className="text-primary hover:underline">
            How to Respond to Your First Government RFP
          </Link>
        </section>
      </article>
    </>
  );
}
