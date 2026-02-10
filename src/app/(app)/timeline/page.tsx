"use client";

import { useState, useMemo } from "react";
import { Clock, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useTimeline } from "@/lib/query/hooks";

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  project?: { id: string; name: string };
  source: string;
  eventType: string;
  occurredAt: string;
}

const sourceColors: Record<string, string> = {
  figma: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  calendar: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  jira: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  github: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  email: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  manual: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  slack: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

export default function TimelinePage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const { data, isLoading, isError, refetch } = useTimeline({ source: sourceFilter === "all" ? undefined : sourceFilter });

  const events = useMemo(() => {
    const rows = (data?.data ?? []) as unknown as TimelineEvent[];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.project?.name?.toLowerCase().includes(q) ?? false)
    );
  }, [data, search]);

  const sources = useMemo(() => {
    const rows = (data?.data ?? []) as unknown as TimelineEvent[];
    return Array.from(new Set(rows.map((e) => e.source).filter(Boolean)));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Timeline</h1>
          <p className="text-sm text-text-muted mt-1">Canonical view of all work events across projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" aria-label="Previous period">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-text px-2">Oct 2024</span>
          <Button variant="outline" size="sm" aria-label="Next period">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Search timeline events" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted" aria-hidden="true" />
          <button onClick={() => setSourceFilter("all")} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${sourceFilter === "all" ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>
            All
          </button>
          {sources.map((s) => (
            <button key={s} onClick={() => setSourceFilter(s)} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${sourceFilter === s ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Loading timeline..." />
      ) : isError ? (
        <ErrorState title="Failed to load timeline" message="Could not retrieve timeline events." onRetry={() => refetch()} />
      ) : events.length === 0 ? (
        <EmptyState icon={<Clock className="h-6 w-6" />} title="No events found" description={search ? "No events match your search." : "Connect your tools to start ingesting work events."} />
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
          <div className="space-y-1">
            {events.map((event) => (
              <div key={event.id} className="relative pl-14">
                <div className="absolute left-[18px] top-5 h-3 w-3 rounded-full border-2 border-primary bg-bg-elevated" aria-hidden="true" />
                <Card padding="sm" className="hover:shadow-[var(--shadow-md)] transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-text">{event.title}</h3>
                        <span className={`inline-flex items-center rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-medium ${sourceColors[event.source] ?? "bg-bg-subtle text-text-muted"}`}>
                          {event.source}
                        </span>
                      </div>
                      {event.description && <p className="text-xs text-text-muted">{event.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        {event.project && <Badge variant="default">{event.project.name}</Badge>}
                        <span className="text-xs text-text-muted">{new Date(event.occurredAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
