"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { startProCheckout, cancelProSubscription } from "@/lib/billing/stripe";

export type BillingState = { error?: string; success?: string };

export async function upgradeAction(
  _prev: BillingState,
  _formData: FormData
): Promise<BillingState> {
  const user = await requireUser();

  let checkoutUrl: string | null = null;
  try {
    const result = await startProCheckout(user.id, user.email);
    if (result.mode === "stripe") {
      checkoutUrl = result.url;
    }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Could not start the upgrade. Try again.",
    };
  }

  if (checkoutUrl) redirect(checkoutUrl);

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
  revalidatePath("/dashboard/billing");
  return { success: "Your subscription was canceled. You're back on the Free plan." };
}
