import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/utils";
import { INDUSTRIES, STATES, NAICS_DETAIL, isIndexedIndustryState } from "@/lib/seo/data";
import { BLOG_POSTS } from "@/lib/seo/blog";
import { FREE_TOOLS } from "@/lib/seo/tools";
import { TEMPLATES } from "@/lib/seo/templates";

// lastmod = when each page's content last really changed. Bump the matching
// date when you edit that content — never use the build time, or Google learns
// to ignore the signal.
const UPDATED = {
  home: "2026-06-13",
  pricing: "2026-06-11",
  contact: "2026-06-12",
  proposalTemplate: "2026-06-11",
  hubs: "2026-06-13",
  tools: "2026-06-27",
  templates: "2026-06-13",
  // Award data sections (USASpending) added to industry, state and NAICS pages.
  marketData: "2026-10-12",
};

const latestBlogDate = BLOG_POSTS.map((p) => p.date).sort().at(-1) ?? UPDATED.hubs;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = (
    [
      ["", UPDATED.home],
      ["/pricing", UPDATED.pricing],
      ["/templates", UPDATED.templates],
      ["/government-contract-proposal-template", UPDATED.proposalTemplate],
      ["/blog", latestBlogDate],
      ["/contact", UPDATED.contact],
      ["/government-contracts", UPDATED.hubs],
      ["/tools", UPDATED.tools],
      ...FREE_TOOLS.map((t) => [`/tools/${t.slug}`, UPDATED.tools]),
    ] as [string, string][]
  ).map(([path, date]) => ({
    url: `${APP_URL}${path}`,
    lastModified: new Date(date),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const templatePages = TEMPLATES.map((t) => ({
    url: `${APP_URL}/templates/${t.slug}`,
    lastModified: new Date(UPDATED.templates),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const industryPages = INDUSTRIES.map((industry) => ({
    url: `${APP_URL}/government-contracts/${industry.slug}`,
    lastModified: new Date(UPDATED.marketData),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const stateHubPages = STATES.map((state) => ({
    url: `${APP_URL}/government-contracts/${state.slug}`,
    lastModified: new Date(UPDATED.hubs),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Only the industry x state pages we let Google index (see INDEXED_INDUSTRY_STATES).
  const industryStatePages = INDUSTRIES.flatMap((industry) =>
    STATES.filter((state) => isIndexedIndustryState(industry.slug, state.slug)).map((state) => ({
      url: `${APP_URL}/government-contracts/${industry.slug}/${state.slug}`,
      lastModified: new Date(UPDATED.marketData),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const naicsPages = NAICS_DETAIL.map((naics) => ({
    url: `${APP_URL}/naics/${naics.code}`,
    lastModified: new Date(UPDATED.marketData),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...templatePages,
    ...industryPages,
    ...stateHubPages,
    ...industryStatePages,
    ...naicsPages,
    ...blogPages,
  ];
}
