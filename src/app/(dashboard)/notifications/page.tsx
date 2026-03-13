"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { useAuth } from "@/providers/auth-provider";

const ROLE_TO_USER_ID: Record<string, string> = {
  admin: "user-admin",
  department_head: "user-head-1",
  staff: "user-staff-1",
  auditor: "user-admin",
  public: "user-admin",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  if (m < 60) return `${m} min ago`;
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const userId = user ? (ROLE_TO_USER_ID[user.role] ?? user.id) : null;
  const { data: notificationsData, isLoading, error } = useFetch<Array<{
    id: string;
    title: string;
    body: string | null;
    type: string;
    readAt: string | null;
    createdAt: string;
  }>>(userId ? `/api/notifications?userId=${encodeURIComponent(userId)}` : null);
  const notifications = notificationsData ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification center</h1>
          <p className="text-muted-foreground">All your alerts and updates</p>
        </div>
        <Button variant="outline" size="sm">
          <Check className="mr-2 h-4 w-4" /> Mark all read
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </CardTitle>
          <CardDescription>Recent activity and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {!userId && <p className="text-muted-foreground">Sign in to see notifications.</p>}
          {error && <p className="text-sm text-destructive">Failed to load notifications.</p>}
          {userId && isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {userId && !isLoading && (
            <ul className="divide-y">
              {notifications.length === 0 ? (
                <li className="py-4 text-muted-foreground">No notifications.</li>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 ${!n.readAt ? "bg-muted/30 -mx-2 px-2 rounded-lg" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.readAt ? "font-medium" : "text-muted-foreground"}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">{formatTime(n.createdAt)}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{n.type}</Badge>
                  </li>
                ))
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
