"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { ArrowRight, Search } from "lucide-react";
import { NAICS_SEARCH_LIST, NAICS_DETAIL } from "@/lib/seo/data";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function NaicsFinder() {
  const [query, setQuery] = useState("");
  const posthog = usePostHog();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAICS_SEARCH_LIST.slice(0, 12);
    return NAICS_SEARCH_LIST.filter(
      (n) =>
        n.code.includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.keywords.includes(q) ||
        q.split(/\s+/).every((w) => (n.title + " " + n.keywords).toLowerCase().includes(w))
    ).slice(0, 20);
  }, [query]);

  const detailCodes = new Set(NAICS_DETAIL.map((n) => n.code));

  const trimmed = query.trim();
  const hasSearched = trimmed.length >= 3;
  const topCode = hasSearched && results.length > 0 ? results[0].code : undefined;
  const noMatches = hasSearched && results.length === 0;

  // Fire one event per settled search (debounced) so we can measure NAICS intent.
  useEffect(() => {
    if (!hasSearched) return;
    const t = setTimeout(() => {
      posthog?.capture("naics_tool_used", {
        query: trimmed.toLowerCase(),
        matched: results.length > 0,
        top_code: topCode ?? null,
      });
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed, hasSearched]);

  const signupHref = `/signup?from=naics-finder${topCode ? `-${topCode}` : ""}`;

  function trackCta() {
    posthog?.capture("naics_cta_clicked", {
      source: "naics-finder",
      top_code: topCode ?? null,
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by service: e.g. software, cleaning, security, trucking…"
              className="pl-9"
              aria-label="Search NAICS codes"
            />
          </div>

          <div className="mt-4 divide-y rounded-lg border">
            {noMatches ? (
              <p className="p-4 text-sm text-muted-foreground">
                No matches in our common-codes list. Try a broader term — or see
                the full official list at{" "}
                <a
                  href="https://www.census.gov/naics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  census.gov/naics
                </a>
                .
              </p>
            ) : (
              results.map((n) => (
                <div key={n.code} className="flex items-center justify-between gap-4 p-3">
                  <div>
                    <span className="font-mono text-sm font-bold text-accent">{n.code}</span>
                    <span className="ml-3 text-sm">{n.title}</span>
                  </div>
                  {detailCodes.has(n.code) && (
                    <Link
                      href={`/naics/${n.code}`}
                      className="shrink-0 text-xs font-medium text-primary hover:underline"
                    >
                      Guide →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing the codes most common in government contracting. For the
            complete official list, see the U.S. Census Bureau NAICS search.
          </p>
        </CardContent>
      </Card>

      {/* Conversion block — turns NAICS lookup into the start of a real bid. */}
      <div className="rounded-lg border border-accent/30 bg-accent/10 p-5">
        {noMatches ? (
          <p className="text-sm">
            <strong>Not sure which code fits?</strong> Create a free account and
            we&apos;ll help you pick the right primary and secondary NAICS codes
            for the contracts you actually pursue.{" "}
          </p>
        ) : (
          <p className="text-sm">
            <strong>
              {topCode
                ? `Found your code? Don't just file NAICS ${topCode} — win under it.`
                : "Don't just look up a code — win under it."}
            </strong>{" "}
            A free account turns the right NAICS code into a capability statement,
            opportunity tracking, and compliant proposal drafts — in one place.{" "}
          </p>
        )}
        <Link
          href={signupHref}
          onClick={trackCta}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          Create your free account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
