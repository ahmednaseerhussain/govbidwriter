import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import { buildMetadata, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { INDUSTRIES, STATES, getIndustry, getState } from "@/lib/seo/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return INDUSTRIES.flatMap((industry) =>
    STATES.map((state) => ({ industry: industry.slug, state: state.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string; state: string }>;
}): Promise<Metadata> {
  const { industry: iSlug, state: sSlug } = await params;
  const industry = getIndustry(iSlug);
  const state = getState(sSlug);
  if (!industry || !state) return {};
  return buildMetadata({
    title: `${industry.name} Government Contracts in ${state.name}`,
    description: `Win ${industry.contractNoun} in ${state.name}: where bids are posted, state registration via ${state.procurementPortal.name}, requirements, and a proposal checklist.`,
    path: `/government-contracts/${industry.slug}/${state.slug}`,
  });
}

export default async function IndustryStatePage({
  params,
}: {
  params: Promise<{ industry: string; state: string }>;
}) {
  const { industry: iSlug, state: sSlug } = await params;
  const industry = getIndustry(iSlug);
  const state = getState(sSlug);
  if (!industry || !state) notFound();

  const stateFaqs = [
    {
      q: `Where are ${industry.name.toLowerCase()} bids posted in ${state.name}?`,
      a: `Federal opportunities performed in ${state.name} are posted on SAM.gov (filter by place of performance). State-level work is posted on ${state.procurementPortal.name}, and counties, cities, and school districts run their own portals — register with the largest ones in your service area.`,
    },
    {
      q: `Do I need to register with the state of ${state.name} to bid?`,
      a: `For ${state.name} state agency contracts, yes — register as a vendor on ${state.procurementPortal.name}. Federal contracts performed in ${state.name} only require SAM.gov registration, though state small-business certifications can still help with subcontracting.`,
    },
    ...industry.faqs.slice(0, 2),
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Government Contracts", path: "/government-contracts" },
            { name: industry.name, path: `/government-contracts/${industry.slug}` },
            { name: state.name, path: `/government-contracts/${industry.slug}/${state.slug}` },
          ]),
          faqJsonLd(stateFaqs),
        ]}
      />
      <article className="container max-w-4xl py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/government-contracts" className="hover:underline">
            Government Contracts
          </Link>{" "}
          /{" "}
          <Link href={`/government-contracts/${industry.slug}`} className="hover:underline">
            {industry.name}
          </Link>{" "}
          / {state.name}
        </nav>

        <h1 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
          {industry.name} Government Contracts in {state.name}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {industry.naicsCodes.map((code) => (
            <Link key={code} href={`/naics/${code}`}>
              <Badge variant="secondary" className="hover:bg-accent hover:text-accent-foreground">
                NAICS {code}
              </Badge>
            </Link>
          ))}
          <Badge variant="outline">
            <MapPin className="mr-1 h-3 w-3" /> {state.abbr}
          </Badge>
        </div>

        <p className="mt-6 leading-relaxed text-muted-foreground">{industry.intro}</p>

        <section className="mt-8 rounded-lg border bg-muted/30 p-6">
          <h2 className="text-xl font-bold text-primary">
            Selling to government in {state.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{state.note}</p>
          <a
            href={state.procurementPortal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {state.procurementPortal.name} — {state.name}&apos;s procurement portal
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">
            Requirements to expect
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
          <h2 className="text-2xl font-bold text-primary">Documents to prepare</h2>
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

        <section className="my-10 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">
            Found a {state.name} solicitation worth bidding?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            Paste it into the free compliance matrix generator and see every
            requirement before you commit the weekend to it.
          </p>
          <Link href="/tools/rfp-compliance-matrix-generator" className="mt-4 inline-block">
            <Button variant="accent">Generate Free Compliance Matrix</Button>
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {stateFaqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 border-t pt-6 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              {industry.name} in other states
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATES.filter((s) => s.slug !== state.slug).map((s) => (
                <Link
                  key={s.slug}
                  href={`/government-contracts/${industry.slug}/${s.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Other industries in {state.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {INDUSTRIES.filter((i) => i.slug !== industry.slug)
                .slice(0, 6)
                .map((i) => (
                  <Link
                    key={i.slug}
                    href={`/government-contracts/${i.slug}/${state.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {i.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
