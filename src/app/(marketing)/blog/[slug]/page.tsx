import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo/meta";
import { BLOG_POSTS, getBlogPost } from "@/lib/seo/blog";
import { Button } from "@/components/ui/button";
import { formatDate, APP_URL } from "@/lib/utils";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${APP_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "GovBidWriter" },
  };

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article className="container max-w-3xl py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/blog" className="hover:underline">Blog</Link> / {post.title}
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {formatDate(post.date)} · {post.readingMinutes} min read
        </p>

        <div className="mt-8 space-y-6">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="mb-3 text-2xl font-bold text-primary">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="mb-3 leading-relaxed text-foreground/90">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="list-disc space-y-2 pl-6 text-foreground/90">
                  {section.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="my-12 rounded-lg bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-xl font-bold">Put this into practice</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/80">
            Upload your RFP and get the compliance matrix and first draft in
            minutes — free to start.
          </p>
          <Link href="/signup" className="mt-4 inline-block">
            <Button variant="accent">Try GovBidWriter Free</Button>
          </Link>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            More guides
          </h2>
          <ul className="mt-3 space-y-2">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="text-sm text-primary hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
