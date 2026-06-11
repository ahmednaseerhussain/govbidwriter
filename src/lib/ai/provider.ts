import "server-only";
import type { z } from "zod";

/**
 * AI provider abstraction.
 *
 * All AI features call this interface — never an SDK directly. The primary
 * provider is Fable 5 (Anthropic API, enabled when FABLE_API_KEY is set);
 * without a key, a deterministic mock keeps every feature working.
 * Swapping providers later means implementing AIProvider once.
 */

export type AIRequest = {
  /** System prompt: role + output contract. */
  system: string;
  /** User prompt: the data. Untrusted content must already be delimited. */
  user: string;
  /** Workflow kind — lets the mock provider produce tailored output. */
  kind:
    | "capability_statement"
    | "rfp_analysis"
    | "requirement_extraction"
    | "proposal_outline"
    | "proposal_section"
    | "proposal_review"
    | "generic";
  /** Optional structured context for the mock provider (e.g. company name). */
  context?: Record<string, string>;
  maxTokens?: number;
};

export interface AIProvider {
  readonly name: string;
  generateText(req: AIRequest): Promise<string>;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "refusal"
      | "invalid_json"
      | "provider_error" = "provider_error"
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

let cachedProvider: AIProvider | null = null;

export async function getAIProvider(): Promise<AIProvider> {
  if (cachedProvider) return cachedProvider;
  if (process.env.FABLE_API_KEY) {
    const { FableProvider } = await import("./fable");
    cachedProvider = new FableProvider();
  } else {
    const { MockProvider } = await import("./mock");
    cachedProvider = new MockProvider();
  }
  return cachedProvider;
}

export function isMockMode(): boolean {
  return !process.env.FABLE_API_KEY;
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenced) return fenced[1];
  // Models occasionally prepend prose; grab the outermost JSON object/array.
  const firstBrace = trimmed.search(/[[{]/);
  if (firstBrace > 0) {
    const candidate = trimmed.slice(firstBrace);
    const lastClose = Math.max(
      candidate.lastIndexOf("}"),
      candidate.lastIndexOf("]")
    );
    if (lastClose >= 0) return candidate.slice(0, lastClose + 1);
  }
  return trimmed;
}

/**
 * Generate structured output validated against a zod schema.
 * On invalid JSON/schema, retries once with a repair prompt before erroring.
 */
export async function generateStructured<T>(
  req: AIRequest,
  // Input type is `any` so T is inferred from the schema OUTPUT (post-defaults).
  schema: z.ZodType<T, z.ZodTypeDef, unknown>
): Promise<T> {
  const provider = await getAIProvider();

  const attempt = async (extraSystem?: string): Promise<T> => {
    const raw = await provider.generateText({
      ...req,
      system: extraSystem ? `${req.system}\n\n${extraSystem}` : req.system,
    });
    const cleaned = stripCodeFences(raw);
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new AIProviderError("Model returned invalid JSON.", "invalid_json");
    }
    const result = schema.safeParse(parsed);
    if (!result.success) {
      throw new AIProviderError(
        `Output failed schema validation: ${result.error.issues
          .slice(0, 3)
          .map((i) => i.message)
          .join("; ")}`,
        "invalid_json"
      );
    }
    return result.data;
  };

  try {
    return await attempt();
  } catch (err) {
    if (err instanceof AIProviderError && err.code === "invalid_json") {
      // One repair retry with a stricter instruction.
      return attempt(
        "IMPORTANT: Your previous output was not valid JSON matching the required schema. Respond with ONLY a single valid JSON value matching the schema exactly — no markdown fences, no commentary, no trailing text."
      );
    }
    throw err;
  }
}
