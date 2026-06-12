import Link from "next/link";
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/seo/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Government Contracting Blog — Practical Guides for Small Business",
  description:
    "Practical guides for small business government contractors: responding to RFPs, capability statements, compliance matrices, NAICS codes, past performance, and winning your first contract.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const sorted = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const usedCategories = BLOG_CATEGORIES.filter((c) =>
    BLOG_POSTS.some((p) => p.category === c)
  );

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <section className="container max-w-3xl py-12">
        <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
          Government Contracting Guides
        </h1>
        <p className="mt-3 text-muted-foreground">
          Practical, no-fluff guides for small businesses pursuing government
          work.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {usedCategories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {sorted.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <Card className="transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-accent">{post.category}</span>
                    {" · "}
                    {formatDate(post.date)} · {post.readingMinutes} min read
                  </p>
                  <CardTitle className="text-xl group-hover:text-accent">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {post.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
