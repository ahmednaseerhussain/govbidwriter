import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo/meta";
import { Button } from "@/components/ui/button";
import { MatrixTool } from "./tool";

export const metadata = buildMetadata({
  title: "Free RFP Compliance Matrix Generator",
  description:
    "Paste RFP text and instantly extract every requirement into a compliance matrix — sections, page references, priorities, risks, and required documents.",
  path: "/tools/rfp-compliance-matrix-generator",
});

const faqs = [
  {
    q: "What is an RFP compliance matrix?",
    a: "A table with one row per requirement in a solicitation: where it appears, what it demands, what your response must include, and its status. Proposal teams use it as an outline, assignment tracker, and final pre-submission check.",
  },
  {
    q: "How does the generator find requirements?",
    a: "It analyzes the text for binding language — 'shall', 'must', 'will provide' — plus submission instructions, formatting rules, and eligibility requirements, then assigns each a priority and execution risk.",
  },
  {
    q: "Can I upload a PDF instead of pasting text?",
    a: "PDF upload is available with a free account, which also saves your matrices and lets you track requirement status through proposal writing.",
  },
  {
    q: "Should I trust the matrix blindly?",
    a: "No — treat it as a fast first pass. Always verify the matrix against the official solicitation before submission; amendments and Q&A documents can change requirements.",
  },
];

export default function MatrixToolPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "RFP Compliance Matrix Generator",
            description: metadata.description as string,
            path: "/tools/rfp-compliance-matrix-generator",
          }),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-5xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Free RFP Compliance Matrix Generator
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Paste solicitation text below and get a requirements matrix in under a
          minute: every &quot;shall&quot; and &quot;must&quot;, with sections, priorities, risks,
          and required documents. The same first step proposal consultants
          charge thousands for.
        </p>

        <div className="mt-8">
          <MatrixTool />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Why compliance matrices win contracts
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Most first-time government proposals lose on compliance, not
              quality: a missing form, an unacknowledged amendment, an
              unanswered requirement buried on page 47. Evaluators are required
              to check compliance before they score anything — a single missed
              &quot;shall&quot; statement can make an otherwise excellent proposal
              unawardable. The matrix turns an 80-page document into a checklist
              you can actually verify before you hit send.
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
            <h2 className="text-xl font-bold">From matrix to full proposal draft</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              With a free account, GovBidWriter analyzes the whole RFP, tracks
              requirement status, and drafts all 11 proposal sections from your
              company profile.
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
