import Link from "next/link";
import { buildMetadata, JsonLd, faqJsonLd, softwareAppJsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { Button } from "@/components/ui/button";
import { BidNoBidCalculator } from "./calculator";

export const metadata = buildMetadata({
  title: "Free Bid/No-Bid Calculator for Government Contracts",
  description:
    "Score whether a government opportunity is worth pursuing. Weighs experience fit, certifications, competition, complexity, deadline, and team capacity into a 0–100 bid/no-bid score with risk factors and next steps.",
  path: "/tools/bid-no-bid-calculator",
});

const faqs = [
  {
    q: "What is a bid/no-bid decision?",
    a: "A structured go/no-go evaluation done before investing proposal hours. Experienced contractors bid fewer, better-fit opportunities — a disciplined no-bid process is one of the biggest drivers of win rate.",
  },
  {
    q: "How is the score calculated?",
    a: "Six weighted factors: relevant experience (25 points), required certifications (15), competition level (15), proposal complexity (15), team availability (15), and time to deadline (15). 70+ suggests bidding, 45–69 means resolve the risks first, below 45 suggests passing.",
  },
  {
    q: "Should I always follow the recommendation?",
    a: "No — it's a decision aid, not a rule. Strategic reasons to bid anyway exist (entering a new agency, positioning for a recompete), but make those exceptions consciously rather than bidding everything by default.",
  },
  {
    q: "What's a healthy win rate for small government contractors?",
    a: "Established contractors typically win 20–40% of well-qualified pursuits. If you're winning under 10%, you're likely bidding opportunities you should no-bid — exactly what this calculator helps filter.",
  },
];

export default function BidNoBidPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareAppJsonLd({
            name: "Bid/No-Bid Calculator",
            description: metadata.description as string,
            path: "/tools/bid-no-bid-calculator",
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Free Tools", path: "/tools" },
            { name: "Bid/No-Bid Calculator", path: "/tools/bid-no-bid-calculator" },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <section className="container max-w-4xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Bid/No-Bid Calculator
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Should you pursue that opportunity? Answer seven questions and get a
          0–100 score, the risk factors working against you, and what to do
          next. The discipline that separates profitable contractors from busy
          ones.
        </p>

        <div className="mt-8">
          <BidNoBidCalculator />
        </div>

        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Why no-bid decisions win contracts
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every proposal you write costs 20–100+ hours. Spread across
              opportunities you can&apos;t realistically win, those hours produce
              nothing. Concentrated on well-qualified pursuits — where you have
              the experience, the certifications, and the time to write a
              compliant response — the same hours produce contracts. Agencies
              see the difference too: a focused proposal from a credible bidder
              reads nothing like a template blasted at every solicitation.
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
            <h2 className="text-xl font-bold">Decided to bid? Don&apos;t write blind.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
              Upload the RFP to GovBidWriter and get the full compliance
              matrix, analysis, and a structured proposal draft — free to
              start.
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
