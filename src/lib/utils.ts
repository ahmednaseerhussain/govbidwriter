import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Best-effort parse of an AI-extracted deadline string ("2026-07-15 14:00 ET",
 * "July 15, 2026", …) into a Date. Returns null when unparseable or absurd.
 */
export function parseDeadlineDate(deadline: string | null | undefined): Date | null {
  if (!deadline) return null;
  // Strip common timezone/words that break Date.parse.
  const cleaned = deadline
    .replace(/\b(ET|EST|EDT|CT|CST|CDT|MT|MST|MDT|PT|PST|PDT|local time|local)\b/gi, "")
    .replace(/\bat\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const ts = Date.parse(cleaned);
  if (Number.isNaN(ts)) return null;
  const date = new Date(ts);
  const year = date.getFullYear();
  if (year < 2000 || year > 2100) return null;
  return date;
}

export const DISCLAIMER =
  "GovBidWriter generates draft content and checklists for informational purposes. Users must verify all requirements against the official solicitation before submission.";
