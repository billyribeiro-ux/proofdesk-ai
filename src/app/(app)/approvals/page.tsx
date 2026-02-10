"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Search, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useApprovals } from "@/lib/query/hooks";

interface ApprovalItem {
  id: string;
  title: string;
  description?: string;
  project?: { id: string; name: string };
  status: string;
  requestedBy?: string;
  dueDate?: string;
  createdAt: string;
  decisions?: { decidedBy: string; decision: string; comment?: string; createdAt: string }[];
}

const statusConfig: Record<string, { variant: "warning" | "success" | "danger" | "info"; label: string }> = {
  PENDING: { variant: "warning", label: "Pending" },
  APPROVED: { variant: "success", label: "Approved" },
  REJECTED: { variant: "danger", label: "Rejected" },
  CHANGES_REQUESTED: { variant: "info", label: "Changes Requested" },
};

export default function ApprovalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useApprovals({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const allApprovals = useMemo(() => (data?.data ?? []) as unknown as ApprovalItem[], [data]);

  const filtered = useMemo(() => {
    if (!search) return allApprovals;
    const q = search.toLowerCase();
    return allApprovals.filter(
      (a) => a.title.toLowerCase().includes(q) || (a.project?.name?.toLowerCase().includes(q) ?? false)
    );
  }, [allApprovals, search]);

  const pendingCount = allApprovals.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-text">Approvals Center</h1>
          <p className="text-sm text-text-muted mt-1">
            {pendingCount} pending approval{pendingCount !== 1 ? "s" : ""} requiring action
          </p>
        </div>
        <Button size="sm">
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          Request Approval
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search approvals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Search approvals" />
        </div>
        <div className="flex items-center gap-2">
          {["all", "PENDING", "APPROVED", "CHANGES_REQUESTED", "REJECTED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>
              {s === "all" ? "All" : statusConfig[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CheckCircle2 className="h-6 w-6" />} title="No approvals found" description="No approvals match your current filters." />
      ) : (
        <div className="space-y-3">
          {filtered.map((approval) => {
            const config = statusConfig[approval.status] ?? { variant: "default" as const, label: approval.status };
            return (
              <Card key={approval.id} padding="md" className="glow-card transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-text">{approval.title}</h3>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <p className="text-xs text-text-muted mb-2">{approval.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {approval.project && <Badge variant="default">{approval.project.name}</Badge>}
                      {approval.requestedBy && <span className="text-xs text-text-muted">By {approval.requestedBy}</span>}
                      {approval.dueDate && <span className="text-xs text-text-muted">Due {new Date(approval.dueDate).toLocaleDateString()}</span>}
                    </div>

                    {(approval.decisions?.length ?? 0) > 0 && (
                      <div className="mt-3 pl-3 border-l-2 border-border space-y-2">
                        {approval.decisions!.map((d, i) => (
                          <div key={i} className="text-xs">
                            <span className="font-medium text-text">{d.decidedBy}</span>
                            <span className="text-text-muted"> — {d.decision.replace("_", " ")}</span>
                            {d.comment && <p className="text-text-muted mt-0.5 italic">&ldquo;{d.comment}&rdquo;</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {approval.status === "PENDING" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="primary" className="h-8" shortcutHint="A">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Changes
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-danger hover:text-danger">
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
