"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: complaint, isLoading, error, refetch } = useFetch<{
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    submittedBy: string;
    assigneeName: string | null;
    departmentName: string | null;
    location: string | null;
    createdAt: string;
    updatedAt: string;
  }>(id ? `/api/complaints/${id}` : null);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) refetch();
    } catch (_) {}
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/complaints">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Complaint {id}</h1>
          <p className="text-muted-foreground">View and update complaint details</p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">Failed to load complaint.</p>}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : complaint ? (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{complaint.title}</CardTitle>
              <CardDescription>
                Submitted on {complaint.createdAt.slice(0, 10)} · Category: {complaint.category}
              </CardDescription>
            </div>
            <Badge variant="secondary">{complaint.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{complaint.description || "—"}</p>
            </div>
            {complaint.location && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm">{complaint.location}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <p className="text-sm font-medium text-muted-foreground w-full">Priority</p>
              <Badge>{complaint.priority}</Badge>
              {complaint.assigneeName && <Badge variant="outline">Assigned to {complaint.assigneeName}</Badge>}
              {complaint.departmentName && <Badge variant="outline">{complaint.departmentName}</Badge>}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {complaint.status !== "resolved" && (
                <Button size="sm" onClick={() => handleStatusUpdate("resolved")}>
                  Mark resolved
                </Button>
              )}
              {complaint.status === "open" && (
                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("assigned")}>
                  Mark assigned
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        !isLoading && <p className="text-muted-foreground">Complaint not found.</p>
      )}
    </div>
  );
}
