import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getNotifications } from "@/lib/notifications";
import { markAllReadAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

const TYPE_LABEL: Record<string, string> = {
  welcome: "Welcome",
  rfp: "RFP",
  proposal: "Proposal",
  usage: "Usage",
  billing: "Billing",
  deadline: "Deadline",
  opportunity: "Opportunity",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await getNotifications(user.id);
  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity on your RFPs, proposals, and account.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" /> Preferences
            </Button>
          </Link>
          {hasUnread && (
            <form action={markAllReadAction}>
              <Button variant="outline" size="sm" type="submit">
                Mark all read
              </Button>
            </form>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50" />
            <h2 className="mt-4 font-semibold">Nothing here yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              You&apos;ll see updates here when RFP analyses finish, proposal
              sections are drafted, and deadlines approach.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={cn("flex gap-3 p-4", !n.readAt && "bg-accent/5")}
              >
                <div
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    n.readAt ? "bg-transparent" : "bg-accent"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {n.link ? (
                        <Link href={n.link} className="hover:text-primary hover:underline">
                          {n.title}
                        </Link>
                      ) : (
                        n.title
                      )}
                    </span>
                    <Badge variant="secondary">{TYPE_LABEL[n.type] ?? n.type}</Badge>
                  </div>
                  {n.body && (
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
