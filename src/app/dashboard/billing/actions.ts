"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { startProCheckout, cancelProSubscription } from "@/lib/billing/stripe";
import { sendTemplateEmail } from "@/lib/email/send";
import { notify } from "@/lib/notifications";
import { track } from "@/lib/analytics";

export type BillingState = { error?: string; success?: string };

export async function upgradeAction(
  _prev: BillingState,
  _formData: FormData
): Promise<BillingState> {
  const user = await requireUser();
  track("upgrade_clicked", undefined, user.id);

  let checkoutUrl: string | null = null;
  try {
    const result = await startProCheckout(user.id, user.email);
    if (result.mode === "stripe") {
      checkoutUrl = result.url;
    } else if (result.mode === "setup") {
      return {
        error:
          "Billing is in setup mode — paid checkout isn't enabled yet. Your work is saved; please check back soon or reach us via the contact page.",
      };
    }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Could not start the upgrade. Try again.",
    };
  }

  if (checkoutUrl) {
    track("checkout_started", undefined, user.id);
    redirect(checkoutUrl);
  }

  // Mock-mode upgrade completed locally — confirm like the real flow would.
  await Promise.all([
    sendTemplateEmail({ userId: user.id, template: "subscription_upgraded" }),
    notify({
      userId: user.id,
      type: "billing",
      title: "You're on Pro",
      body: "Full matrices, all proposal sections, and exports are unlocked.",
      link: "/dashboard/billing",
    }),
  ]);

  revalidatePath("/dashboard/billing");
  return {
    success:
      "You're on Pro! (Mock mode: no Stripe keys configured, so the plan was switched locally — no charge.)",
  };
}

export async function downgradeAction(
  _prev: BillingState,
  _formData: FormData
): Promise<BillingState> {
  const user = await requireUser();
  try {
    await cancelProSubscription(user.id);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not cancel. Try again.",
    };
  }
  await Promise.all([
    sendTemplateEmail({ userId: user.id, template: "subscription_canceled" }),
    notify({
      userId: user.id,
      type: "billing",
      title: "Subscription canceled",
      body: "You're back on the Free plan. All your work remains saved.",
      link: "/dashboard/billing",
    }),
  ]);
  revalidatePath("/dashboard/billing");
  return { success: "Your subscription was canceled. You're back on the Free plan." };
}
