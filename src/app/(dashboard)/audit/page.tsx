"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { useState, useMemo } from "react";

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const url = useMemo(() => {
    const u = "/api/audit";
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `${u}?${s}` : u;
  }, [q]);
  const { data: logsData, isLoading, error } = useFetch<Array<{
    id: string;
    action: string;
    userId: string;
    userEmail: string | null;
    entityType: string | null;
    entityId: string | null;
    createdAt: string;
  }>>(url);
  const logs = logsData ?? [];

  const handleSearch = () => setQ(search.trim());

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit trail</h1>
        <p className="text-muted-foreground">System action logs for compliance</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Audit logs</CardTitle>
          <CardDescription>All system actions with user and timestamp</CardDescription>
          <div className="flex gap-2 max-w-sm mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="secondary" onClick={handleSearch}>Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive mb-4">Failed to load audit logs.</p>}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">{row.id}</TableCell>
                      <TableCell className="font-medium">{row.action}</TableCell>
                      <TableCell>{row.userEmail ?? row.userId}</TableCell>
                      <TableCell>
                        {row.entityType && row.entityId ? (
                          <Badge variant="outline">{row.entityType}: {row.entityId}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(row.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
