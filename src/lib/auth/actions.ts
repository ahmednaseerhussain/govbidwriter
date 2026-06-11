"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendTemplateEmail } from "@/lib/email/send";
import { enrollInNurture } from "@/lib/email/sequences";
import { notify } from "@/lib/notifications";

export type AuthFormState = { error?: string };

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const ip = await clientIp();
  if (!checkRateLimit(`auth:${ip}`, RATE_LIMITS.auth).ok) {
    return { error: "Too many attempts. Please wait a few minutes." };
  }

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const name = String(formData.get("name") || "").trim() || null;

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "An account with this email already exists. Try logging in." };
  }

  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      name,
      subscription: { create: { plan: "free", status: "active" } },
      emailPreference: { create: {} }, // defaults: everything opted in
    },
  });

  // Onboarding side effects — none of these may block signup.
  await Promise.all([
    sendTemplateEmail({ userId: user.id, template: "welcome" }),
    enrollInNurture(user.id),
    notify({
      userId: user.id,
      type: "welcome",
      title: "Welcome to GovBidWriter",
      body: "Start by completing your company profile — every generation is grounded in it.",
      link: "/dashboard/company-profile",
    }),
    process.env.ADMIN_EMAIL
      ? sendTemplateEmail({
          to: process.env.ADMIN_EMAIL,
          template: "admin_new_signup",
          payload: { email: user.email, name: name ?? "" },
        })
      : Promise.resolve(),
  ]);

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const ip = await clientIp();
  if (!checkRateLimit(`auth:${ip}`, RATE_LIMITS.auth).ok) {
    return { error: "Too many attempts. Please wait a few minutes." };
  }

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}
