import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, Ruler } from "lucide-react";
import { buildMetadata, JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { NAICS_DETAIL, getNaics, getIndustry, STATES } from "@/lib/seo/data";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return NAICS_DETAIL.map((n) => ({ code: n.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const naics = getNaics(code);
  if (!naics) return {};
  return buildMetadata({
    title: `NAICS ${naics.code} — ${naics.title} | Government Contracting Guide`,
    description: `NAICS ${naics.code} (${naics.title}) for government contractors: size standard, what qualifies, set-aside rules, and how to win contracts under this code.`,
    path: `/naics/${naics.code}`,
  });
}

export default async function NaicsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const naics = getNaics(code);
  if (!naics) notFound();

  const industry = naics.industrySlug ? getIndustry(naics.industrySlug) : undefined;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "NAICS Codes", path: "/tools/naics-code-finder" },
            { name: `NAICS ${naics.code}`, path: `/naics/${naics.code}` },
          ]),
          faqJsonLd(naics.faqs),
        ]}
      />
      <article className="container max-w-4xl py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/tools/naics-code-finder" className="hover:underline">
            NAICS Codes
          </Link>{" "}
          / {naics.code}
        </nav>

        <h1 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
          NAICS {naics.code}: {naics.title}
        </h1>

        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-muted/30 px-4 py-2 text-sm">
          <Ruler className="h-4 w-4 text-accent" />
          <span>
            <strong>Small business size standard:</strong> {naics.sizeStandard}
          </span>
        </div>

        <p className="mt-6 leading-relaxed text-muted-foreground">{naics.description}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">
            What work falls under NAICS {naics.code}
          </h2>
          <ul className="mt-4 space-y-2">
            {naics.whatQualifies.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">
            How to win contracts under this code
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
            <li>
              Register in SAM.gov with {naics.code} as a primary or secondary
              NAICS code, and confirm you&apos;re under the size standard for
              set-aside eligibility.
            </li>
            <li>
              Set a SAM.gov saved search for NAICS {naics.code} filtered to your
              set-aside types and places of performance.
            </li>
            <li>
              Build a capability statement that leads with this code and your
              most relevant past performance.
            </li>
            <li>
              For each solicitation, build a compliance matrix before writing —
              most losses under this code are compliance losses.
            </li>
          </ol>
        </section>

        <section className="my-10 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">
            Bidding on a NAICS {naics.code} solicitation?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            Generate your capability statement and compliance matrix free —
            no account required.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/tools/capability-statement-generator">
              <Button variant="accent">Capability Statement</Button>
            </Link>
            <Link href="/tools/rfp-compliance-matrix-generator">
              <Button variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                Compliance Matrix
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {naics.faqs.map((faq) => (
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
              Full industry guide:{" "}
              <Link
                href={`/government-contracts/${industry.slug}`}
                className="font-medium text-primary hover:underline"
              >
                {industry.name} Government Contracts
              </Link>
              {" — "}including state-by-state pages for{" "}
              {STATES.slice(0, 3).map((s, i) => (
                <span key={s.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={`/government-contracts/${industry.slug}/${s.slug}`}
                    className="text-primary hover:underline"
                  >
                    {s.name}
                  </Link>
                </span>
              ))}
              {", and more."}
            </p>
          )}
          <div className="mt-4">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Other NAICS guides
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {NAICS_DETAIL.filter((n) => n.code !== naics.code).map((n) => (
                <Link
                  key={n.code}
                  href={`/naics/${n.code}`}
                  className="text-sm text-primary hover:underline"
                >
                  {n.code} — {n.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
