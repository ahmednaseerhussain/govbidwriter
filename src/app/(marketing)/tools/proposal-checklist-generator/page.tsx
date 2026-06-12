import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { Button } from "@/components/ui/button";
import { ChecklistTool } from "./tool";

export const metadata = buildMetadata({
  title: "Free Proposal Checklist Generator from RFP Text",
  description:
    "Paste RFP text and get a submission checklist in seconds: required documents detected in the solicitation, submission steps, deadline mentions, and final compliance checks.",
  path: "/tools/proposal-checklist-generator",
});

const faqs = [
  {
    q: "How does the checklist generator work?",
    a: "It scans your pasted text for the document and form language solicitations use — quality control plans, bonds, insurance certificates, SF forms, past performance requirements — plus deadline phrasing, and assembles them into a checkable submission list. Rule-based, so it never invents requirements.",
  },
  {
    q: "What's the difference between this and the compliance matrix?",
    a: "The checklist answers 'what do I need to assemble and submit?' The compliance matrix answers 'what must my proposal say?' — every individual 'shall' statement with priority and risk. Use the checklist for logistics and the matrix for writing.",
  },
  {
    q: "Where do proposals usually go wrong on submission?",
    a: "Late delivery (rejected, no exceptions), unacknowledged amendments, missing signatures on forms, exceeded page limits, and missing required attachments like bonding letters or certificates of insurance. Every one of these is preventable with a checklist.",
  },
  {
    q: "Which part of the RFP should I paste?",
    a: "Ideally everything, but the instructions section gives the highest yield — Section L in federal RFPs, or 'Instructions to Offerors'/'Submission Requirements' in state and local solicitations.",
  },
];

export default function ChecklistPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "Proposal Checklist Generator",
            description: metadata.description as string,
            path: "/tools/proposal-checklist-generator",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
            { name: "Proposal Checklist Generator", path: "/tools/proposal-checklist-generator" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Proposal Checklist Generator
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Most rejected proposals fail on logistics, not content. Paste your
          RFP text and get a submission checklist: every required document we
          can detect, the steps to submission, and the final checks before you
          hit send.
        </p>

        <div className="mt-8">
          <ChecklistTool />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              The submission failures that end bids
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Contracting officers reject late and non-compliant proposals
              before any evaluator reads a word — they have no discretion not
              to. An unsigned SF-1449, a missing amendment acknowledgment, a
              technical volume one page over the limit: each one can void weeks
              of work. The fix is mechanical, not creative: build the checklist
              when the RFP arrives, assign every item an owner, and verify the
              list 48 hours before the deadline, not 4.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-lg border p-4">
                  <h3 className="text-sm font-semibold">{faq.q}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-primary p-8 text-center text-primary-foreground">
            <h2 className="text-xl font-bold">Checklist done? Now the content.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              Upload the same RFP to GovBidWriter and get the requirement-level
              compliance matrix, deadline reminders, and a full proposal draft.
            </p>
            <Link href="/signup" className="mt-4 inline-block">
              <Button variant="accent">Create your free account</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
