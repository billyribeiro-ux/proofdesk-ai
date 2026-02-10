"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  FolderKanban,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { ROUTES } from "@/lib/constants/app";
import { registerGSAP, staggerFadeIn } from "@/lib/motion/gsap-config";
import { useClients, useProjects, useRisks, useApprovals, useAuditLogs } from "@/lib/query/hooks";


export default function DashboardPage() {
  const { user, org, isDemo } = useAuth();
  const cardsRef = useRef<HTMLDivElement>(null);

  const { data: clientsData } = useClients();
  const { data: projectsData } = useProjects();
  const { data: risksData } = useRisks({ resolved: false });
  const { data: approvalsData } = useApprovals({ status: "PENDING" });
  const { data: auditData } = useAuditLogs({ limit: 5 });

  interface RecentLog { id: string; action: string; entity: string; entityId?: string; createdAt: string }
  const recentLogs = useMemo(() => (auditData?.data ?? []) as unknown as RecentLog[], [auditData]);

  const stats = useMemo(() => [
    { label: "Active Projects", value: String(projectsData?.data?.length ?? 0), change: "", icon: FolderKanban, color: "text-primary" },
    { label: "Clients", value: String(clientsData?.data?.length ?? 0), change: "", icon: Users, color: "text-secondary" },
    { label: "Open Risks", value: String(risksData?.data?.length ?? 0), change: "", icon: AlertTriangle, color: "text-warning" },
    { label: "Pending Approvals", value: String(approvalsData?.data?.length ?? 0), change: "", icon: CheckCircle2, color: "text-success" },
  ], [clientsData, projectsData, risksData, approvalsData]);

  useEffect(() => {
    registerGSAP();
    if (cardsRef.current) {
      staggerFadeIn(cardsRef.current.children);
    }
    return () => {
      // GSAP cleanup on unmount
      try {
        const gsapLib = (window as unknown as Record<string, unknown>).gsap as { killTweensOf?: (t: unknown) => void } | undefined;
        if (gsapLib?.killTweensOf && cardsRef.current) {
          gsapLib.killTweensOf(cardsRef.current.children);
        }
      } catch { /* noop */ }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {isDemo ? "Demo Dashboard" : `Welcome back, ${user?.name ?? "there"}`}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {org?.name ?? "Your organization"} overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-1.5" />
            Last 30 days
          </Button>
          <Button size="sm">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md" className="group glow-card transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-text-muted">{stat.label}</p>
                  <p className="text-3xl font-bold text-text mt-1.5 tracking-tight animate-counter-up">{stat.value}</p>
                </div>
                <div className={`rounded-xl bg-bg-subtle p-2.5 ${stat.color} transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card padding="none" className="lg:col-span-2 glow-card animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <CardHeader row className="px-6 pt-6">
            <CardTitle>Recent Activity</CardTitle>
            <Link href={ROUTES.AUDIT} className="group text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60 stagger-fast">
              {recentLogs.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-3.5 transition-colors duration-150 hover:bg-bg-subtle/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse-glow" />
                    <div className="min-w-0">
                      <p className="text-sm text-text truncate">{item.action} {item.entity}</p>
                      <p className="text-xs text-text-muted font-mono">{item.entityId ?? ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="default">{item.action}</Badge>
                    <span className="text-xs text-text-muted whitespace-nowrap">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <p className="px-6 py-8 text-sm text-text-muted text-center">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glow-card animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 stagger-fast">
            <Link href={ROUTES.CLIENTS_NEW} className="group flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm transition-all duration-200 hover:bg-bg-subtle hover:translate-x-1">
              <Users className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary" />
              <span className="text-text">New Client</span>
            </Link>
            <Link href={ROUTES.PROJECTS} className="group flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm transition-all duration-200 hover:bg-bg-subtle hover:translate-x-1">
              <FolderKanban className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary" />
              <span className="text-text">New Project</span>
            </Link>
            <Link href={ROUTES.APPROVALS} className="group flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm transition-all duration-200 hover:bg-bg-subtle hover:translate-x-1">
              <CheckCircle2 className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary" />
              <span className="text-text">Review Approvals</span>
            </Link>
            <Link href={ROUTES.RISKS} className="group flex items-center gap-3 rounded-[var(--radius-lg)] px-3 py-2.5 text-sm transition-all duration-200 hover:bg-bg-subtle hover:translate-x-1">
              <AlertTriangle className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary" />
              <span className="text-text">Check Risks</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
