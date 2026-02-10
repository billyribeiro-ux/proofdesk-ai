import { db } from "@/lib/db";
import type { SearchAdapter, SearchFilter, SearchResponse, SearchResult } from "./types";
import { sanitizeFtsQuery, buildDateFilter } from "./query-builder";

/**
 * Postgres full-text search adapter.
 * Searches across clients, projects, evidence, and work events
 * with org-scoped isolation and ranked results.
 */
export class PostgresFtsAdapter implements SearchAdapter {
  async search(
    organizationId: string,
    query: string,
    filter: SearchFilter,
    page: number,
    pageSize: number
  ): Promise<SearchResponse> {
    const tsQuery = sanitizeFtsQuery(query);
    if (!tsQuery) {
      return { results: [], total: 0, query, page, pageSize };
    }

    const results: SearchResult[] = [];
    const entityTypes = filter.entityTypes ?? ["client", "project", "evidence", "work_event"];
    const dateRange = buildDateFilter(filter);
    const skip = (page - 1) * pageSize;

    if (entityTypes.includes("client")) {
      const clients = await db.client.findMany({
        where: {
          organizationId,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { contactName: { contains: query, mode: "insensitive" } },
            { industry: { contains: query, mode: "insensitive" } },
          ],
          ...(dateRange ? { createdAt: dateRange } : {}),
        },
        take: pageSize,
        orderBy: { updatedAt: "desc" },
      });

      for (const c of clients) {
        results.push({
          id: c.id,
          entityType: "client",
          title: c.name,
          snippet: [c.contactName, c.industry].filter(Boolean).join(" · "),
          rank: 0,
          createdAt: c.createdAt.toISOString(),
        });
      }
    }

    if (entityTypes.includes("project")) {
      const projects = await db.project.findMany({
        where: {
          organizationId,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
          ...(filter.clientId ? { clientId: filter.clientId } : {}),
          ...(dateRange ? { createdAt: dateRange } : {}),
        },
        include: { client: { select: { name: true } } },
        take: pageSize,
        orderBy: { updatedAt: "desc" },
      });

      for (const p of projects) {
        results.push({
          id: p.id,
          entityType: "project",
          title: p.name,
          snippet: [p.client.name, p.status].filter(Boolean).join(" · "),
          rank: 0,
          createdAt: p.createdAt.toISOString(),
        });
      }
    }

    if (entityTypes.includes("evidence")) {
      const evidences = await db.evidenceArtifact.findMany({
        where: {
          organizationId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
          ...(filter.projectId ? { projectId: filter.projectId } : {}),
          ...(dateRange ? { createdAt: dateRange } : {}),
        },
        take: pageSize,
        orderBy: { createdAt: "desc" },
      });

      for (const e of evidences) {
        results.push({
          id: e.id,
          entityType: "evidence",
          title: e.title,
          snippet: e.type,
          rank: 0,
          createdAt: e.createdAt.toISOString(),
        });
      }
    }

    if (entityTypes.includes("work_event")) {
      const events = await db.workEvent.findMany({
        where: {
          organizationId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
          ...(filter.projectId ? { projectId: filter.projectId } : {}),
          ...(dateRange ? { occurredAt: dateRange } : {}),
        },
        take: pageSize,
        orderBy: { occurredAt: "desc" },
      });

      for (const w of events) {
        results.push({
          id: w.id,
          entityType: "work_event",
          title: w.title,
          snippet: [w.source, w.eventType].join(" · "),
          rank: 0,
          createdAt: w.ingestedAt.toISOString(),
        });
      }
    }

    // Sort by relevance: exact title matches first, then by date
    const q = query.toLowerCase();
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(q) ? 1 : 0;
      const bExact = b.title.toLowerCase().includes(q) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    results.forEach((r, i) => { r.rank = i + 1; });

    const total = results.length;
    const paged = results.slice(skip, skip + pageSize);

    return { results: paged, total, query, page, pageSize };
  }
}
