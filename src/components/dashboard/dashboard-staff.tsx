"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Calendar, MessageSquareWarning } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardStaff() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Work</h1>
        <p className="text-muted-foreground">Tasks and assignments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" /> My Tasks
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tasks">View board</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                { title: "Inspect street light #45", status: "in_progress" },
                { title: "Submit site report", status: "todo" },
                { title: "Follow-up complaint C-1230", status: "review" },
              ].map((t) => (
                <li key={t.title} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm">{t.title}</span>
                  <Badge variant="secondary">{t.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Today&apos;s meetings
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/meetings">Schedule</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between py-2 border-b">
                <span className="text-sm">Zone review - 3:00 PM</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="text-sm">No other meetings</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareWarning className="h-5 w-5" /> Assigned complaints
          </CardTitle>
          <CardDescription>Complaints assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {["C-1245: Street light", "C-1240: Garbage"].map((c) => (
              <li key={c} className="flex justify-between py-2 border-b last:border-0">
                <span className="text-sm">{c}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/complaints">Open</Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
