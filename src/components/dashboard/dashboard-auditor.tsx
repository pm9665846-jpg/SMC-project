"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardAuditor() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Dashboard</h1>
        <p className="text-muted-foreground">Compliance and audit trail</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/audit">
          <Card className="glass-card transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Audit logs</CardTitle>
              <FileCheck className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,240</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/bills">
          <Card className="glass-card transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bills reviewed</CardTitle>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="glass-card transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reports</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Generated</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent audit activity</CardTitle>
          <CardDescription>Latest system actions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              { action: "Bill B-089 approved", by: "Admin", time: "10m ago" },
              { action: "Complaint C-1244 assigned", by: "Dept. Head", time: "1h ago" },
              { action: "Meeting M-12 completed", by: "System", time: "2h ago" },
            ].map((a) => (
              <li key={a.action} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.by} · {a.time}</p>
                </div>
                <Badge variant="outline">Audit</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
