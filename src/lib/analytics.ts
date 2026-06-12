import "server-only";

/**
 * Minimal server-side event tracking abstraction.
 *
 * Always logs a structured `analytics_event` JSON line (grep server logs).
 * If POSTHOG_API_KEY is set, also forwards to PostHog's capture API via
 * fetch — no SDK dependency. Fire-and-forget: never throws, never blocks
 * the caller on provider latency.
 */

export type AnalyticsEvent =
  | "signup_completed"
  | "login_completed"
  | "profile_saved"
  | "tool_used"
  | "rfp_created"
  | "rfp_analyzed"
  | "requirements_extracted"
  | "capability_statement_generated"
  | "proposal_created"
  | "proposal_section_generated"
  | "free_limit_reached"
  | "upgrade_clicked"
  | "checkout_started"
  | "subscription_activated"
  | "export_downloaded"
  | "email_sent"
  | "contact_submitted";

type Props = Record<string, string | number | boolean | undefined>;

const POSTHOG_HOST = process.env.POSTHOG_HOST || "https://us.i.posthog.com";

export function track(event: AnalyticsEvent, props?: Props, userId?: string): void {
  const entry = {
    t: new Date().toISOString(),
    event,
    userId: userId || "anonymous",
    ...props,
  };
  console.log(`analytics_event ${JSON.stringify(entry)}`);

  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) return;

  // Fire-and-forget; an analytics outage must never affect a user action.
  fetch(`${POSTHOG_HOST}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      event,
      distinct_id: userId || "server",
      properties: { ...props, source: "govbidwriter-server" },
      timestamp: entry.t,
    }),
  }).catch(() => {
    // Swallowed deliberately — see note above.
  });
}
