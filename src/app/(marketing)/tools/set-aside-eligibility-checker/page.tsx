import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { Button } from "@/components/ui/button";
import { SetAsideChecker } from "./checker";

export const metadata = buildMetadata({
  title: "Free Small Business Set-Aside Eligibility Checker",
  description:
    "Check which government contracting set-aside programs your business may qualify for: small business, 8(a), HUBZone, WOSB/EDWOSB, VOSB, and SDVOSB — with how to verify and certify for each.",
  path: "/tools/set-aside-eligibility-checker",
});

const faqs = [
  {
    q: "What is a set-aside contract?",
    a: "A contract that only businesses in a specific program can bid on. The federal government aims to award 23% of prime contract dollars to small businesses, with sub-goals for 8(a)/SDB (5%), women-owned (5%), service-disabled veteran-owned (5%), and HUBZone (3%) firms. Set-asides dramatically shrink your competition.",
  },
  {
    q: "Do I need to be certified to bid set-aside work?",
    a: "It depends on the program. Plain small business set-asides use SAM.gov self-certification against your NAICS size standard. WOSB, SDVOSB/VOSB, HUBZone, and 8(a) all require formal (free) SBA certification before you can win those set-asides.",
  },
  {
    q: "How long does SBA certification take?",
    a: "WOSB and VetCert typically take a few weeks to a couple of months. HUBZone runs roughly 2–3 months. 8(a) is the most involved — commonly 3–6 months with detailed financial documentation. Start certification well before you need it for a bid.",
  },
  {
    q: "Can I qualify for multiple programs at once?",
    a: "Yes, and you should certify for every program you legitimately qualify for. A woman-owned, HUBZone-located small business can pursue small business, WOSB, and HUBZone set-asides — three separate opportunity streams.",
  },
];

export default function SetAsidePage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "Set-Aside Eligibility Checker",
            description: metadata.description as string,
            path: "/tools/set-aside-eligibility-checker",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
            { name: "Set-Aside Eligibility Checker", path: "/tools/set-aside-eligibility-checker" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Set-Aside Eligibility Checker
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Set-aside programs are how small businesses beat large incumbents:
          contracts reserved exclusively for 8(a), HUBZone, woman-owned, and
          veteran-owned firms. Answer a few questions to see which programs you
          may qualify for — and exactly how to get certified.
        </p>

        <div className="mt-8">
          <SetAsideChecker />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Why set-asides matter so much
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              On an unrestricted federal solicitation you compete with everyone,
              including billion-dollar primes. On an SDVOSB set-aside, you
              compete only with other certified service-disabled veteran-owned
              small businesses — often a handful of bidders. 8(a) firms can even
              receive sole-source awards with no competition at all. For most
              small contractors, getting certified into every applicable program
              is the single highest-leverage business development step that
              exists.
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
            <h2 className="text-xl font-bold">Eligible? Get bid-ready next.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              Build your{" "}
              <Link href="/tools/capability-statement-generator" className="underline">
                capability statement
              </Link>{" "}
              with your certifications front and center, then let GovBidWriter
              turn your first RFP into a compliance matrix and draft proposal.
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
