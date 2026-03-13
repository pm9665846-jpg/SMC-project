"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";

export default function ProjectsPage() {
  const { data: projectsData, isLoading, error } = useFetch<Array<{
    id: string;
    name: string;
    departmentName: string | null;
    progress: number;
    status: string;
  }>>("/api/projects");
  const projects = projectsData ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Work & projects</h1>
        <p className="text-muted-foreground">Track project progress and workload</p>
      </div>

      {error && <p className="text-sm text-destructive">Failed to load projects.</p>}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <p className="text-muted-foreground col-span-full">No projects yet.</p>
          ) : (
            projects.map((p) => (
              <Card key={p.id} className="glass-card transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <Badge variant={p.status === "completed" ? "success" : "secondary"}>{p.status}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{p.departmentName ?? "—"}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">View details</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
