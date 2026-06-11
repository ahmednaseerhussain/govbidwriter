import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo/meta";
import { NAICS_DETAIL } from "@/lib/seo/data";
import { Button } from "@/components/ui/button";
import { NaicsFinder } from "./finder";

export const metadata = buildMetadata({
  title: "NAICS Code Finder for Government Contractors",
  description:
    "Find the right NAICS code for government contracting. Search common codes by what your business does, with size standards and set-aside guidance.",
  path: "/tools/naics-code-finder",
});

const faqs = [
  {
    q: "What is a NAICS code?",
    a: "The North American Industry Classification System code that categorizes what your business does. Every government solicitation is assigned one NAICS code, which determines the small business size standard for that buy.",
  },
  {
    q: "How many NAICS codes can my business have?",
    a: "You register one primary code in SAM.gov but can list as many secondary codes as genuinely apply. Pick the 3–6 you actually pursue — listing dozens signals inexperience to contracting officers.",
  },
  {
    q: "Why does the size standard matter?",
    a: "Each NAICS code has an SBA size standard (revenue or employee based). If your business is under it, you qualify as small for set-aside contracts under that code — often your biggest competitive advantage.",
  },
  {
    q: "What if my work spans multiple codes?",
    a: "That's normal. Use the code that matches the primary nature of each specific opportunity — the solicitation's assigned NAICS controls, and you can be small under one code and other-than-small under another.",
  },
];

export default function NaicsFinderPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "NAICS Code Finder",
            description: metadata.description as string,
            path: "/tools/naics-code-finder",
          }),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          NAICS Code Finder
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Search the NAICS codes most commonly used in government contracting by
          what your business actually does. The right code determines which
          set-asides you qualify for.
        </p>

        <div className="mt-8">
          <NaicsFinder />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Popular government contracting NAICS codes
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {NAICS_DETAIL.map((n) => (
                <Link
                  key={n.code}
                  href={`/naics/${n.code}`}
                  className="rounded-lg border p-4 transition-colors hover:border-accent"
                >
                  <div className="font-mono text-sm font-bold text-accent">{n.code}</div>
                  <div className="mt-1 text-sm font-medium">{n.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Size standard: {n.sizeStandard}
                  </div>
                </Link>
              ))}
            </div>
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
            <h2 className="text-xl font-bold">Found your code? Build your capability statement.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              A capability statement with the right NAICS codes is the first
              document every contracting officer asks for.
            </p>
            <Link href="/tools/capability-statement-generator" className="mt-4 inline-block">
              <Button variant="accent">Generate yours free</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
