"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

const ROLE_TO_USER_ID: Record<string, string> = {
  admin: "user-admin",
  department_head: "user-head-1",
  staff: "user-staff-1",
  auditor: "user-admin",
  public: "user-admin",
};

export default function BillApprovalsPage() {
  const { user } = useAuth();
  const { data: billsData, isLoading, error, refetch } = useFetch<Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    departmentName: string | null;
    createdAt: string;
  }>>("/api/bills");
  const [acting, setActing] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const bills = billsData ?? [];

  const pending = bills.filter((b) => b.status === "pending");
  const approvedBy = user ? (ROLE_TO_USER_ID[user.role] ?? user.id) : "";

  const handleApprove = async (id: string, approved: boolean) => {
    setActionError(null);
    setActing(id);
    try {
      const res = await fetch(`/api/bills/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved, approvedBy }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        refetch();
      } else {
        setActionError(data.error ?? "Failed to update bill.");
      }
    } catch {
      setActionError("Failed to update bill.");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending approvals</h1>
        <p className="text-muted-foreground">Bills awaiting your approval</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Bills to approve</CardTitle>
          <CardDescription>Review and approve or reject</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive mb-4">Failed to load bills.</p>}
          {actionError && <p className="text-sm text-destructive mb-4">{actionError}</p>}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No pending bills to approve.
                    </TableCell>
                  </TableRow>
                ) : (
                  pending.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">{row.id}</TableCell>
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell>{row.departmentName ?? "—"}</TableCell>
                      <TableCell>₹{Number(row.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{row.createdAt.slice(0, 10)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            disabled={acting === row.id}
                            onClick={() => handleApprove(row.id, true)}
                          >
                            {acting === row.id ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : null}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={acting === row.id}
                            onClick={() => handleApprove(row.id, false)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
