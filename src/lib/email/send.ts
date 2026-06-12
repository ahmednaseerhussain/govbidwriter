import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { APP_URL } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { sendRawEmail } from "./provider";
import {
  renderTemplate,
  templateCategory,
  type EmailCategory,
  type TemplatePayload,
} from "./templates";

/** Category → EmailPreference column. Transactional email is always sent. */
const PREF_FIELD: Record<Exclude<EmailCategory, "transactional">, "productUpdates" | "marketingEmails" | "deadlineReminders" | "opportunityAlerts" | "usageAlerts"> = {
  product: "productUpdates",
  marketing: "marketingEmails",
  deadline: "deadlineReminders",
  opportunity: "opportunityAlerts",
  usage: "usageAlerts",
};

function getSecret(): string {
  return process.env.AUTH_SECRET || "gbw-dev-secret-do-not-use-in-production";
}

export function unsubscribeSignature(userId: string, category: string): string {
  return createHmac("sha256", getSecret())
    .update(`unsub:${userId}:${category}`)
    .digest("base64url");
}

export function verifyUnsubscribeSignature(
  userId: string,
  category: string,
  sig: string
): boolean {
  const expected = Buffer.from(unsubscribeSignature(userId, category));
  const provided = Buffer.from(sig);
  return (
    expected.length === provided.length && timingSafeEqual(expected, provided)
  );
}

function unsubscribeUrl(userId: string, category: string): string {
  const sig = unsubscribeSignature(userId, category);
  return `${APP_URL}/api/email/unsubscribe?uid=${encodeURIComponent(userId)}&cat=${encodeURIComponent(category)}&sig=${sig}`;
}

export type SendEmailArgs = {
  /** Resolve recipient + preferences from this user. */
  userId?: string;
  /** Direct recipient (admin notifications etc). Required when no userId. */
  to?: string;
  template: string;
  payload?: TemplatePayload;
};

/**
 * Render + preference-check + send + log one email.
 * Never throws — email failures must never break a product flow.
 */
export async function sendTemplateEmail(args: SendEmailArgs): Promise<void> {
  try {
    const category = templateCategory(args.template);
    if (!category) {
      console.error(`sendTemplateEmail: unknown template "${args.template}"`);
      return;
    }

    let to = args.to ?? null;
    let name: string | undefined;
    if (args.userId) {
      const user = await db.user.findUnique({
        where: { id: args.userId },
        select: { email: true, name: true },
      });
      if (!user) return;
      to = to ?? user.email;
      name = user.name ?? undefined;
    }
    if (!to) return;

    // Preference gate for non-transactional categories.
    let unsub: string | undefined;
    if (category !== "transactional" && args.userId) {
      const pref = await db.emailPreference.findUnique({
        where: { userId: args.userId },
      });
      const field = PREF_FIELD[category];
      if (pref && pref[field] === false) {
        await db.emailLog.create({
          data: {
            userId: args.userId,
            toAddress: to,
            subject: `(${args.template})`,
            template: args.template,
            status: "skipped_preference",
          },
        });
        return;
      }
      unsub = unsubscribeUrl(args.userId, category);
    }

    const rendered = renderTemplate(
      args.template,
      { name: name ?? "", ...args.payload },
      unsub
    );
    if (!rendered) return;

    const result = await sendRawEmail({
      to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });

    await db.emailLog.create({
      data: {
        userId: args.userId ?? null,
        toAddress: to,
        subject: rendered.subject,
        template: args.template,
        status: result.status,
        error: result.error ?? null,
      },
    });
    track("email_sent", { template: args.template, status: result.status }, args.userId);
  } catch (err) {
    console.error("sendTemplateEmail failed:", err);
  }
}

/** Has this template already been sent to the user since `since`? (dedupe) */
export async function wasEmailSentSince(
  userId: string,
  template: string,
  since: Date
): Promise<boolean> {
  const count = await db.emailLog.count({
    where: {
      userId,
      template,
      status: { in: ["sent", "mocked"] },
      createdAt: { gte: since },
    },
  });
  return count > 0;
}
