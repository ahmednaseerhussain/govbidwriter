import type { Metadata } from "next";
import { APP_URL } from "@/lib/utils";

export function buildMetadata(args: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${APP_URL}${args.path}`;
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: url },
    openGraph: {
      title: args.title,
      description: args.description,
      url,
      siteName: "GovBidWriter",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
    },
  };
}

// ---- JSON-LD builders ----

export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GovBidWriter",
    url: APP_URL,
    description:
      "AI-powered RFP analysis, compliance matrices, and proposal drafting for US government contractors.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GovBidWriter",
    url: APP_URL,
  };
}

export function softwareAppJsonLd(args: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: args.name,
    description: args.description,
    url: `${APP_URL}${args.path}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${APP_URL}${item.path}`,
    })),
  };
}

/** Render-safe JSON-LD script component. */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
