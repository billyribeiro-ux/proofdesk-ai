"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle2, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { ROUTES } from "@/lib/constants/app";
import { useProject, useTimeline, useRisks, useApprovals } from "@/lib/query/hooks";

interface ProjectDetail {
  id: string;
  name: string;
  client?: { id: string; name: string };
  stage: string;
  description?: string;
  startDate?: string;
  slaDeadline?: string;
  slaHours?: number;
  budget?: number;
  memberships?: { user: { name: string }; role: string }[];
}

interface TimelineRow { id: string; title: string; createdAt: string; type?: string }
interface RiskRow { id: string; title: string; severity: string; category: string }
interface ApprovalRow { id: string; title: string; status: string; requestedBy?: string }

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: projectData, isLoading, isError, refetch } = useProject(id);
  const { data: timelineData } = useTimeline({ projectId: id, limit: 5 });
  const { data: risksData } = useRisks({ projectId: id, resolved: false });
  const { data: approvalsData } = useApprovals({ projectId: id, status: "PENDING" });

  const project = useMemo(() => (projectData?.data ?? null) as unknown as ProjectDetail | null, [projectData]);
  const recentEvents = useMemo(() => (timelineData?.data ?? []) as unknown as TimelineRow[], [timelineData]);
  const risks = useMemo(() => (risksData?.data ?? []) as unknown as RiskRow[], [risksData]);
  const pendingApprovals = useMemo(() => (approvalsData?.data ?? []) as unknown as ApprovalRow[], [approvalsData]);

  if (isLoading) return <PageLoader label="Loading project..." />;
  if (isError || !project) return <ErrorState title="Failed to load project" message="Could not retrieve project details." onRetry={() => refetch()} />;

  const statusVariant: Record<string, "success" | "warning" | "info" | "default"> = {
    ACTIVE: "success", COMPLETED: "info", ON_HOLD: "warning", DRAFT: "default",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 animate-fade-in-up">
        <Link href={ROUTES.PROJECTS} className="rounded-[var(--radius-md)] p-1.5 text-text-muted hover:bg-bg-subtle hover:text-text transition-all duration-150" aria-label="Back to projects">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text">{project.name}</h1>
            <Badge variant={statusVariant[project.stage] ?? "default"}>{project.stage}</Badge>
          </div>
          <p className="text-sm text-text-muted mt-0.5">{project.client?.name ?? "—"} · Project {id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" shortcutHint="S">
            <Sparkles className="h-4 w-4 mr-1.5" />
            AI Summary
          </Button>
          <Button variant="outline" size="sm" shortcutHint="B">
            <CreditCard className="h-4 w-4 mr-1.5" />
            Billing Packet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glow-card animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {project.description && <p className="text-sm text-text-muted">{project.description}</p>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.startDate && (
                  <div>
                    <p className="text-xs text-text-muted">Start Date</p>
                    <p className="text-sm font-medium text-text">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                )}
                {project.slaDeadline && (
                  <div>
                    <p className="text-xs text-text-muted">Due Date</p>
                    <p className="text-sm font-medium text-text">{new Date(project.slaDeadline).toLocaleDateString()}</p>
                  </div>
                )}
                {project.slaHours != null && (
                  <div>
                    <p className="text-xs text-text-muted">SLA Hours</p>
                    <p className="text-sm font-medium text-text">{project.slaHours}h</p>
                  </div>
                )}
                {project.budget != null && (
                  <div>
                    <p className="text-xs text-text-muted">Budget</p>
                    <p className="text-sm font-medium text-text">${project.budget.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glow-card animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <CardHeader row>
              <CardTitle>Recent Activity</CardTitle>
              <Link href={ROUTES.TIMELINE} className="group text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1">View full timeline</Link>
            </CardHeader>
            <CardContent>
              {recentEvents.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse-glow" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text">{event.title}</p>
                        <p className="text-xs text-text-muted">{new Date(event.createdAt).toLocaleString()}</p>
                      </div>
                      {event.type && (
                        <Badge variant={event.type === "risk" ? "warning" : event.type === "approval" ? "info" : "default"}>
                          {event.type}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 stagger-children">
          <Card className="glow-card">
            <CardHeader><CardTitle>Team</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(project.memberships ?? []).length === 0 ? (
                <p className="text-sm text-text-muted">No team members assigned</p>
              ) : (
                project.memberships!.map((member) => (
                  <div key={member.user.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-medium text-primary transition-transform duration-200 hover:scale-110">
                      {member.user.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{member.user.name}</p>
                      <p className="text-xs text-text-muted">{member.role}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />Risks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {risks.length === 0 ? (
                <p className="text-sm text-text-muted">No active risks</p>
              ) : (
                risks.map((risk) => (
                  <div key={risk.id} className="rounded-[var(--radius-lg)] border border-warning/20 bg-warning-light p-3">
                    <p className="text-sm font-medium text-text">{risk.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="warning">{risk.severity}</Badge>
                      <span className="text-xs text-text-muted">{risk.category.replace("_", " ")}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-info" />Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingApprovals.length === 0 ? (
                <p className="text-sm text-text-muted">No pending approvals</p>
              ) : (
                pendingApprovals.map((approval) => (
                  <div key={approval.id} className="rounded-[var(--radius-lg)] border border-border p-3">
                    <p className="text-sm font-medium text-text">{approval.title}</p>
                    {approval.requestedBy && <p className="text-xs text-text-muted mt-0.5">By {approval.requestedBy}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" variant="primary" className="h-7 text-xs" shortcutHint="A">Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Request Changes</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
