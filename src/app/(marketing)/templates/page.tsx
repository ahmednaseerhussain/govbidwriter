import Link from "next/link";
import { FileText, ListChecks, ArrowRight } from "lucide-react";
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEMPLATES } from "@/lib/seo/templates";

export const metadata = buildMetadata({
  title: "Free Government Contracting Templates",
  description:
    "Free templates for government contractors: proposal templates by industry (janitorial, security, IT, construction), past performance, quality control plan, staffing plan, capability statement, and compliance matrix.",
  path: "/templates",
});

const templates = [
  {
    href: "/government-contract-proposal-template",
    icon: FileText,
    title: "Government Contract Proposal Template",
    description:
      "All 11 sections evaluators expect — cover letter through submission checklist — with what belongs in each and the mistakes that get proposals rejected.",
    cta: "View the template",
  },
  {
    href: "/tools/rfp-compliance-matrix-generator",
    icon: ListChecks,
    title: "RFP Compliance Matrix",
    description:
      "The nine-column matrix proposal teams use to track every requirement: ID, section, page, requirement, response needed, document, priority, risk, status. Generate one from your RFP text instantly.",
    cta: "Generate from your RFP",
  },
  ...TEMPLATES.map((t) => ({
    href: `/templates/${t.slug}`,
    icon: FileText,
    title: t.name,
    description: t.metaDescription.replace(/^Free /, "").replace(/^\w/, (c) => c.toUpperCase()),
    cta: "View the template",
  })),
];

export default function TemplatesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Templates", path: "/templates" },
        ])}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Government Contracting Templates
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The documents government contractors need, structured the way
          agencies expect them — proposal templates by industry, plus the
          plans and statements solicitations demand. Each one explains what
          goes where and why, and GovBidWriter can fill them in for you.
        </p>

        <div className="mt-10 space-y-6">
          {templates.map((t) => (
            <Link key={t.href} href={t.href} className="group block">
              <Card className="transition-shadow group-hover:shadow-md">
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <t.icon className="mt-1 h-8 w-8 shrink-0 text-accent" />
                  <div>
                    <CardTitle className="text-lg group-hover:text-accent">
                      {t.title}
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="pl-[4.5rem]">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {t.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-xl font-bold text-primary">
            How these templates fit together
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Capability statement</strong> first —
              it opens conversations with contracting officers and primes before
              any solicitation exists.
            </li>
            <li>
              <strong className="text-foreground">Compliance matrix</strong> when an RFP
              lands — it tells you whether to bid and becomes your writing plan.
            </li>
            <li>
              <strong className="text-foreground">Proposal template</strong> to write the
              response — every row of the matrix maps to a section of the
              proposal.
            </li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            New to this entire process? Start with{" "}
            <Link
              href="/blog/how-to-respond-to-your-first-government-rfp"
              className="text-primary hover:underline"
            >
              How to Respond to Your First Government RFP
            </Link>
            .
          </p>
        </section>
      </section>
    </>
  );
}
