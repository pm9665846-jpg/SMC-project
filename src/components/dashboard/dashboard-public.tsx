"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquareWarning, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardPublic() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Citizen Portal</h1>
        <p className="text-muted-foreground">Submit and track your complaints</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/complaints/submit">
          <Card className="glass-card transition-all hover:shadow-lg hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Submit complaint</CardTitle>
              <MessageSquareWarning className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm">Report an issue: street lights, garbage, water, roads, etc.</p>
              <Button className="mt-3" size="sm">New complaint</Button>
            </CardContent>
          </Card>
        </Link>
        <Link href="/complaints">
          <Card className="glass-card transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My complaints</CardTitle>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-sm">View status of your submitted complaints</p>
              <Button className="mt-3" variant="outline" size="sm">Track</Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your recent complaints</CardTitle>
          <CardDescription>Status of your submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              { id: "C-1238", title: "Pothole on Main St", status: "in_progress" },
              { id: "C-1230", title: "Street light out", status: "resolved" },
            ].map((c) => (
              <li key={c.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.id}</p>
                </div>
                <Badge variant={c.status === "resolved" ? "success" : "secondary"}>{c.status}</Badge>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/complaints">View all</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
