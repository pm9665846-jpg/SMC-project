"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquareWarning,
  Briefcase,
  FileText,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { useFetch } from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";

export function DashboardAdmin() {
  const { data: stats, isLoading: statsLoading } = useFetch<{
    openComplaints: number;
    activeProjects: number;
    pendingBills: number;
    resolutionRate: number;
  }>("/api/dashboard/stats");

  const { data: complaintsData } = useFetch<Array<{ id: string; title: string; status: string; priority: string }>>("/api/complaints");
  const { data: billsData } = useFetch<Array<{ id: string; title: string; amount: number; departmentName: string; status?: string }>>("/api/bills");
  const { data: departmentsData } = useFetch<Array<{ name: string; id: string }>>("/api/departments");

  const complaints = complaintsData ?? [];
  const bills = billsData ?? [];
  const departments = departmentsData ?? [];
  const recentComplaints = complaints.slice(0, 3);
  const pendingBillsList = bills.filter((b) => b.status === "pending" || !b.status).slice(0, 3);

  const statCards = [
    { label: "Open Complaints", value: stats?.openComplaints ?? 0, change: "+12%", trend: "up" as const, icon: MessageSquareWarning, href: "/complaints" },
    { label: "Active Projects", value: stats?.activeProjects ?? 0, change: "+5%", trend: "up" as const, icon: Briefcase, href: "/projects" },
    { label: "Pending Bills", value: stats?.pendingBills ?? 0, change: "-8%", trend: "down" as const, icon: FileText, href: "/bills" },
    { label: "Resolution Rate", value: stats ? `${stats.resolutionRate}%` : "0%", change: "+2%", trend: "up" as const, icon: TrendingUp, href: "/reports" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Municipal operations overview and controls</p>
      </div>

      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} href={s.href}>
                <Card className="glass-card transition-all duration-200 hover:shadow-lg hover:border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {s.label}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                      {s.change} from last month
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Complaints and resolution trends</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Workload by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {departments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No departments.</p>
            ) : (
              departments.slice(0, 4).map((d) => (
                <div key={d.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{d.name}</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>Latest citizen submissions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/complaints">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentComplaints.length === 0 ? (
                <li className="text-sm text-muted-foreground">No complaints yet.</li>
              ) : (
                recentComplaints.map((c) => (
                  <li key={c.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.id}</p>
                    </div>
                    <Badge variant={c.status === "resolved" ? "success" : "secondary"}>{c.status}</Badge>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Bills awaiting approval</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/bills/approvals">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pendingBillsList.length === 0 ? (
                <li className="text-sm text-muted-foreground">No pending bills.</li>
              ) : (
                pendingBillsList.map((b) => (
                  <li key={b.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{b.id}</p>
                      <p className="text-xs text-muted-foreground">{b.departmentName ?? "—"}</p>
                    </div>
                    <span className="font-semibold">₹{Number(b.amount).toLocaleString()}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
