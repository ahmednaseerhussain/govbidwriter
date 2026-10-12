import type { Metadata } from "next";
import { APP_URL } from "@/lib/utils";

const BRAND_SUFFIX = " | GovBidWriter";
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;
// Site-wide image from src/app/opengraph-image.tsx. Must be set explicitly:
// a page-level `openGraph` object replaces the inherited one, image included.
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "GovBidWriter" };

/** Trim to `max` chars on a word boundary. */
export function clampText(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/[\s,;:—-]+\S*$/, "")}…`;
}

/** First candidate title that fits in the ~60 chars Google displays. */
export function fitTitle(...candidates: (string | false | null | undefined)[]): string {
  const valid = candidates.filter((c): c is string => Boolean(c));
  return valid.find((c) => c.length <= MAX_TITLE) ?? clampText(valid[valid.length - 1], MAX_TITLE);
}

export function buildMetadata(args: {
  title: string;
  description: string;
  path: string;
  /** false → noindex,follow and should be left out of the sitemap. */
  index?: boolean;
}): Metadata {
  const url = `${APP_URL}${args.path}`;
  const description = clampText(args.description, MAX_DESCRIPTION);
  // Only append the brand when it fits in the ~60 chars Google displays.
  const fitsBrand =
    !args.title.includes("GovBidWriter") && args.title.length + BRAND_SUFFIX.length <= MAX_TITLE;
  const title = fitsBrand ? args.title : { absolute: args.title };
  return {
    title,
    description,
    alternates: { canonical: url },
    ...(args.index === false && { robots: { index: false, follow: true } }),
    openGraph: {
      title: args.title,
      description,
      url,
      siteName: "GovBidWriter",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description,
      images: [OG_IMAGE.url],
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
