import { cache } from "react";

/**
 * Real federal award data from the USASpending.gov public API (no key needed).
 * Gives each pSEO page numbers that are unique to its NAICS x state slice —
 * award counts, dollars obligated, top buying agencies, and recent winners.
 *
 * Responses are cached for a week (ISR). Any failure returns null and the
 * page simply renders without the data section.
 */

const API = "https://api.usaspending.gov/api/v2";
const REVALIDATE_SECONDS = 60 * 60 * 24 * 7;
const CONTRACT_TYPES = ["A", "B", "C", "D"];

export type RecentAward = {
  id: string;
  recipient: string;
  amount: number;
  agency: string;
  subAgency: string | null;
  date: string;
  description: string | null;
  url: string;
};

export type MarketSnapshot = {
  /** ISO date the window starts (start of the fiscal year two years back). */
  since: string;
  awardCount: number;
  totalObligated: number;
  avgPerAward: number;
  topAgencies: { name: string; amount: number }[];
  recentAwards: RecentAward[];
};

/** Start of the fiscal year two years before the current one, e.g. 2024-10-01. */
function windowStart(now = new Date()): string {
  const fyStartYear = now.getUTCMonth() >= 9 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
  return `${fyStartYear - 2}-10-01`;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`USASpending ${path} ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchSnapshot(naicsKey: string, stateAbbr: string): Promise<MarketSnapshot | null> {
  const since = windowStart();
  const end = new Date().toISOString().slice(0, 10);
  const filters: Record<string, unknown> = {
    time_period: [{ start_date: since, end_date: end }],
    naics_codes: { require: naicsKey.split(",") },
    award_type_codes: CONTRACT_TYPES,
  };
  if (stateAbbr) {
    filters.place_of_performance_locations = [{ country: "USA", state: stateAbbr }];
  }

  try {
    const [count, agencies, awards] = await Promise.all([
      post<{ results: { contracts: number } }>("/search/spending_by_award_count/", { filters }),
      post<{ results: { name: string; amount: number }[] }>(
        "/search/spending_by_category/awarding_agency/",
        { filters, limit: 100 }
      ),
      post<{ results: Record<string, unknown>[] }>("/search/spending_by_award/", {
        filters,
        fields: [
          "Award ID",
          "Recipient Name",
          "Award Amount",
          "Awarding Agency",
          "Awarding Sub Agency",
          "Start Date",
          "Description",
        ],
        sort: "Start Date",
        order: "desc",
        limit: 6,
      }),
    ]);

    const awardCount = count.results.contracts ?? 0;
    const totalObligated = agencies.results.reduce((sum, a) => sum + (a.amount > 0 ? a.amount : 0), 0);
    if (awardCount === 0) return null;

    return {
      since,
      awardCount,
      totalObligated,
      avgPerAward: totalObligated / awardCount,
      topAgencies: agencies.results
        .filter((a) => a.amount > 0)
        .slice(0, 5)
        .map((a) => ({ name: a.name, amount: a.amount })),
      recentAwards: awards.results.map((r) => ({
        id: String(r["Award ID"]),
        recipient: titleCase(String(r["Recipient Name"] ?? "Undisclosed")),
        amount: Number(r["Award Amount"] ?? 0),
        agency: String(r["Awarding Agency"] ?? ""),
        subAgency: (r["Awarding Sub Agency"] as string | null) ?? null,
        date: String(r["Start Date"] ?? ""),
        description: r["Description"] ? sentenceCase(String(r["Description"])) : null,
        url: `https://www.usaspending.gov/award/${encodeURIComponent(String(r["generated_internal_id"] ?? ""))}`,
      })),
    };
  } catch (err) {
    console.warn("[usaspending] snapshot failed", naicsKey, stateAbbr, err);
    return null;
  }
}

// Strings as cache keys so generateMetadata and the page share one fetch.
const cachedSnapshot = cache(fetchSnapshot);

export function getMarketSnapshot(naicsCodes: string[], stateAbbr?: string) {
  return cachedSnapshot([...naicsCodes].sort().join(","), stateAbbr ?? "");
}

// ---- formatting ----

export function formatUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
}

export function formatSince(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const KEEP_UPPER = new Set(["LLC", "INC", "LLP", "LP", "USA", "US", "JV", "II", "III", "IV", "PC", "PLLC"]);

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b[\w']+\b/g, (w) =>
      KEEP_UPPER.has(w.toUpperCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
    );
}

function sentenceCase(s: string): string {
  const lower = s.toLowerCase().trim();
  const clipped = lower.length > 140 ? `${lower.slice(0, 137).replace(/\s+\S*$/, "")}…` : lower;
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}
