"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Users, Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";

export default function MeetingsPage() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("09:00");
  const [departmentId, setDepartmentId] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: meetingsData, isLoading, error, refetch } = useFetch<Array<{
    id: string;
    title: string;
    agenda: string | null;
    date: string;
    time: string;
    status: string;
    participants: number;
  }>>("/api/meetings");
  const meetings = meetingsData ?? [];

  const { data: departmentsData } = useFetch<Array<{ id: string; name: string }>>("/api/departments");
  const departments = departmentsData ?? [];

  const { data: staffData } = useFetch<Array<{ id: string; name: string; email: string }>>("/api/staff");
  const staff = staffData ?? [];

  const resetForm = () => {
    setTitle("");
    setAgenda("");
    setMeetingDate("");
    setMeetingTime("09:00");
    setDepartmentId("");
    setParticipantIds([]);
    setFormError(null);
  };

  const handleOpenSchedule = () => {
    resetForm();
    setScheduleOpen(true);
  };

  const handleCloseSchedule = () => {
    setScheduleOpen(false);
    resetForm();
  };

  const toggleParticipant = (id: string) => {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!meetingDate.trim()) {
      setFormError("Date is required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          agenda: agenda.trim() || undefined,
          meetingDate: meetingDate.trim(),
          meetingTime: meetingTime.trim() || "09:00",
          departmentId: departmentId.trim() || undefined,
          participantIds: participantIds.length > 0 ? participantIds : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error ?? "Failed to create meeting.");
        return;
      }
      refetch();
      handleCloseSchedule();
    } catch {
      setFormError("Failed to create meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">Schedule and discussion workflow</p>
        </div>
        <Button onClick={handleOpenSchedule}>Schedule meeting</Button>
      </div>

      <Dialog open={scheduleOpen} onOpenChange={(open) => !open && handleCloseSchedule()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule meeting</DialogTitle>
            <DialogDescription>Create a new meeting and add it to the calendar.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitMeeting} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-title">Title</Label>
              <Input
                id="meeting-title"
                placeholder="e.g. Zone review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-agenda">Agenda (optional)</Label>
              <textarea
                id="meeting-agenda"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Brief agenda or topics"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Department (optional)</Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {departments.length === 0 ? (
                    <SelectItem value="__none__" disabled>No departments</SelectItem>
                  ) : (
                    departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {staff.length > 0 && (
              <div className="space-y-2">
                <Label>Participants (optional)</Label>
                <div className="max-h-32 overflow-y-auto rounded-md border border-input bg-muted/30 p-2 space-y-1.5">
                  {staff.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={participantIds.includes(s.id)}
                        onChange={() => toggleParticipant(s.id)}
                        className="rounded border-input"
                      />
                      <span>{s.name}</span>
                      <span className="text-muted-foreground text-xs">({s.email})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseSchedule} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {error && <p className="text-sm text-destructive">Failed to load meetings.</p>}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meetings.map((m) => (
            <Card key={m.id} className="glass-card transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{m.title}</CardTitle>
                  <Badge variant={m.status === "completed" ? "success" : "secondary"}>{m.status}</Badge>
                </div>
                <CardDescription>{m.agenda ?? "—"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {m.date}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {m.time}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" /> {m.participants} participants
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2">View details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Meeting workflow timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 space-y-6 border-l-2 border-primary/30">
            {meetings.slice(0, 5).map((m) => (
              <div key={m.id} className="relative flex gap-4">
                <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-primary" />
                <div className="flex-1 pb-6">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground">{m.date} · {m.time}</p>
                  <Badge variant="outline" className="mt-1">{m.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
