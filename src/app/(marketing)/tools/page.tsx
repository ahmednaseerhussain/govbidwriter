import Link from "next/link";
import {
  ListChecks,
  BadgeCheck,
  Search,
  Scale,
  History,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { buildMetadata, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { FREE_TOOLS } from "@/lib/seo/tools";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Free Government Contracting Tools",
  description:
    "8 free tools for government contractors: RFP compliance matrix generator, capability statement generator, NAICS code finder, bid/no-bid calculator, past performance writer, and more. No account required.",
  path: "/tools",
});

const ICONS = {
  ListChecks,
  BadgeCheck,
  Search,
  Scale,
  History,
  FileText,
  ClipboardCheck,
  ShieldCheck,
} as const;

const faqs = [
  {
    q: "Are these tools really free?",
    a: "Yes. Every tool on this page works without an account, subject to fair-use rate limits. A free account adds monthly quota, PDF upload, and the ability to save your results.",
  },
  {
    q: "Do I need an AI API key to use them?",
    a: "No. The tools run on GovBidWriter's servers. Outputs are AI-assisted drafts — always verify against the official solicitation before submitting anything.",
  },
  {
    q: "Is my data stored or shared?",
    a: "Tool inputs are processed to generate your output and are never shared with other users or used to train models. With an account, results are saved privately to your workspace.",
  },
  {
    q: "Which tool should I start with?",
    a: "If you have an RFP in hand, start with the Compliance Matrix Generator — it tells you what the solicitation actually requires. If you're earlier in the process, start with the Capability Statement Generator or the NAICS Code Finder.",
  },
];

export default function ToolsHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-5xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Free Government Contracting Tools
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything you need to evaluate, prepare, and respond to government
          solicitations — free, no account required. Built for US small
          business contractors.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FREE_TOOLS.map((tool) => {
            const Icon = ICONS[tool.icon];
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <Icon className="mt-1 h-7 w-7 shrink-0 text-accent" />
                    <div>
                      <CardTitle className="text-base group-hover:text-accent">
                        {tool.name}
                      </CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-[4.25rem]">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Open tool <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <section className="mt-14">
          <h2 className="text-xl font-bold text-primary">
            How the tools fit the bid process
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Before any RFP:</strong>{" "}
              find your <Link href="/tools/naics-code-finder" className="text-primary hover:underline">NAICS codes</Link>,
              check <Link href="/tools/set-aside-eligibility-checker" className="text-primary hover:underline">set-aside eligibility</Link>,
              and build your <Link href="/tools/capability-statement-generator" className="text-primary hover:underline">capability statement</Link>.
            </li>
            <li>
              <strong className="text-foreground">When an RFP lands:</strong>{" "}
              run the <Link href="/tools/bid-no-bid-calculator" className="text-primary hover:underline">bid/no-bid calculator</Link>,
              then extract the <Link href="/tools/rfp-compliance-matrix-generator" className="text-primary hover:underline">compliance matrix</Link> and
              the <Link href="/tools/proposal-checklist-generator" className="text-primary hover:underline">submission checklist</Link>.
            </li>
            <li>
              <strong className="text-foreground">While writing:</strong>{" "}
              draft <Link href="/tools/past-performance-writer" className="text-primary hover:underline">past performance</Link> and
              the <Link href="/tools/executive-summary-generator" className="text-primary hover:underline">executive summary</Link>,
              then assemble the full proposal in your{" "}
              <Link href="/signup" className="text-primary hover:underline">GovBidWriter workspace</Link>.
            </li>
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-bold text-primary">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">Want the full workflow in one place?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            A free account connects everything: upload RFP PDFs, save your
            matrices and statements, track requirement status, and generate
            full proposal drafts.
          </p>
          <Link href="/signup" className="mt-4 inline-block">
            <Button variant="accent">Create your free account</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
