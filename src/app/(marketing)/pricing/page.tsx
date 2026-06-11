import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildMetadata, JsonLd, faqJsonLd } from "@/lib/seo/meta";
import { PLANS } from "@/lib/billing/plans";

export const metadata = buildMetadata({
  title: "Pricing — Free & Pro Plans",
  description:
    "GovBidWriter pricing: start free with 3 AI generations per month, or go Pro for full proposals, complete compliance matrices, and exports. $79/month, cancel anytime.",
  path: "/pricing",
});

const comparison: { feature: string; free: string | boolean; pro: string | boolean }[] = [
  { feature: "AI generations per month", free: "3", pro: "100" },
  { feature: "RFP uploads per month", free: "1", pro: "20" },
  { feature: "RFP analysis & summary", free: true, pro: true },
  { feature: "Compliance matrix", free: "First 5 rows", pro: "Full matrix" },
  { feature: "Capability statement generator", free: true, pro: true },
  { feature: "Full proposal draft (11 sections)", free: false, pro: true },
  { feature: "Section regeneration & editing", free: true, pro: true },
  { feature: "Markdown & CSV export", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Pro is month to month — cancel from the billing page and you keep access until the end of your billing period. No long-term contracts.",
  },
  {
    q: "What counts as an AI generation?",
    a: "Each capability statement, RFP analysis, requirement extraction, or proposal section draft counts as one generation. Editing your content by hand is always free and unlimited.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Not yet — we're keeping pricing simple at launch. If annual billing matters to you, tell us and we'll prioritize it.",
  },
  {
    q: "What happens when I hit the free limit?",
    a: "Your existing content stays accessible and editable. You just can't run new AI generations until next month — or you can upgrade to Pro for instant access.",
  },
];

function Mark({ value }: { value: string | boolean }) {
  if (value === true) return <CheckCircle2 className="mx-auto h-5 w-5 text-accent" />;
  if (value === false) return <XCircle className="mx-auto h-5 w-5 text-muted-foreground/40" />;
  return <span className="text-sm font-medium">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <section className="container py-16">
        <h1 className="text-center text-4xl font-extrabold text-primary">
          Pricing that pays for itself with one win
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          A proposal consultant charges $2,000–$10,000 per response. GovBidWriter
          gives you the same structure and first draft for less than the cost of
          the coffee you&apos;d buy them.
        </p>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {Object.values(PLANS).map((plan) => (
            <Card key={plan.id} className={plan.id === "pro" ? "border-accent shadow-md" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.id === "pro" && <Badge variant="accent">Most popular</Badge>}
                </div>
                <div className="text-4xl font-bold">
                  ${plan.priceMonthly}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
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
                <Link
                  href={plan.id === "pro" ? "/dashboard/billing" : "/signup"}
                  className="mt-6 block"
                >
                  <Button className="w-full" variant={plan.id === "pro" ? "default" : "outline"}>
                    {plan.id === "pro" ? "Upgrade to Pro" : "Start free"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="p-3 text-left font-semibold">Feature</th>
                <th className="w-32 p-3 text-center font-semibold">Free</th>
                <th className="w-32 p-3 text-center font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b last:border-0">
                  <td className="p-3">{row.feature}</td>
                  <td className="p-3 text-center"><Mark value={row.free} /></td>
                  <td className="p-3 text-center"><Mark value={row.pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-primary">
            Pricing questions
          </h2>
          <div className="mt-8 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-5">
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
