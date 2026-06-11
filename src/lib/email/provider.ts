import "server-only";

/**
 * Email provider abstraction.
 *
 * - With RESEND_API_KEY: sends real email via Resend's REST API (fetch, no SDK).
 * - Without it: mock mode — nothing leaves the machine; sends are logged to
 *   the console and recorded in EmailLog with status "mocked".
 */

export type RawEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendResult = {
  status: "sent" | "mocked" | "failed";
  error?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getFromAddress(): string {
  // onboarding@resend.dev works out of the box but only delivers to the
  // Resend account owner — set EMAIL_FROM to a verified domain for real users.
  return process.env.EMAIL_FROM || "GovBidWriter <onboarding@resend.dev>";
}

export async function sendRawEmail(email: RawEmail): Promise<SendResult> {
  if (!isEmailConfigured()) {
    console.log(
      JSON.stringify({
        type: "email_mock",
        to: email.to,
        subject: email.subject,
      })
    );
    return { status: "mocked" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        status: "failed",
        error: `Resend ${response.status}: ${body.slice(0, 300)}`,
      };
    }
    return { status: "sent" };
  } catch (err) {
    return {
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown send error",
    };
  }
}
