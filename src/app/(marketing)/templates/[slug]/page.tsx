import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { buildMetadata, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { TEMPLATES, getTemplate } from "@/lib/seo/templates";
import { getIndustry } from "@/lib/seo/data";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};
  return buildMetadata({
    title: template.metaTitle,
    description: template.metaDescription,
    path: `/templates/${template.slug}`,
  });
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const industry = template.relatedIndustrySlug
    ? getIndustry(template.relatedIndustrySlug)
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/templates" },
            { name: template.name, path: `/templates/${template.slug}` },
          ]),
          faqJsonLd(template.faqs),
        ]}
      />
      <article className="container max-w-4xl py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/templates" className="hover:underline">
            Templates
          </Link>{" "}
          / {template.name}
        </nav>

        <h1 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
          {template.name}
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{template.intro}</p>

        <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm">
          <strong>Who this is for:</strong>{" "}
          <span className="text-muted-foreground">{template.whoFor}</span>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Template structure</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use these sections as your document outline — each block explains
            what evaluators expect to find there.
          </p>
          <div className="mt-5 space-y-4">
            {template.sections.map((section) => (
              <div key={section.title} className="rounded-lg border p-5">
                <h3 className="font-semibold">{section.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Tips that win</h2>
          <ul className="mt-4 space-y-2">
            {template.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="my-10 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">
            Don&apos;t fill this in by hand
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            GovBidWriter drafts these documents from your company profile and
            the actual RFP — grounded in the real requirements, with
            placeholders where your facts are needed. Free to start.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href={template.cta.href}>
              <Button variant="accent">{template.cta.label}</Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Create free account
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {template.faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t pt-6">
          {industry && (
            <p className="text-sm">
              Bidding in this industry? Read the full guide:{" "}
              <Link
                href={`/government-contracts/${industry.slug}`}
                className="font-medium text-primary hover:underline"
              >
                {industry.name} Government Contracts
              </Link>
            </p>
          )}
          <div className="mt-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Other templates
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="/government-contract-proposal-template"
                className="text-sm text-primary hover:underline"
              >
                Government Contract Proposal Template
              </Link>
              {TEMPLATES.filter((t) => t.slug !== template.slug).map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
