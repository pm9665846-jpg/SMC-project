"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFetch } from "@/hooks/use-fetch";

const statusVariant = {
  submitted: "secondary",
  assigned: "pending",
  in_progress: "warning",
  resolved: "success",
  closed: "default",
  rejected: "secondary",
} as const;

type BadgeVariant = "default" | "secondary" | "success" | "warning" | "pending";

export default function ComplaintsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: complaintsData,
    isLoading,
    error,
  } = useFetch<
    Array<{
      id: string;
      title: string;
      category: string;
      status: string;
      priority: string;
      createdAt: string;
    }>
  >("/api/complaints");

  const complaints = complaintsData ?? [];

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [complaints, search, statusFilter]);

  const dateStr = (s: string) => s.slice(0, 10);

  const getPriorityVariant = (priority: string): BadgeVariant => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "warning";
      case "high":
        return "warning";
      case "medium":
        return "pending";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">Citizen complaint management</p>
        </div>

        <Button asChild>
          <Link href="/complaints/submit">
            <Plus className="mr-2 h-4 w-4" />
            Submit complaint
          </Link>
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All complaints</CardTitle>
          <CardDescription>View and manage citizen complaints</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <p className="mb-4 text-sm text-destructive">
              Failed to load complaints. Check database connection.
            </p>
          )}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID or title..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No complaints found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs">
                          {row.id}
                        </TableCell>

                        <TableCell className="font-medium">
                          {row.title}
                        </TableCell>

                        <TableCell>{row.category}</TableCell>

                        <TableCell>
                          <Badge variant={getPriorityVariant(row.priority)}>
                            {row.priority}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              statusVariant[
                                row.status as keyof typeof statusVariant
                              ] ?? "secondary"
                            }
                          >
                            {row.status.replace("_", " ")}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {dateStr(row.createdAt)}
                        </TableCell>

                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/complaints/${row.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}