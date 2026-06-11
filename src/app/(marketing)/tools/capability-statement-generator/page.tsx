import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo/meta";
import { Button } from "@/components/ui/button";
import { CapStatementTool } from "./tool";

export const metadata = buildMetadata({
  title: "Free Capability Statement Generator for Government Contractors",
  description:
    "Generate a government-ready capability statement in about a minute. Structured for contracting officers: core competencies, differentiators, past performance, NAICS codes.",
  path: "/tools/capability-statement-generator",
});

const faqs = [
  {
    q: "What is a capability statement?",
    a: "A one-page document — the government contracting version of a resume — that tells a contracting officer who you are, what you do, and why you're credible. Agencies request it for vendor outreach, market research, and small purchases.",
  },
  {
    q: "Is this generator really free?",
    a: "Yes. The public tool is free with a per-hour usage cap. A free account adds a saved company profile, regeneration per target agency, and monthly quota.",
  },
  {
    q: "What should a capability statement include?",
    a: "Five sections: company overview, core competencies, differentiators, past performance, and company data (UEI, CAGE, NAICS codes, certifications) with a direct contact block.",
  },
  {
    q: "Will it invent fake past performance?",
    a: "No. The generator only uses what you provide. If you don't list past performance, it writes transferable-experience statements instead of fabricating contracts.",
  },
];

export default function CapabilityStatementToolPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "Capability Statement Generator",
            description: metadata.description as string,
            path: "/tools/capability-statement-generator",
          }),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Free Capability Statement Generator
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Answer a few questions about your company and get a structured,
          agency-ready capability statement — core competencies,
          differentiators, past performance, and contact block — in about a
          minute.
        </p>

        <div className="mt-8">
          <CapStatementTool />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Why you need a capability statement
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Contracting officers and small business specialists ask for a
              capability statement before almost any conversation. It&apos;s how
              agencies do market research, how primes evaluate subcontractors,
              and how purchases under the simplified acquisition threshold get
              sourced — often without a formal solicitation ever being posted.
              A clear one-pager with your NAICS codes, certifications, and UEI
              makes you actionable; a generic brochure gets filed and forgotten.
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
            <h2 className="text-xl font-bold">
              Next step: turn an RFP into a compliance matrix
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              The capability statement opens doors. Winning the contract takes a
              compliant proposal — start with the free compliance matrix
              generator.
            </p>
            <Link href="/tools/rfp-compliance-matrix-generator" className="mt-4 inline-block">
              <Button variant="accent">Try the Compliance Matrix Generator</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
