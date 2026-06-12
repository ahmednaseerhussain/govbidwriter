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
import { FREE_TOOLS } from "@/lib/seo/tools";

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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FREE_TOOLS.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base group-hover:text-accent">
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {tool.description}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/tools"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all free tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Sample output */}
      <section className="container py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-primary">
              See what comes out the other side
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every &quot;shall&quot; and &quot;must&quot; in the solicitation becomes a tracked
              row: where it lives, what your response needs, which document it
              requires, and how risky it is for your business. This is the
              first hour of a proposal consultant&apos;s work, done in about a
              minute.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                Compliance matrix with priority and risk per requirement
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                RFP analysis: deadline, evaluation criteria, required documents
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                11-section proposal draft grounded in your company profile
              </li>
            </ul>
            <Link href="/tools/rfp-compliance-matrix-generator" className="mt-6 inline-block">
              <Button>Try it with your RFP text</Button>
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <div className="border-b bg-muted/60 px-4 py-2 text-xs font-semibold text-muted-foreground">
              Compliance matrix — sample output
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground">
                    <th className="px-3 py-2 font-medium">ID</th>
                    <th className="px-3 py-2 font-medium">Section</th>
                    <th className="px-3 py-2 font-medium">Requirement</th>
                    <th className="px-3 py-2 font-medium">Priority</th>
                    <th className="px-3 py-2 font-medium">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["R-001", "L.4.2", "Submit technical volume not exceeding 15 pages", "high", "low"],
                    ["R-002", "C.5.1", "Provide Quality Control Plan aligned to agency QASP", "high", "medium"],
                    ["R-003", "L.4.5", "Include three past performance references from last 5 years", "high", "medium"],
                    ["R-004", "C.3.2", "Staff on-site supervisor during all service hours", "medium", "low"],
                    ["R-005", "M.2.1", "Address phase-in plan with zero service disruption", "high", "medium"],
                  ].map(([id, section, req, priority, risk]) => (
                    <tr key={id} className="border-b last:border-0">
                      <td className="whitespace-nowrap px-3 py-2 font-mono">{id}</td>
                      <td className="whitespace-nowrap px-3 py-2">{section}</td>
                      <td className="px-3 py-2">{req}</td>
                      <td className="px-3 py-2">
                        <Badge variant={priority === "high" ? "destructive" : "secondary"}>
                          {priority}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant={risk === "medium" ? "secondary" : "outline"}>{risk}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-y bg-muted/40 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-primary">
            Built for the contractors who win set-asides
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Service businesses competing for federal, state, and local
            contracts — each link is a full industry guide.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { slug: "janitorial-services", label: "Janitorial contractors" },
              { slug: "it-services", label: "IT service providers" },
              { slug: "security-guard-services", label: "Security companies" },
              { slug: "construction", label: "Construction contractors" },
              { slug: "landscaping", label: "Landscaping firms" },
              { slug: "facilities-maintenance", label: "Facilities & GovCon consultants" },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/government-contracts/${item.slug}`}
                className="rounded-lg border bg-background p-4 text-sm font-medium transition-shadow hover:shadow-md hover:text-accent"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="container py-20">
        <h2 className="text-center text-3xl font-bold text-primary">
          Manual proposal writing vs. GovBidWriter
        </h2>
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold"></th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Manual</th>
                <th className="px-4 py-3 text-left font-semibold text-primary">GovBidWriter</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Compliance matrix", "3–6 hours of highlighting", "Minutes, with priority and risk"],
                ["First draft", "Days from a blank page", "11 sections from your profile"],
                ["Missed requirements", "Found by evaluators", "Tracked row by row to done"],
                ["Capability statement", "Fight with a Word template", "Generated, then versioned per agency"],
                ["Cost", "Consultants from $2,000/proposal", "Free to start, $79/mo for Pro"],
              ].map(([row, manual, gbw]) => (
                <tr key={row} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{row}</td>
                  <td className="px-4 py-3 text-muted-foreground">{manual}</td>
                  <td className="px-4 py-3">{gbw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
          GovBidWriter produces AI-assisted drafts and checklists — not legal
          advice. Your documents are stored in your account and never shared
          with other users. Always verify against the official solicitation
          before submission.
        </p>
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
