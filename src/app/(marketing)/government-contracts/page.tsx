import Link from "next/link";
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { INDUSTRIES, STATES } from "@/lib/seo/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = buildMetadata({
  title: "Government Contracts by Industry — Guides for Small Business",
  description:
    "Practical guides to winning government contracts in 10 industries: requirements, documents, proposal checklists, and NAICS codes for small business contractors.",
  path: "/government-contracts",
});

export default function GovernmentContractsIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Government Contracts", path: "/government-contracts" },
        ])}
      />
      <section className="container max-w-5xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Government Contracts by Industry
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          What it actually takes to win government work in your industry: the
          requirements agencies enforce, the documents you need ready, and a
          proposal checklist built from how these contracts are really
          evaluated.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {INDUSTRIES.map((industry) => (
            <Link key={industry.slug} href={`/government-contracts/${industry.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-accent">
                    {industry.name} Government Contracts
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {industry.naicsCodes.map((code) => (
                      <Badge key={code} variant="secondary">NAICS {code}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {industry.intro.split(".")[0]}.
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-xl font-bold text-primary">Browse by state</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every state hub covers where bids are posted, vendor registration,
            and links to all ten industry guides for that state:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/government-contracts/${state.slug}`}
                className="rounded-full border px-3 py-1 text-sm hover:border-accent hover:text-accent"
              >
                {state.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
