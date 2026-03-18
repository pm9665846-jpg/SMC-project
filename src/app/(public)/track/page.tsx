"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";

const STATUS_MAP: Record<string, { label: string; variant: "secondary" | "default" | "destructive" | "outline" }> = {
  submitted: { label: "Pending", variant: "secondary" },
  assigned: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  resolved: { label: "Completed", variant: "outline" },
  closed: { label: "Completed", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export default function TrackComplaintPage() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complaint, setComplaint] = useState<{
    id: string;
    title: string;
    status: string;
    category: string;
    createdAt: string;
    location?: string;
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const tid = id.trim();
    if (!tid) return;
    setError(null);
    setComplaint(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/public/complaints/track?id=${encodeURIComponent(tid)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Complaint not found");
        return;
      }
      setComplaint(data);
    } catch {
      setError("Failed to fetch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <PageHero
        title="Track Complaint"
        description="Enter your complaint ID to see status: Pending, In Progress, Meeting Scheduled, or Completed."
        icon={Search}
      />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-border/50 shadow-lg shadow-black/5">
          <div className="h-1 w-full bg-gradient-to-r from-primary to-cyan-500" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Search className="h-4 w-4" />
              </span>
              Search by Complaint ID
            </CardTitle>
            <CardDescription>Use the ID you received when you submitted the complaint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="e.g. C-1245 or complaint ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="flex-1 rounded-xl border-2 focus:border-primary/50 focus:ring-primary/20"
              />
              <Button type="submit" disabled={loading} className="rounded-xl px-6">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
              </Button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {complaint && (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-sm font-medium text-muted-foreground">{complaint.id}</p>
                    <Badge variant={STATUS_MAP[complaint.status]?.variant ?? "secondary"} className="rounded-lg">
                      {STATUS_MAP[complaint.status]?.label ?? complaint.status}
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground">{complaint.title}</p>
                  {complaint.location && (
                    <p className="text-sm text-muted-foreground">Location: {complaint.location}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Category: {complaint.category} · Submitted {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
