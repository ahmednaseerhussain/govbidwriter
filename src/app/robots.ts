import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/login", "/signup"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
