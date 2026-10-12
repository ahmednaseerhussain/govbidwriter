import { ExternalLink } from "lucide-react";
import { formatSince, formatUsd, type MarketSnapshot } from "@/lib/seo/usaspending";

/**
 * Renders real USASpending.gov award data for a NAICS (x state) slice.
 * `scope` is the human label, e.g. "landscaping contracts performed in Virginia".
 */
export function MarketSnapshotSection({
  snapshot,
  heading,
  scope,
}: {
  snapshot: MarketSnapshot;
  heading: string;
  scope: string;
}) {
  const since = formatSince(snapshot.since);
  const top = snapshot.topAgencies[0];

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-primary">{heading}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Since {since}, federal agencies recorded{" "}
        <strong className="text-foreground">{snapshot.awardCount.toLocaleString("en-US")}</strong>{" "}
        {scope}, obligating{" "}
        <strong className="text-foreground">{formatUsd(snapshot.totalObligated)}</strong>
        {top && (
          <>
            . The largest buyer was the <strong className="text-foreground">{top.name}</strong>{" "}
            ({formatUsd(top.amount)})
          </>
        )}
        .
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label={`Contract awards since ${since}`} value={snapshot.awardCount.toLocaleString("en-US")} />
        <Stat label="Dollars obligated" value={formatUsd(snapshot.totalObligated)} />
        <Stat label="Average per award" value={formatUsd(snapshot.avgPerAward)} />
      </div>

      {snapshot.topAgencies.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-semibold">Top buying agencies</h3>
          <ol className="mt-2 space-y-1 text-sm">
            {snapshot.topAgencies.map((a, i) => (
              <li key={a.name} className="flex justify-between gap-4 border-b py-1.5 last:border-0">
                <span>
                  {i + 1}. {a.name}
                </span>
                <span className="font-mono text-muted-foreground">{formatUsd(a.amount)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {snapshot.recentAwards.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-semibold">Recent awards</h3>
          <ul className="mt-2 space-y-3">
            {snapshot.recentAwards.map((a) => (
              <li key={a.id} className="rounded-lg border p-3 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {a.recipient}
                  </a>
                  <span className="font-mono text-muted-foreground">{formatUsd(a.amount)}</span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {a.subAgency ?? a.agency} · {a.date}
                </div>
                {a.description && <p className="mt-1 text-xs">{a.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
        Source: USASpending.gov contract award data, refreshed weekly.
        <a
          href="https://www.usaspending.gov/search"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 hover:underline"
        >
          Search awards <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="text-2xl font-extrabold text-primary">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
