"use client";

import { useState, useMemo } from "react";
import { FileCheck, Plus, Search, ExternalLink, File, Image, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useEvidence } from "@/lib/query/hooks";

interface EvidenceItem {
  id: string;
  title: string;
  type: string;
  project?: { id: string; name: string };
  url?: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedBy?: string;
  createdAt: string;
}

const typeIcons: Record<string, typeof File> = {
  design: Image,
  document: File,
  report: FileCheck,
  screenshot: Image,
  email: File,
  link: Link2,
};

function formatBytes(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function EvidencePage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useEvidence({ type: typeFilter === "all" ? undefined : typeFilter });

  const evidence = useMemo(() => {
    const rows = (data?.data ?? []) as unknown as EvidenceItem[];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (e) => e.title.toLowerCase().includes(q) || (e.project?.name?.toLowerCase().includes(q) ?? false)
    );
  }, [data, search]);

  const types = useMemo(() => {
    const rows = (data?.data ?? []) as unknown as EvidenceItem[];
    return Array.from(new Set(rows.map((e) => e.type).filter(Boolean)));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Evidence Library</h1>
          <p className="text-sm text-text-muted mt-1">Artifacts and provenance for all project work</p>
        </div>
        <Button size="sm" shortcutHint="E">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Evidence
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search evidence..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Search evidence" />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTypeFilter("all")} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors ${typeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>All</button>
          {types.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium transition-colors capitalize ${typeFilter === t ? "bg-primary text-primary-foreground" : "bg-bg-subtle text-text-muted hover:text-text"}`}>{t}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoader label="Loading evidence..." />
      ) : isError ? (
        <ErrorState title="Failed to load evidence" message="Could not retrieve evidence artifacts." onRetry={() => refetch()} />
      ) : evidence.length === 0 ? (
        <EmptyState icon={<FileCheck className="h-6 w-6" />} title="No evidence found" description={search ? "No evidence matches your search." : "Upload or link evidence artifacts to build your proof library."} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidence.map((item) => {
            const Icon = typeIcons[item.type] ?? File;
            return (
              <Card key={item.id} padding="md" className="hover:shadow-[var(--shadow-md)] transition-shadow group">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-bg-subtle flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-text-muted" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-text truncate">{item.title}</h3>
                      {item.url && <ExternalLink className="h-3.5 w-3.5 text-text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                    {item.project && <p className="text-xs text-text-muted mt-0.5">{item.project.name}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default">{item.type}</Badge>
                      <span className="text-xs text-text-muted">{formatBytes(item.sizeBytes)}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1.5">
                      {item.uploadedBy ?? "System"} · {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
