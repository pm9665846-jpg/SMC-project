"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquareWarning, Users, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "My Dept. Complaints", value: "24", icon: MessageSquareWarning, href: "/complaints" },
  { label: "Team Members", value: "12", icon: Users, href: "/staff" },
  { label: "Pending Bills", value: "5", icon: FileText, href: "/bills" },
  { label: "Upcoming Meetings", value: "3", icon: Calendar, href: "/meetings" },
];

export function DashboardDepartmentHead() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Department Head Dashboard</h1>
        <p className="text-muted-foreground">Your department workload and approvals</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="glass-card transition-all duration-200 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{s.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Team task progress</CardTitle>
          <CardDescription>Current sprint overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Road repair - Block A", "Drain cleaning - Zone 2", "Street light audit"].map((t, i) => (
            <div key={t}>
              <div className="flex justify-between text-sm mb-1">
                <span>{t}</span>
                <Badge variant="secondary">{[65, 40, 90][i]}%</Badge>
              </div>
              <Progress value={[65, 40, 90][i]} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
