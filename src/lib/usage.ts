import "server-only";
import { db } from "@/lib/db";
import { getPlan, type Plan } from "@/lib/billing/plans";
import { sendTemplateEmail, wasEmailSentSince } from "@/lib/email/send";
import { notify } from "@/lib/notifications";
import { track } from "@/lib/analytics";

export type UsageAction = "ai_generation" | "rfp_upload" | "export";

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getUserPlan(userId: string): Promise<Plan> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  if (sub && sub.status === "active") return getPlan(sub.plan);
  return getPlan("free");
}

export async function getMonthlyUsage(
  userId: string,
  action: UsageAction
): Promise<number> {
  return db.usageLog.count({
    where: { userId, action, createdAt: { gte: startOfMonth() } },
  });
}

export type UsageCheck = {
  allowed: boolean;
  used: number;
  limit: number;
  plan: Plan;
  message?: string;
};

/** Check whether the user may perform `action` under their plan. Does not log. */
export async function checkUsage(
  userId: string,
  action: UsageAction
): Promise<UsageCheck> {
  const plan = await getUserPlan(userId);
  const limit =
    action === "ai_generation"
      ? plan.limits.aiGenerationsPerMonth
      : action === "rfp_upload"
        ? plan.limits.rfpUploadsPerMonth
        : plan.limits.exportsEnabled
          ? Number.POSITIVE_INFINITY
          : 0;

  const used = Number.isFinite(limit)
    ? await getMonthlyUsage(userId, action)
    : 0;

  if (used >= limit) {
    return {
      allowed: false,
      used,
      limit,
      plan,
      message:
        plan.id === "free"
          ? "You've reached your Free plan limit for this month. Upgrade to Pro to continue."
          : "You've reached your plan limit for this month.",
    };
  }
  return { allowed: true, used, limit, plan };
}

/** Record a completed action against the user's monthly quota. */
export async function logUsage(
  userId: string,
  action: UsageAction,
  meta?: string
): Promise<void> {
  await db.usageLog.create({ data: { userId, action, meta } });
  if (action === "ai_generation") {
    await maybeSendUsageAlert(userId).catch((err) =>
      console.error("usage alert failed:", err)
    );
  }
}

/**
 * Send a one-per-month usage alert when the user crosses 80% of their
 * AI-generation quota, and another when they exhaust it.
 */
async function maybeSendUsageAlert(userId: string): Promise<void> {
  const plan = await getUserPlan(userId);
  const limit = plan.limits.aiGenerationsPerMonth;
  if (!Number.isFinite(limit) || limit <= 0) return;

  const used = await getMonthlyUsage(userId, "ai_generation");
  const monthStart = startOfMonth();

  if (used >= limit) {
    if (await wasEmailSentSince(userId, "usage_limit_reached", monthStart)) return;
    track("free_limit_reached", { plan: plan.name, limit }, userId);
    await sendTemplateEmail({
      userId,
      template: "usage_limit_reached",
      payload: { limit: String(limit), plan: plan.name },
    });
    await notify({
      userId,
      type: "usage",
      title: "Monthly AI generation limit reached",
      body: `You've used all ${limit} generations on the ${plan.name} plan. Limits reset on the 1st.`,
      link: "/dashboard/billing",
    });
  } else if (used >= Math.ceil(limit * 0.8)) {
    if (await wasEmailSentSince(userId, "usage_limit_warning", monthStart)) return;
    await sendTemplateEmail({
      userId,
      template: "usage_limit_warning",
      payload: { used: String(used), limit: String(limit), plan: plan.name },
    });
    await notify({
      userId,
      type: "usage",
      title: "You're close to your monthly limit",
      body: `${used} of ${limit} AI generations used this month.`,
      link: "/dashboard/billing",
    });
  }
}

/** Summary for the dashboard/billing pages. */
export async function getUsageSummary(userId: string) {
  const plan = await getUserPlan(userId);
  const [generations, uploads] = await Promise.all([
    getMonthlyUsage(userId, "ai_generation"),
    getMonthlyUsage(userId, "rfp_upload"),
  ]);
  return {
    plan,
    generations: { used: generations, limit: plan.limits.aiGenerationsPerMonth },
    uploads: { used: uploads, limit: plan.limits.rfpUploadsPerMonth },
  };
}
