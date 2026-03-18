"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";

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

type Notif = {
  id: string;
  title: string;
  body: string | null;
  type: string;
  readAt: string | null;
  createdAt: string;
  userName?: string;
};

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { data: notificationsData, isLoading, error } = useFetch<Notif[]>(
    "/api/notifications?all=true"
  );
  const notifications = notificationsData ?? [];

  const filtered = useMemo(() => {
    if (typeFilter === "all") return notifications;
    return notifications.filter((n) => n.type.toLowerCase() === typeFilter.toLowerCase());
  }, [notifications, typeFilter]);

  const types = useMemo(() => {
    const set = new Set(notifications.map((n) => n.type));
    return ["all", ...Array.from(set)];
  }, [notifications]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification center</h1>
          <p className="text-muted-foreground">All notifications including complaints and updates</p>
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
          <CardDescription>
            All system notifications. Filter by type: complaints, bills, meetings, etc.
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {types.map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(t)}
              >
                {t === "all" ? "All" : t}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive">Failed to load notifications.</p>}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoading && (
            <ul className="divide-y">
              {filtered.length === 0 ? (
                <li className="py-4 text-muted-foreground">
                  {notifications.length === 0 ? "No notifications yet." : "No notifications for this filter."}
                </li>
              ) : (
                filtered.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 ${!n.readAt ? "bg-muted/30 -mx-2 px-2 rounded-lg" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.readAt ? "font-medium" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{formatTime(n.createdAt)}</span>
                        {n.userName && <span>· For: {n.userName}</span>}
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0 capitalize">{n.type}</Badge>
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
