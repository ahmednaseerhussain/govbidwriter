import "server-only";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendTemplateEmail } from "@/lib/email/send";
import { notify } from "@/lib/notifications";
import { track } from "@/lib/analytics";

/**
 * Stripe integration with full mock mode.
 *
 * - With STRIPE_SECRET_KEY: real Checkout sessions and webhook handling.
 * - Without keys: "upgrading" flips the Subscription row locally so the whole
 *   paid experience is testable end to end with zero Stripe setup.
 */

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRO_PRICE_ID
  );
}

/**
 * Mock upgrades (instant local plan flip, no charge) are allowed outside
 * production by default, and in production only when ALLOW_MOCK_BILLING=true
 * is set explicitly. A deployed site without Stripe keys otherwise shows
 * "billing is in setup mode" instead of handing out free Pro.
 */
export function isMockBillingAllowed(): boolean {
  if (isStripeConfigured()) return false;
  return (
    process.env.ALLOW_MOCK_BILLING === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured.");
  return new Stripe(key);
}

export type CheckoutResult =
  | { mode: "stripe"; url: string }
  | { mode: "mock"; upgraded: true }
  | { mode: "setup" };

/** Start an upgrade. Real Stripe Checkout if configured, instant mock upgrade otherwise. */
export async function startProCheckout(
  userId: string,
  userEmail: string
): Promise<CheckoutResult> {
  if (!isStripeConfigured()) {
    if (!isMockBillingAllowed()) return { mode: "setup" };
    await setMockPlan(userId, "pro");
    return { mode: "mock", upgraded: true };
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: userEmail,
    client_reference_id: userId,
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?upgraded=1`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
    metadata: { userId },
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return { mode: "stripe", url: session.url };
}

/** Cancel (downgrade). In mock mode, flips the local row. */
export async function cancelProSubscription(userId: string): Promise<void> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (isStripeConfigured() && sub?.stripeSubscriptionId) {
    const stripe = getStripe();
    await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
  }
  await setMockPlan(userId, "free");
}

export async function setMockPlan(
  userId: string,
  plan: "free" | "pro"
): Promise<void> {
  await db.subscription.upsert({
    where: { userId },
    create: { userId, plan, status: "active" },
    update: { plan, status: "active" },
  });
}

/**
 * Webhook fulfillment: called from /api/stripe/webhook with a verified event.
 * Handles subscription activation and cancellation.
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        session.client_reference_id || session.metadata?.userId || null;
      if (!userId) return;
      await db.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan: "pro",
          status: "active",
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : null,
          stripeSubscriptionId:
            typeof session.subscription === "string"
              ? session.subscription
              : null,
        },
        update: {
          plan: "pro",
          status: "active",
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : null,
          stripeSubscriptionId:
            typeof session.subscription === "string"
              ? session.subscription
              : null,
        },
      });
      track("subscription_activated", undefined, userId);
      await Promise.all([
        sendTemplateEmail({ userId, template: "subscription_upgraded" }),
        notify({
          userId,
          type: "billing",
          title: "You're on Pro",
          body: "Full matrices, all proposal sections, and exports are unlocked.",
          link: "/dashboard/billing",
        }),
      ]);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;
      if (!customerId) return;
      const sub = await db.subscription.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (sub) {
        await db.subscription.update({
          where: { id: sub.id },
          data: { status: "past_due" },
        });
        await Promise.all([
          sendTemplateEmail({ userId: sub.userId, template: "payment_failed" }),
          notify({
            userId: sub.userId,
            type: "billing",
            title: "Payment failed",
            body: "Update your billing details to keep Pro access.",
            link: "/dashboard/billing",
          }),
        ]);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const existing = await db.subscription.findFirst({
        where: { stripeSubscriptionId: sub.id },
      });
      if (existing) {
        await db.subscription.update({
          where: { id: existing.id },
          data: { plan: "free", status: "canceled" },
        });
        await Promise.all([
          sendTemplateEmail({
            userId: existing.userId,
            template: "subscription_canceled",
          }),
          notify({
            userId: existing.userId,
            type: "billing",
            title: "Subscription canceled",
            body: "You're back on the Free plan. All your work remains saved.",
            link: "/dashboard/billing",
          }),
        ]);
      }
      break;
    }
  }
}

export function constructWebhookEvent(
  payload: string,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}
