"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useProjects } from "@/lib/query/hooks";

interface ProjectRow {
  id: string;
  name: string;
  client?: { id: string; name: string };
  stage: string;
  slaDeadline?: string;
  _count?: { riskFlags: number; approvalRequests: number };
}

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  ACTIVE: "success",
  COMPLETED: "info",
  ON_HOLD: "warning",
  DRAFT: "default",
  ARCHIVED: "default",
};

const columns: Column<ProjectRow>[] = [
  {
    key: "name",
    header: "Project",
    render: (row) => (
      <Link href={`/projects/${row.id}`} className="group">
        <p className="font-medium text-text group-hover:text-primary transition-colors">{row.name}</p>
        {row.client && <p className="text-xs text-text-muted">{row.client.name}</p>}
      </Link>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={statusVariant[row.stage] ?? "default"}>{row.stage.replace("_", " ")}</Badge>,
    className: "w-32",
  },
  {
    key: "risks",
    header: "Risks",
    render: (row) => {
      const count = row._count?.riskFlags ?? 0;
      return count > 0 ? <Badge variant="warning">{count}</Badge> : <span className="text-xs text-text-muted">—</span>;
    },
    className: "w-20",
  },
  {
    key: "approvals",
    header: "Approvals",
    render: (row) => {
      const count = row._count?.approvalRequests ?? 0;
      return count > 0 ? <Badge variant="info">{count} pending</Badge> : <span className="text-xs text-text-muted">—</span>;
    },
    className: "w-28",
  },
  {
    key: "due",
    header: "Due Date",
    render: (row) => row.slaDeadline ? <span className="text-sm text-text-muted">{new Date(row.slaDeadline).toLocaleDateString()}</span> : <span className="text-xs text-text-muted">—</span>,
    className: "w-28",
  },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data, isLoading, isError, refetch } = useProjects();

  const allProjects = useMemo(() => (data?.data ?? []) as unknown as ProjectRow[], [data]);

  const filtered = useMemo(() => {
    let rows = allProjects;
    if (statusFilter !== "all") rows = rows.filter((p) => p.stage === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(q) || (p.client?.name?.toLowerCase().includes(q) ?? false));
    }
    return rows;
  }, [allProjects, statusFilter, search]);

  if (isLoading) return <PageLoader label="Loading projects..." />;
  if (isError) return <ErrorState title="Failed to load projects" message="Could not retrieve project data." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Projects</h1>
          <p className="text-sm text-text-muted mt-1">Track and manage all project deliverables</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          New Project
        </Button>
      </div>

      <Card padding="none">
        <div className="flex items-center gap-3 p-4 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Search projects" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
            {["all", "ACTIVE", "DRAFT", "ON_HOLD", "COMPLETED"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}
              >
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title={search ? "No projects match your search" : "No projects yet"} description={search ? "Try a different search term." : "Create your first project to start tracking work and generating evidence."} action={!search ? <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Create Project</Button> : undefined} />
        ) : (
          <DataTable columns={columns} data={filtered} keyExtractor={(row) => row.id} emptyMessage="No projects match your filters" />
        )}
      </Card>
    </div>
  );
}
