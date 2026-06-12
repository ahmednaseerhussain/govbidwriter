import Link from "next/link";
import { DISCLAIMER } from "@/lib/utils";
import { INDUSTRIES } from "@/lib/seo/data";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-bold">GovBidWriter</div>
          <p className="mt-2 text-sm text-primary-foreground/70">
            AI-powered RFP analysis, compliance matrices, and proposal drafts
            for US government contractors.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Product
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:underline" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:underline" href="/tools">All Free Tools</Link></li>
            <li><Link className="hover:underline" href="/tools/rfp-compliance-matrix-generator">Compliance Matrix Generator</Link></li>
            <li><Link className="hover:underline" href="/tools/capability-statement-generator">Capability Statement Generator</Link></li>
            <li><Link className="hover:underline" href="/tools/naics-code-finder">NAICS Code Finder</Link></li>
            <li><Link className="hover:underline" href="/tools/bid-no-bid-calculator">Bid/No-Bid Calculator</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Resources
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:underline" href="/blog">Blog</Link></li>
            <li><Link className="hover:underline" href="/templates">Templates</Link></li>
            <li><Link className="hover:underline" href="/government-contract-proposal-template">Proposal Template</Link></li>
            <li><Link className="hover:underline" href="/government-contracts">Government Contracts by Industry</Link></li>
            <li><Link className="hover:underline" href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Popular Industries
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {INDUSTRIES.slice(0, 5).map((industry) => (
              <li key={industry.slug}>
                <Link className="hover:underline" href={`/government-contracts/${industry.slug}`}>
                  {industry.name} Contracts
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20">
        <div className="container py-6 text-xs text-primary-foreground/60">
          <p className="mb-2">{DISCLAIMER}</p>
          <p>© {new Date().getFullYear()} GovBidWriter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
