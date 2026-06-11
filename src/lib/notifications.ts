import "server-only";
import { db } from "@/lib/db";

export type NotificationType =
  | "welcome"
  | "rfp"
  | "proposal"
  | "usage"
  | "billing"
  | "deadline"
  | "opportunity";

/** Create an in-app notification. Never throws. */
export async function notify(args: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId: args.userId,
        type: args.type,
        title: args.title,
        body: args.body ?? null,
        link: args.link ?? null,
      },
    });
  } catch (err) {
    console.error("notify failed:", err);
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  return db.notification.count({ where: { userId, readAt: null } });
}

export async function getNotifications(userId: string, take = 50) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function markAllRead(userId: string): Promise<void> {
  await db.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
