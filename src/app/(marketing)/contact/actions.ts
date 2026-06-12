"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendTemplateEmail } from "@/lib/email/send";

export type ContactFormState = { error?: string; sent?: boolean };

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(200),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  topic: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more — at least 10 characters.")
    .max(5000, "Message is too long (5,000 characters max)."),
});

export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local";
  if (!checkRateLimit(`contact:${ip}`, { limit: 3, windowMs: 60 * 60 * 1000 }).ok) {
    return { error: "Too many messages in a short time. Please try again later." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const payload = {
    fromName: d.name,
    fromEmail: d.email,
    topic: d.topic || "General inquiry",
    message: d.message,
  };

  await Promise.all([
    process.env.ADMIN_EMAIL
      ? sendTemplateEmail({
          to: process.env.ADMIN_EMAIL,
          template: "contact_form_admin",
          payload,
        })
      : Promise.resolve(),
    sendTemplateEmail({
      to: d.email,
      template: "contact_form_confirmation",
      payload: { topic: payload.topic },
    }),
  ]);

  return { sent: true };
}
