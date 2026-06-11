import "server-only";

/**
 * AI usage + cost-estimation logging.
 *
 * Costs are estimates from env-configurable per-million-token rates so
 * pricing changes don't require a code change. Output goes to the server log
 * as a single structured line per call (greppable: "ai_usage").
 */

const INPUT_COST_PER_MTOK = Number(process.env.AI_COST_INPUT_PER_MTOK ?? "0.28");
const OUTPUT_COST_PER_MTOK = Number(process.env.AI_COST_OUTPUT_PER_MTOK ?? "0.42");

export type AiUsageEvent = {
  provider: string;
  model: string;
  kind: string;
  promptTokens: number;
  completionTokens: number;
};

/** Running in-process totals (resets per server instance). */
const totals = { calls: 0, promptTokens: 0, completionTokens: 0, costUsd: 0 };

export function estimateCostUsd(promptTokens: number, completionTokens: number): number {
  return (
    (promptTokens / 1_000_000) * INPUT_COST_PER_MTOK +
    (completionTokens / 1_000_000) * OUTPUT_COST_PER_MTOK
  );
}

export function logAiUsage(event: AiUsageEvent): void {
  const costUsd = estimateCostUsd(event.promptTokens, event.completionTokens);
  totals.calls += 1;
  totals.promptTokens += event.promptTokens;
  totals.completionTokens += event.completionTokens;
  totals.costUsd += costUsd;

  console.log(
    JSON.stringify({
      type: "ai_usage",
      ...event,
      estimatedCostUsd: Number(costUsd.toFixed(6)),
      sessionTotals: {
        calls: totals.calls,
        promptTokens: totals.promptTokens,
        completionTokens: totals.completionTokens,
        estimatedCostUsd: Number(totals.costUsd.toFixed(4)),
      },
    })
  );
}
