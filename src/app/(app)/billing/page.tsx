"use client";

import { useMemo } from "react";
import { CreditCard, Package, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useBillingPackets } from "@/lib/query/hooks";

interface BillingPacketRow {
  id: string;
  title: string;
  project?: { id: string; name: string };
  status: string;
  totalHours?: number;
  totalAmount?: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

const PLAN_FEATURES = ["100 projects", "50 team members", "100 clients", "10 GB storage", "AI summaries", "Priority support"];

const packetStatusVariant: Record<string, "default" | "info" | "success" | "warning"> = {
  DRAFT: "default", GENERATED: "info", SENT: "warning", ACKNOWLEDGED: "success",
};

export default function BillingPage() {
  const { data, isLoading, isError, refetch } = useBillingPackets();
  const packets = useMemo(() => (data?.data ?? []) as unknown as BillingPacketRow[], [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-text">Billing</h1>
          <p className="text-sm text-text-muted mt-1">Manage your subscription and billing packets</p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-1.5" />
          Stripe Portal
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 glow-card animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-text">Pro</p>
                <p className="text-sm text-text-muted">$99/mo</p>
              </div>
              <Badge variant="success">ACTIVE</Badge>
            </div>
            <div className="space-y-2 stagger-fast">
              {PLAN_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-text-muted">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Change Plan
            </Button>
          </CardFooter>
        </Card>

        <Card padding="none" className="lg:col-span-2 glow-card animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <CardHeader row className="px-6 pt-6">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Billing Packets
            </CardTitle>
            <Button size="sm" shortcutHint="B">
              Generate Packet
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <PageLoader label="Loading billing packets..." />
            ) : isError ? (
              <ErrorState title="Failed to load packets" message="Could not retrieve billing data." onRetry={() => refetch()} />
            ) : packets.length === 0 ? (
              <EmptyState icon={<Package className="h-6 w-6" />} title="No billing packets" description="Generate your first billing packet from a project." />
            ) : (
              <div className="divide-y divide-border">
                {packets.map((packet) => (
                  <div key={packet.id} className="flex items-center justify-between px-6 py-4 transition-colors duration-150 hover:bg-bg-subtle/50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text">{packet.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {packet.project && <span className="text-xs text-text-muted">{packet.project.name}</span>}
                        <span className="text-xs text-text-muted">
                          {new Date(packet.periodStart).toLocaleDateString()} — {new Date(packet.periodEnd).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-medium text-text">${(packet.totalAmount ?? 0).toLocaleString()}</p>
                        <p className="text-xs text-text-muted">{packet.totalHours ?? 0}h</p>
                      </div>
                      <Badge variant={packetStatusVariant[packet.status] ?? "default"}>
                        {packet.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
