"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { NAICS_SEARCH_LIST, NAICS_DETAIL } from "@/lib/seo/data";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function NaicsFinder() {
  const [query, setQuery] = useState("");

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

  return (
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
          {results.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No matches in our common-codes list. Try a broader term — or
              search the full code list at census.gov/naics.
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
  );
}
