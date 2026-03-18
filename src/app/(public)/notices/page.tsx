"use client";

import { useFetch } from "@/hooks/use-fetch";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Loader2 } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";

export default function NoticesPage() {
  const { data: notices, isLoading } = useFetch<Array<{
    id: string;
    title: string;
    body: string | null;
    type: string;
    publishedAt: string;
  }>>("/api/notices");

  const list = notices ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHero
        title="Notices & Announcements"
        description="Official notices and updates from the municipality."
        icon={Bell}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : list.length === 0 ? (
        <Card className="rounded-2xl border border-border/50 shadow-md">
          <CardContent className="py-16 text-center text-muted-foreground">
            No notices at the moment.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {list.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden rounded-2xl border border-border/50 shadow-md transition-all hover:shadow-lg hover:border-primary/20">
                <div className="h-1 w-full bg-gradient-to-r from-primary to-cyan-500" />
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bell className="h-5 w-5" />
                    </span>
                    <div>
                      <CardTitle className="text-lg">{n.title}</CardTitle>
                      <CardDescription>{new Date(n.publishedAt).toLocaleString()}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-lg shrink-0">{n.type}</Badge>
                </CardHeader>
                {n.body && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{n.body}</p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
