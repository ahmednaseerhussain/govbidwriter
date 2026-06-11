import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { AIProviderError, type AIProvider, type AIRequest } from "./provider";

const MODEL = "claude-fable-5";

/**
 * Fable 5 provider via the official Anthropic SDK.
 *
 * Fable 5 notes (per Anthropic docs):
 * - Thinking is always on; the `thinking` parameter must be omitted.
 * - Sampling params (temperature/top_p/top_k) are not accepted.
 * - Safety classifiers may decline a request: HTTP 200 with
 *   stop_reason "refusal" — check before reading content.
 */
export class FableProvider implements AIProvider {
  readonly name = "fable-5";
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.FABLE_API_KEY });
  }

  async generateText(req: AIRequest): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: MODEL,
        max_tokens: req.maxTokens ?? 8192,
        system: req.system,
        messages: [{ role: "user", content: req.user }],
      });

      if (response.stop_reason === "refusal") {
        throw new AIProviderError(
          "The AI provider declined this request. Please adjust the input and try again.",
          "refusal"
        );
      }

      const text = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");

      if (!text) {
        throw new AIProviderError("The AI provider returned no content.");
      }
      return text;
    } catch (err) {
      if (err instanceof AIProviderError) throw err;
      if (err instanceof Anthropic.APIError) {
        throw new AIProviderError(
          `AI provider error (${err.status ?? "network"}): ${err.message}`
        );
      }
      throw new AIProviderError(
        err instanceof Error ? err.message : "Unknown AI provider error."
      );
    }
  }
}
