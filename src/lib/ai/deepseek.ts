import "server-only";
import { AIProviderError, type AIProvider, type AIRequest } from "./provider";
import { logAiUsage } from "./usage";

/**
 * DeepSeek provider — the sole runtime AI provider.
 *
 * Uses DeepSeek's OpenAI-compatible chat completions API directly via fetch
 * (no SDK dependency). JSON workflows run in JSON mode
 * (response_format: json_object); prose workflows (proposal sections, reviews)
 * run as plain text.
 */

const BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

function getModel(): string {
  return process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
}

/** Workflows whose output contract is strict JSON. */
const JSON_KINDS = new Set<AIRequest["kind"]>([
  "capability_statement",
  "rfp_analysis",
  "requirement_extraction",
  "proposal_outline",
]);

type ChatCompletionResponse = {
  choices?: { message?: { content?: string }; finish_reason?: string }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string; type?: string };
};

export class DeepSeekProvider implements AIProvider {
  readonly name = "deepseek";

  async generateText(req: AIRequest): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new AIProviderError("DEEPSEEK_API_KEY is not configured.");
    }

    const body: Record<string, unknown> = {
      model: getModel(),
      max_tokens: req.maxTokens ?? 8192,
      messages: [
        { role: "system", content: req.system },
        { role: "user", content: req.user },
      ],
    };
    if (JSON_KINDS.has(req.kind)) {
      // DeepSeek JSON mode requires the word "json" in the prompt — our JSON
      // system prompts all state the JSON contract explicitly.
      body.response_format = { type: "json_object" };
    }

    let response: Response;
    try {
      response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (err) {
      throw new AIProviderError(
        `Could not reach the AI provider: ${err instanceof Error ? err.message : "network error"}`
      );
    }

    let data: ChatCompletionResponse;
    try {
      data = (await response.json()) as ChatCompletionResponse;
    } catch {
      throw new AIProviderError(
        `AI provider returned a non-JSON response (HTTP ${response.status}).`
      );
    }

    if (!response.ok) {
      const message = data.error?.message || `HTTP ${response.status}`;
      if (response.status === 401) {
        throw new AIProviderError("AI provider rejected the API key (401).");
      }
      if (response.status === 429) {
        throw new AIProviderError(
          "AI provider rate limit reached. Please try again shortly."
        );
      }
      throw new AIProviderError(`AI provider error: ${message}`);
    }

    const choice = data.choices?.[0];
    const text = choice?.message?.content ?? "";

    logAiUsage({
      provider: this.name,
      model: getModel(),
      kind: req.kind,
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    });

    if (!text) {
      throw new AIProviderError("The AI provider returned no content.");
    }
    if (choice?.finish_reason === "length") {
      // Truncated output usually means broken JSON downstream — surface it.
      throw new AIProviderError(
        "The AI response was cut off (token limit). Try a shorter document."
      );
    }
    return text;
  }
}
