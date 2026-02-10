"use client";

import { useState, useMemo } from "react";
import { ScrollText, Search, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useAuditLogs } from "@/lib/query/hooks";

interface AuditRow {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  ipAddress?: string;
  createdAt: string;
}

const actionVariant: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  CREATE: "success", UPDATE: "info", DELETE: "danger", APPROVE: "success", REJECT: "danger", GENERATE: "info", INVITE: "info", RESOLVE: "success",
};

const columns: Column<AuditRow>[] = [
  { key: "time", header: "Time", render: (row) => <span className="text-xs text-text-muted whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</span>, className: "w-44" },
  { key: "action", header: "Action", render: (row) => <Badge variant={actionVariant[row.action] ?? "default"}>{row.action}</Badge>, className: "w-28" },
  { key: "entity", header: "Entity", render: (row) => (<div><p className="text-sm text-text">{row.entity}</p>{row.entityId && <p className="text-xs text-text-muted font-mono">{row.entityId}</p>}</div>) },
  { key: "user", header: "User", render: (row) => <span className="text-sm text-text">{row.userId ?? "System"}</span>, className: "w-36" },
  { key: "ip", header: "IP", render: (row) => <span className="text-xs text-text-muted font-mono">{row.ipAddress ?? "—"}</span>, className: "w-32" },
];

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useAuditLogs({
    entity: entityFilter === "all" ? undefined : entityFilter,
  });

  const allLogs = useMemo(() => (data?.data ?? []) as unknown as AuditRow[], [data]);

  const entities = useMemo(() => {
    return Array.from(new Set(allLogs.map((l) => l.entity).filter(Boolean)));
  }, [allLogs]);

  const filtered = useMemo(() => {
    if (!search) return allLogs;
    const q = search.toLowerCase();
    return allLogs.filter(
      (l) => l.action.toLowerCase().includes(q) || l.entity.toLowerCase().includes(q) || (l.userId?.toLowerCase().includes(q) ?? false)
    );
  }, [allLogs, search]);

  if (isLoading) return <PageLoader label="Loading audit logs..." />;
  if (isError) return <ErrorState title="Failed to load audit logs" message="Could not retrieve audit data." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Audit Explorer</h1>
          <p className="text-sm text-text-muted mt-1">Immutable log of all actions across your organization</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1.5" />
          Export CSV
        </Button>
      </div>

      <Card padding="none">
        <div className="flex items-center gap-3 p-4 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input placeholder="Search audit logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Search audit logs" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <button onClick={() => setEntityFilter("all")} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${entityFilter === "all" ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>All</button>
            {entities.map((ent) => (
              <button key={ent} onClick={() => setEntityFilter(ent)} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${entityFilter === ent ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>{ent}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<ScrollText className="h-6 w-6" />} title="No audit logs found" description="No logs match your current filters." />
        ) : (
          <DataTable columns={columns} data={filtered} keyExtractor={(row) => row.id} />
        )}
      </Card>
    </div>
  );
}
