"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Archive, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PageLoader } from "@/components/ui/loading-spinner";
import { ROUTES } from "@/lib/constants/app";
import { useClients } from "@/lib/query/hooks";

interface ClientRow {
  id: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  industry?: string;
  _count?: { projects: number };
  archived: boolean;
  createdAt: string;
}

const columns: Column<ClientRow>[] = [
  {
    key: "name",
    header: "Client",
    render: (row) => (
      <div>
        <p className="font-medium text-text">{row.name}</p>
        {row.industry && <p className="text-xs text-text-muted">{row.industry}</p>}
      </div>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    render: (row) => (
      <div>
        {row.contactName && <p className="text-sm text-text">{row.contactName}</p>}
        {row.contactEmail && <p className="text-xs text-text-muted">{row.contactEmail}</p>}
      </div>
    ),
  },
  {
    key: "projects",
    header: "Projects",
    render: (row) => {
      const count = row._count?.projects ?? 0;
      return (
        <Badge variant={count > 0 ? "info" : "default"}>
          {count} project{count !== 1 ? "s" : ""}
        </Badge>
      );
    },
    className: "w-32",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={row.archived ? "default" : "success"}>
        {row.archived ? "Archived" : "Active"}
      </Badge>
    ),
    className: "w-28",
  },
  {
    key: "actions",
    header: "",
    render: () => (
      <button className="p-1 rounded-[var(--radius-md)] text-text-muted hover:text-text hover:bg-bg-subtle transition-all duration-150 hover:scale-110" aria-label="More actions">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    ),
    className: "w-12",
  },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const { data, isLoading, isError, refetch } = useClients({ archived: showArchived || undefined });

  const clients = useMemo(() => {
    const rows = (data?.data ?? []) as unknown as ClientRow[];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.contactName?.toLowerCase().includes(q) ?? false)
    );
  }, [data, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-text">Clients</h1>
          <p className="text-sm text-text-muted mt-1">Manage your client relationships</p>
        </div>
        <Link href={ROUTES.CLIENTS_NEW}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Client
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <PageLoader label="Loading clients..." />
      ) : isError ? (
        <ErrorState
          title="Failed to load clients"
          message="Could not retrieve your client list. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <Card padding="none" className="glow-card animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 p-4 border-b border-border/60">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search clients"
              />
            </div>
            <Button
              variant={showArchived ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4 mr-1.5" />
              {showArchived ? "Hide Archived" : "Show Archived"}
            </Button>
          </div>

          {clients.length === 0 ? (
            <EmptyState
              title={search ? "No clients match your search" : "No clients yet"}
              description={search ? "Try a different search term." : "Add your first client to start tracking projects and evidence."}
              action={
                !search ? (
                  <Link href={ROUTES.CLIENTS_NEW}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Client
                    </Button>
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={clients}
              keyExtractor={(row) => row.id}
              emptyMessage="No clients match your search"
            />
          )}
        </Card>
      )}
    </div>
  );
}
