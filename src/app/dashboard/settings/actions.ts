"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export type SettingsState = { error?: string; saved?: boolean };

export async function updateAccountAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim().slice(0, 200);

  await db.user.update({
    where: { id: user.id },
    data: { name: name || null },
  });

  revalidatePath("/dashboard/settings");
  return { saved: true };
}

const PREF_KEYS = [
  "productUpdates",
  "marketingEmails",
  "deadlineReminders",
  "opportunityAlerts",
  "usageAlerts",
] as const;

export async function updateEmailPreferencesAction(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const user = await requireUser();

  const data = Object.fromEntries(
    PREF_KEYS.map((key) => [key, formData.get(key) === "on"])
  );

  await db.emailPreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  });

  revalidatePath("/dashboard/settings");
  return { saved: true };
}
