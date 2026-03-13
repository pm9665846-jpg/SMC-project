"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";

export default function DepartmentsPage() {
  const { data: deptsData, isLoading, error } = useFetch<Array<{
    id: string;
    name: string;
    headName: string | null;
    staffCount: number;
  }>>("/api/departments");
  const depts = deptsData ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">Department and staff structure</p>
      </div>

      {error && <p className="text-sm text-destructive">Failed to load departments.</p>}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {depts.length === 0 ? (
            <p className="text-muted-foreground">No departments yet.</p>
          ) : (
            depts.map((d) => (
              <Card key={d.id} className="glass-card transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{d.name}</CardTitle>
                    <CardDescription>Head: {d.headName ?? "—"}</CardDescription>
                  </div>
                  <Badge variant="secondary">{d.staffCount} staff</Badge>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">Manage</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
