import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/utils";
import { INDUSTRIES, STATES, NAICS_DETAIL } from "@/lib/seo/data";
import { BLOG_POSTS } from "@/lib/seo/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    "",
    "/pricing",
    "/templates",
    "/government-contract-proposal-template",
    "/blog",
    "/government-contracts",
    "/tools/capability-statement-generator",
    "/tools/rfp-compliance-matrix-generator",
    "/tools/naics-code-finder",
  ].map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const industryPages = INDUSTRIES.map((industry) => ({
    url: `${APP_URL}/government-contracts/${industry.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const stateHubPages = STATES.map((state) => ({
    url: `${APP_URL}/government-contracts/${state.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const industryStatePages = INDUSTRIES.flatMap((industry) =>
    STATES.map((state) => ({
      url: `${APP_URL}/government-contracts/${industry.slug}/${state.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const naicsPages = NAICS_DETAIL.map((naics) => ({
    url: `${APP_URL}/naics/${naics.code}`,
    lastModified: now,
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
    ...industryPages,
    ...stateHubPages,
    ...industryStatePages,
    ...naicsPages,
    ...blogPages,
  ];
}
