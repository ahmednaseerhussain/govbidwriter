import { NextResponse } from "next/server";
import { constructWebhookEvent, handleStripeEvent } from "@/lib/billing/stripe";

/**
 * Stripe webhook endpoint.
 * Configure in Stripe Dashboard: <app-url>/api/stripe/webhook with events
 * checkout.session.completed and customer.subscription.deleted.
 * Inactive (returns 503) until STRIPE_WEBHOOK_SECRET is set.
 */
export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured on this deployment." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const event = constructWebhookEvent(payload, signature);
    await handleStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
