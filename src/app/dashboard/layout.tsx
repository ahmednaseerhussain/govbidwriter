import Link from "next/link";
import { Bell, FileCheck2, LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";
import { getUnreadCount } from "@/lib/notifications";
import { DashboardNav } from "@/components/dashboard/nav";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const unreadCount = await getUnreadCount(user.id);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-primary"
          >
            <FileCheck2 className="h-5 w-5" />
            GovBidWriter
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/notifications"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r bg-muted/30 lg:block">
          <div className="sticky top-14 p-4">
            <DashboardNav />
          </div>
        </aside>

        <div className="flex-1">
          {/* Mobile nav */}
          <div className="border-b bg-muted/30 px-4 py-2 lg:hidden">
            <DashboardNav horizontal />
          </div>
          <main className="p-4 lg:p-8">{children}</main>
          <p className="px-4 pb-6 text-xs text-muted-foreground lg:px-8">
            {DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
