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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { useFetch } from "@/hooks/use-fetch";

export function DashboardAdmin() {
  const { data: stats, isLoading: statsLoading } = useFetch<{
    openComplaints: number;
    activeProjects: number;
    pendingBills: number;
    resolutionRate: number;
  }>("/api/dashboard/stats");

  const { data: complaintsData } = useFetch<
    Array<{ id: string; title: string; status: string; priority: string }>
  >("/api/complaints");

  const { data: billsData } = useFetch<
    Array<{ id: string; title: string; amount: number; departmentName: string; status?: string }>
  >("/api/bills");

  const { data: departmentsData } = useFetch<Array<{ name: string; id: string }>>("/api/departments");

  const complaints = complaintsData ?? [];
  const bills = billsData ?? [];
  const departments = departmentsData ?? [];
  const recentComplaints = complaints.slice(0, 3);
  const pendingBillsList = bills.filter((b) => b.status === "pending" || !b.status).slice(0, 3);

  const statCards = [
    {
      label: "Open Complaints",
      value: stats?.openComplaints ?? 0,
      change: "+12%",
      trend: "up" as const,
      icon: MessageSquareWarning,
      href: "/complaints",
    },
    {
      label: "Active Projects",
      value: stats?.activeProjects ?? 0,
      change: "+5%",
      trend: "up" as const,
      icon: Briefcase,
      href: "/projects",
    },
    {
      label: "Pending Bills",
      value: stats?.pendingBills ?? 0,
      change: "-8%",
      trend: "down" as const,
      icon: FileText,
      href: "/bills",
    },
    {
      label: "Resolution Rate",
      value: stats ? `${stats.resolutionRate}%` : "0%",
      change: "+2%",
      trend: "up" as const,
      icon: TrendingUp,
      href: "/reports",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

        {/* Animated floating orbs */}
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_35%)]" />
      </div>

      <div className="space-y-8 p-1 animate-in fade-in-0 duration-700">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10" />
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                  Municipal operations overview, analytics, approvals and control center
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.7)]" />
                <span className="text-sm text-muted-foreground font-medium">System Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s, index) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="group animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-primary/[0.08] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

                    <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {s.label}
                      </CardTitle>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </CardHeader>

                    <CardContent className="relative">
                      <div className="text-3xl font-bold tracking-tight">{s.value}</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                        <ArrowUpRight
                          className={`h-3 w-3 ${
                            s.trend === "up" ? "text-emerald-500" : "text-rose-500 rotate-90"
                          }`}
                        />
                        {s.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Analytics + Department Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.15)]">
            <CardHeader>
              <CardTitle className="text-xl">Analytics</CardTitle>
              <CardDescription>Complaints and resolution trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-white/10 bg-background/40 p-2 backdrop-blur-md">
                <AnalyticsCharts />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.15)]">
            <CardHeader>
              <CardTitle className="text-xl">Department Overview</CardTitle>
              <CardDescription>Workload by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {departments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No departments.</p>
              ) : (
                departments.slice(0, 4).map((d, index) => (
                  <div
                    key={d.id}
                    className="animate-in fade-in-0 slide-in-from-right-4 duration-700"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{d.name}</span>
                      <span className="text-muted-foreground">{40 + index * 10}%</span>
                    </div>
                    <Progress
                      value={40 + index * 10}
                      className="h-2 rounded-full bg-white/10"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Complaints + Pending Approvals */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.15)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Complaints</CardTitle>
                <CardDescription>Latest citizen submissions</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
              >
                <Link href="/complaints">View all</Link>
              </Button>
            </CardHeader>

            <CardContent>
              <ul className="space-y-4">
                {recentComplaints.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No complaints yet.</li>
                ) : (
                  recentComplaints.map((c, index) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:bg-white/[0.06] hover:translate-x-1 animate-in fade-in-0 slide-in-from-left-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div>
                        <p className="font-medium text-sm">{c.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{c.id}</p>
                      </div>

                      <Badge
                        variant={c.status === "resolved" ? "success" : "secondary"}
                        className="capitalize"
                      >
                        {c.status}
                      </Badge>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_80px_rgba(0,0,0,0.15)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Pending Approvals</CardTitle>
                <CardDescription>Bills awaiting approval</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
              >
                <Link href="/bills/approvals">View all</Link>
              </Button>
            </CardHeader>

            <CardContent>
              <ul className="space-y-4">
                {pendingBillsList.length === 0 ? (
                  <li className="text-sm text-muted-foreground">No pending bills.</li>
                ) : (
                  pendingBillsList.map((b, index) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:bg-white/[0.06] hover:translate-x-1 animate-in fade-in-0 slide-in-from-right-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div>
                        <p className="font-medium text-sm">{b.id}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {b.departmentName ?? "—"}
                        </p>
                      </div>
                      <span className="font-semibold text-primary">
                        ₹{Number(b.amount).toLocaleString()}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}