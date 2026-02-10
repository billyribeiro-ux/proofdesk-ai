"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Search, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useRisks } from "@/lib/query/hooks";

interface RiskItem {
  id: string;
  title: string;
  description?: string;
  project?: { id: string; name: string };
  category: string;
  severity: string;
  resolved: boolean;
  detectedAt: string;
}

const severityVariant: Record<string, "danger" | "warning" | "info" | "default"> = {
  CRITICAL: "danger", HIGH: "warning", MEDIUM: "info", LOW: "default",
};

export default function RisksPage() {
  const [search, setSearch] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useRisks({
    severity: severityFilter === "all" ? undefined : severityFilter,
    resolved: showResolved ? undefined : false,
  });

  const allRisks = useMemo(() => (data?.data ?? []) as unknown as RiskItem[], [data]);

  const filtered = useMemo(() => {
    if (!search) return allRisks;
    const q = search.toLowerCase();
    return allRisks.filter(
      (r) => r.title.toLowerCase().includes(q) || (r.project?.name?.toLowerCase().includes(q) ?? false)
    );
  }, [allRisks, search]);

  const criticalCount = allRisks.filter((r) => !r.resolved && r.severity === "CRITICAL").length;
  const highCount = allRisks.filter((r) => !r.resolved && r.severity === "HIGH").length;
  const openCount = allRisks.filter((r) => !r.resolved).length;

  if (isLoading) return <PageLoader label="Loading risks..." />;
  if (isError) return <ErrorState title="Failed to load risks" message="Could not retrieve risk data." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-text">Risk Monitor</h1>
          <p className="text-sm text-text-muted mt-1">Track scope creep, delivery risks, and blockers</p>
        </div>
        <Button size="sm">
          <AlertTriangle className="h-4 w-4 mr-1.5" />
          Flag Risk
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <Card padding="md" className="glow-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-danger-light flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{criticalCount}</p>
              <p className="text-xs text-text-muted">Critical Risks</p>
            </div>
          </div>
        </Card>
        <Card padding="md" className="glow-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-warning-light flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Shield className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{highCount}</p>
              <p className="text-xs text-text-muted">High Severity</p>
            </div>
          </div>
        </Card>
        <Card padding="md" className="glow-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-info-light flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{openCount}</p>
              <p className="text-xs text-text-muted">Open Risks</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search risks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Search risks" />
        </div>
        <div className="flex items-center gap-2">
          {["all", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => (
            <button key={s} onClick={() => setSeverityFilter(s)} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${severityFilter === s ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <Button variant={showResolved ? "primary" : "outline"} size="sm" onClick={() => setShowResolved(!showResolved)}>
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Shield className="h-6 w-6" />} title="No risks found" description="No risks match your current filters." />
      ) : (
        <div className="space-y-3">
          {filtered.map((risk) => (
            <Card key={risk.id} padding="md" className={`glow-card transition-all duration-200 hover:-translate-y-0.5 ${risk.resolved ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-text">{risk.title}</h3>
                    {risk.resolved && <Badge variant="success">Resolved</Badge>}
                  </div>
                  {risk.description && <p className="text-xs text-text-muted mb-2">{risk.description}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={severityVariant[risk.severity] ?? "default"}>{risk.severity}</Badge>
                    <Badge variant="outline">{risk.category.replace(/_/g, " ")}</Badge>
                    {risk.project && <Badge variant="default">{risk.project.name}</Badge>}
                    <span className="text-xs text-text-muted">Detected {new Date(risk.detectedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {!risk.resolved && (
                  <Button variant="outline" size="sm" shortcutHint="D">
                    Resolve
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
