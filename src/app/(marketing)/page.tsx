import Link from "next/link";
import {
  Upload,
  ListChecks,
  FileText,
  Download,
  ShieldCheck,
  Clock,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildMetadata, JsonLd, orgJsonLd, websiteJsonLd, faqJsonLd } from "@/lib/seo/meta";
import { PLANS } from "@/lib/billing/plans";

export const metadata = buildMetadata({
  title: "Win Government Contracts Faster with AI | GovBidWriter",
  description:
    "Upload any RFP and instantly generate a compliance matrix, proposal outline, and first draft tailored to your business. Built for US small business contractors.",
  path: "/",
});

const faqs = [
  {
    q: "How does GovBidWriter work?",
    a: "Upload an RFP PDF (or paste the text). GovBidWriter extracts every requirement into a compliance matrix, summarizes the solicitation, and drafts each section of your proposal using your company profile. You edit, verify against the official solicitation, and export.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan includes 3 AI generations per month, 1 RFP upload, and a compliance matrix preview — enough to evaluate the workflow on a real bid. No credit card required.",
  },
  {
    q: "Will the AI invent fake past performance or certifications?",
    a: "No. Generation is grounded in your company profile, and anything missing is marked with a bracketed placeholder like [INSERT: contract reference] for you to fill in. Every draft also carries a reminder to verify against the official solicitation.",
  },
  {
    q: "What types of solicitations does it handle?",
    a: "Federal RFPs, RFQs, and IFBs, plus state and local solicitations. It works best with text-based PDFs; for scanned documents you can paste the text directly.",
  },
  {
    q: "Is my RFP data secure?",
    a: "Your documents and profile are stored in your account and used only to generate your content. We never train models on your data or share it with other users.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={[orgJsonLd(), websiteJsonLd(), faqJsonLd(faqs)]} />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-secondary/60 to-background">
        <div className="container flex flex-col items-center py-20 text-center lg:py-28">
          <Badge variant="secondary" className="mb-4">
            Built for US small business contractors
          </Badge>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Win Government Contracts Faster with AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Upload any RFP and instantly generate a compliance matrix, proposal
            outline, and first draft tailored to your business.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tools/rfp-compliance-matrix-generator">
              <Button size="lg" className="w-full sm:w-auto">
                Generate Free Compliance Matrix
              </Button>
            </Link>
            <Link href="/tools/capability-statement-generator">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Create Capability Statement
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to start. No credit card required.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container py-20">
        <h2 className="text-center text-3xl font-bold text-primary">
          From 80-page RFP to submission-ready draft
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          The same workflow proposal professionals use — compressed from days
          into minutes.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Upload,
              title: "1. Upload the RFP",
              text: "Drop in the PDF or paste the text. We extract and structure the full solicitation.",
            },
            {
              icon: ListChecks,
              title: "2. Get the compliance matrix",
              text: "Every “shall” and “must” becomes a tracked requirement with section, priority, and risk.",
            },
            {
              icon: FileText,
              title: "3. Generate the draft",
              text: "All 11 proposal sections drafted from your company profile and the RFP's evaluation criteria.",
            },
            {
              icon: Download,
              title: "4. Edit and export",
              text: "Refine each section, regenerate what you don't like, and export to Markdown or CSV.",
            },
          ].map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <step.icon className="mb-2 h-8 w-8 text-accent" />
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {step.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Free tools */}
      <section className="border-y bg-muted/40 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-primary">
            Start with a free tool
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            No account needed to see how it works.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                href: "/tools/rfp-compliance-matrix-generator",
                title: "RFP Compliance Matrix Generator",
                text: "Paste RFP text and get a requirements matrix with sections, priorities, and required documents.",
              },
              {
                href: "/tools/capability-statement-generator",
                title: "Capability Statement Generator",
                text: "Answer a few questions about your company and get a structured, agency-ready capability statement.",
              },
              {
                href: "/tools/naics-code-finder",
                title: "NAICS Code Finder",
                text: "Search common government contracting NAICS codes by what your business actually does.",
              },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base group-hover:text-accent">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {tool.text}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="container py-20">
        <h2 className="text-center text-3xl font-bold text-primary">
          Why small contractors use GovBidWriter
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "Respond to more bids",
              text: "A compliance matrix that takes a proposal consultant 4 hours takes minutes. Bid on opportunities you used to skip for lack of time.",
            },
            {
              icon: ShieldCheck,
              title: "Stop losing on technicalities",
              text: "Most first-time losses are compliance losses — a missed form, an unanswered “shall”. The matrix makes every requirement visible and trackable.",
            },
            {
              icon: Target,
              title: "Write to the evaluation criteria",
              text: "Drafts are structured around Sections L and M — what evaluators actually score — not generic business-plan prose.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <item.icon className="mx-auto h-10 w-10 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-y bg-muted/40 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-primary">
            Simple pricing
          </h2>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
            {Object.values(PLANS).map((plan) => (
              <Card
                key={plan.id}
                className={plan.id === "pro" ? "border-accent shadow-md" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.id === "pro" && <Badge variant="accent">Most popular</Badge>}
                  </div>
                  <div className="text-3xl font-bold">
                    ${plan.priceMonthly}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/pricing" className="mt-6 block">
                    <Button
                      className="w-full"
                      variant={plan.id === "pro" ? "default" : "outline"}
                    >
                      {plan.id === "pro" ? "Start with Pro" : "Start free"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-20">
        <h2 className="text-center text-3xl font-bold text-primary">
          Frequently asked questions
        </h2>
        <div className="mx-auto mt-10 max-w-3xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-lg border p-5">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">
            Your next RFP doesn&apos;t have to take all weekend
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Upload it, get the compliance matrix, and have a first draft before
            your coffee gets cold.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg" variant="accent">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
