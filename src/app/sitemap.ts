import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/utils";
import { INDUSTRIES, STATES, NAICS_DETAIL } from "@/lib/seo/data";
import { BLOG_POSTS } from "@/lib/seo/blog";
import { FREE_TOOLS } from "@/lib/seo/tools";
import { TEMPLATES } from "@/lib/seo/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    "",
    "/pricing",
    "/templates",
    "/government-contract-proposal-template",
    "/blog",
    "/contact",
    "/government-contracts",
    "/tools",
    ...FREE_TOOLS.map((t) => `/tools/${t.slug}`),
  ].map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const templatePages = TEMPLATES.map((t) => ({
    url: `${APP_URL}/templates/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
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
    ...templatePages,
    ...industryPages,
    ...stateHubPages,
    ...industryStatePages,
    ...naicsPages,
    ...blogPages,
  ];
}
