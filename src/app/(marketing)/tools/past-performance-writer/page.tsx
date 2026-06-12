import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { Button } from "@/components/ui/button";
import { PastPerformanceTool } from "./tool";

export const metadata = buildMetadata({
  title: "Free Past Performance Writer for Government Proposals",
  description:
    "Turn project history into proposal-ready past performance: a full CPARS-style paragraph, a short capability statement version, and a reference block — from a simple form. Commercial projects count.",
  path: "/tools/past-performance-writer",
});

const faqs = [
  {
    q: "I've never had a government contract — do I have past performance?",
    a: "Yes. Agencies accept relevant commercial work: if you've cleaned hospitals, built networks, or run security for a stadium, that's past performance. The key is framing it around scope, scale, and measurable outcomes — exactly what this tool does.",
  },
  {
    q: "What makes past performance 'strong' to an evaluator?",
    a: "Relevance (similar scope and size), recency (typically last 3–5 years), and verifiable outcomes (metrics, renewals, reference contacts). 'We did a great job' scores poorly; '24 months, zero missed services, 100% inspection pass rate' scores well.",
  },
  {
    q: "How many past performance references do proposals require?",
    a: "Most solicitations ask for 3–5 references from the last 3–5 years. Read the instructions carefully — many specify minimum contract values, required forms, or past performance questionnaires your clients must complete.",
  },
  {
    q: "What if I'm missing details like the contract value?",
    a: "The tool inserts bracketed placeholders like [INSERT: contract value] rather than inventing numbers. Fill them from your records — never guess on facts an agency can verify.",
  },
];

export default function PastPerformancePage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "Past Performance Writer",
            description: metadata.description as string,
            path: "/tools/past-performance-writer",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
            { name: "Past Performance Writer", path: "/tools/past-performance-writer" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Past Performance Writer
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Describe a project you&apos;ve done — government or commercial — and get
          three proposal-ready versions: a full write-up structured the way
          evaluators read, a short version for your capability statement, and a
          reference block for past performance volumes.
        </p>

        <div className="mt-8">
          <PastPerformanceTool />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              The structure evaluators look for
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Strong past performance write-ups follow a pattern: what the work
              was (scope and scale), why it&apos;s relevant to this solicitation, how
              you executed (staffing, quality control, communication), and what
              the measurable result was. Evaluators must defend their scores in
              writing, so give them defensible facts — durations, percentages,
              renewal counts, inspection results — not adjectives.
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
            <h2 className="text-xl font-bold">Build the rest of the proposal too</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              With a free account, your past performance lives in your company
              profile — and GovBidWriter drafts all 11 proposal sections from
              it, grounded in the actual RFP.
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
