import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { INDUSTRIES, STATES, type StateInfo } from "@/lib/seo/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** State hub page: /government-contracts/[state] — lists every industry guide for that state. */
export function StateHub({ state }: { state: StateInfo }) {
  const faqs = [
    {
      q: `Where do I find government contract bids in ${state.name}?`,
      a: `Three places: SAM.gov for federal contracts performed in ${state.name} (filter by place of performance), ${state.procurementPortal.name} for ${state.name} state agency contracts, and individual county/city/school-district portals for local work. Register with all three levels that match your service area.`,
    },
    {
      q: `Do I need to register before bidding in ${state.name}?`,
      a: `Federal bids require an active SAM.gov registration (free, allow up to two weeks). ${state.name} state bids require vendor registration on ${state.procurementPortal.name}. Local governments usually have their own quick vendor registration.`,
    },
    {
      q: `Are there small business preferences in ${state.name}?`,
      a: state.note,
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Government Contracts", path: "/government-contracts" },
            { name: state.name, path: `/government-contracts/${state.slug}` },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <article className="container max-w-4xl py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/government-contracts" className="hover:underline">
            Government Contracts
          </Link>{" "}
          / {state.name}
        </nav>

        <h1 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
          Government Contracts in {state.name}
        </h1>
        <div className="mt-3">
          <Badge variant="outline">
            <MapPin className="mr-1 h-3 w-3" /> {state.abbr}
          </Badge>
        </div>

        <p className="mt-6 leading-relaxed text-muted-foreground">
          {state.note} Below are practical, industry-specific guides to winning
          government work in {state.name} — each covers the requirements
          agencies enforce, the documents to prepare, and a proposal checklist.
        </p>

        <section className="mt-8 rounded-lg border bg-muted/30 p-6">
          <h2 className="text-xl font-bold text-primary">
            {state.name}&apos;s procurement portal
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            State agency solicitations are posted on{" "}
            {state.procurementPortal.name}. Register as a vendor there to bid
            on {state.name} state contracts.
          </p>
          <a
            href={state.procurementPortal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {state.procurementPortal.name}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">
            {state.name} contract guides by industry
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {INDUSTRIES.map((industry) => (
              <Link
                key={industry.slug}
                href={`/government-contracts/${industry.slug}/${state.slug}`}
                className="group"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base group-hover:text-accent">
                      {industry.name} in {state.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    NAICS {industry.naicsCodes.join(", ")}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="my-10 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">
            Responding to a {state.name} solicitation?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            Paste it into the free compliance matrix generator and see every
            requirement in under a minute.
          </p>
          <Link href="/tools/rfp-compliance-matrix-generator" className="mt-4 inline-block">
            <Button variant="accent">Generate Free Compliance Matrix</Button>
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">
            Frequently asked questions
          </h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t pt-6">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Other states
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {STATES.filter((s) => s.slug !== state.slug).map((s) => (
              <Link
                key={s.slug}
                href={`/government-contracts/${s.slug}`}
                className="text-sm text-primary hover:underline"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
