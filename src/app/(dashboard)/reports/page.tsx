"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useFetch } from "@/hooks/use-fetch";

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "#3b82f6", "#f59e0b", "hsl(var(--muted-foreground))", "#8b5cf6"];

export default function ReportsPage() {
  const { data, isLoading, error } = useFetch<{
    monthlyData: Array<{ month: string; submitted: number; resolved: number }>;
    categoryData: Array<{ name: string; count: number }>;
  }>("/api/analytics/complaints");

  const monthlyData = data?.monthlyData ?? [];
  const categoryData = (data?.categoryData ?? []).map((c, i) => ({
    ...c,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & analytics</h1>
          <p className="text-muted-foreground">Insights and exportable reports</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">Failed to load analytics.</p>}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Resolution trend
              </CardTitle>
              <CardDescription>Complaints submitted and resolved per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "var(--radius)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar dataKey="resolved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Resolved" />
                    <Bar dataKey="submitted" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Submitted" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Complaints by category</CardTitle>
              <CardDescription>Distribution of complaint types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
