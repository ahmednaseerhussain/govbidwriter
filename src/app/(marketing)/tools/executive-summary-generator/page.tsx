import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { Button } from "@/components/ui/button";
import { ExecutiveSummaryTool } from "./tool";

export const metadata = buildMetadata({
  title: "Free Executive Summary Generator for Government Proposals",
  description:
    "Generate a proposal executive summary from the RFP's key points and your company strengths: need, solution, discriminators, and confidence close — the structure evaluators expect.",
  path: "/tools/executive-summary-generator",
});

const faqs = [
  {
    q: "What should a proposal executive summary contain?",
    a: "Four things, in order: proof you understand the agency's actual need, your solution approach at a glance, two or three discriminators with evidence, and a confident close. One to two pages for most proposals — it's a persuasion document, not a table of contents.",
  },
  {
    q: "When should I write the executive summary?",
    a: "Draft it early to align your win themes, then rewrite it last when you know what the proposal actually says. The version evaluators read should reflect your final solution and themes, not your day-one guesses.",
  },
  {
    q: "Do evaluators actually read executive summaries?",
    a: "Yes — often first, and sometimes it's the only section senior decision-makers read in full. It sets the frame for how the rest of your proposal is scored. A generic summary wastes the highest-attention real estate you have.",
  },
  {
    q: "Why does the output have bracketed placeholders?",
    a: "The generator never invents facts. Where a strong summary needs a specific you didn't provide — a metric, a contract name — it inserts [INSERT: …] so you fill in real evidence instead of submitting AI guesses.",
  },
];

export default function ExecutiveSummaryPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "Executive Summary Generator",
            description: metadata.description as string,
            path: "/tools/executive-summary-generator",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
            { name: "Executive Summary Generator", path: "/tools/executive-summary-generator" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Executive Summary Generator
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The executive summary is the most-read page of your proposal.
          Describe what the RFP asks for and what makes your company the right
          choice, and get a structured draft: need → solution → discriminators
          → close.
        </p>

        <div className="mt-8">
          <ExecutiveSummaryTool />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              What separates winning summaries
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Losing executive summaries talk about the bidder: history,
              mission statements, generic capabilities. Winning ones talk about
              the agency&apos;s problem and de-risk the award decision: here is what
              you need, here is how we deliver it, here is the evidence we&apos;ve
              done it before. Mirror the evaluation criteria&apos;s language —
              evaluators literally score against those words — and make every
              claim specific enough to verify.
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
            <h2 className="text-xl font-bold">Generate the other ten sections too</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              Upload the actual RFP and GovBidWriter drafts the full proposal —
              technical approach, management plan, past performance, and more —
              grounded in the real requirements and your company profile.
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
