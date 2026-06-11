import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, FileText, ClipboardList } from "lucide-react";
import { buildMetadata, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { INDUSTRIES, STATES, getIndustry, NAICS_DETAIL } from "@/lib/seo/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return buildMetadata({
    title: `${industry.name} Government Contracts — How to Win Them`,
    description: `How small businesses win ${industry.contractNoun}: requirements, documents needed, proposal checklist, NAICS ${industry.naicsCodes[0]}, and who buys.`,
    path: `/government-contracts/${industry.slug}`,
  });
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const relatedNaics = NAICS_DETAIL.filter((n) =>
    industry.naicsCodes.includes(n.code)
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Government Contracts", path: "/government-contracts" },
            { name: industry.name, path: `/government-contracts/${industry.slug}` },
          ]),
          faqJsonLd(industry.faqs),
        ]}
      />
      <article className="container max-w-4xl py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/government-contracts" className="hover:underline">
            Government Contracts
          </Link>{" "}
          / {industry.name}
        </nav>

        <h1 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
          {industry.name} Government Contracts
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {industry.naicsCodes.map((code) => (
            <Link key={code} href={`/naics/${code}`}>
              <Badge variant="secondary" className="hover:bg-accent hover:text-accent-foreground">
                NAICS {code}
              </Badge>
            </Link>
          ))}
        </div>

        <p className="mt-6 leading-relaxed text-muted-foreground">{industry.intro}</p>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
            <ClipboardList className="h-6 w-6 text-accent" />
            Common requirements in {industry.contractNoun}
          </h2>
          <ul className="mt-4 space-y-2">
            {industry.commonRequirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {req}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
            <FileText className="h-6 w-6 text-accent" />
            Documents you&apos;ll need ready
          </h2>
          <ul className="mt-4 space-y-2">
            {industry.documentsNeeded.map((doc) => (
              <li key={doc} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {doc}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Proposal checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
            {industry.proposalChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Who buys {industry.name.toLowerCase()}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {industry.typicalBuyers.map((buyer) => (
              <Badge key={buyer} variant="outline">{buyer}</Badge>
            ))}
          </div>
        </section>

        <section className="my-10 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">
            Responding to a {industry.name.toLowerCase()} RFP right now?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            Paste the solicitation into the free compliance matrix generator and
            see every requirement in under a minute.
          </p>
          <Link href="/tools/rfp-compliance-matrix-generator" className="mt-4 inline-block">
            <Button variant="accent">Generate Free Compliance Matrix</Button>
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {industry.faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-primary">
            {industry.name} contracts by state
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/government-contracts/${industry.slug}/${state.slug}`}
                className="rounded-full border px-3 py-1 text-sm hover:border-accent hover:text-accent"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </section>

        {relatedNaics.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-primary">Related NAICS guides</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {relatedNaics.map((n) => (
                <li key={n.code}>
                  <Link href={`/naics/${n.code}`} className="text-primary hover:underline">
                    NAICS {n.code} — {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 border-t pt-6">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            More industries
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {INDUSTRIES.filter((i) => i.slug !== industry.slug)
              .slice(0, 6)
              .map((i) => (
                <Link
                  key={i.slug}
                  href={`/government-contracts/${i.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {i.name}
                </Link>
              ))}
          </div>
        </section>
      </article>
    </>
  );
}
