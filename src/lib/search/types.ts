export type SearchEntityType = "client" | "project" | "evidence" | "work_event";

export interface SearchFilter {
  entityTypes?: SearchEntityType[];
  projectId?: string;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult {
  id: string;
  entityType: SearchEntityType;
  title: string;
  snippet?: string;
  rank: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  page: number;
  pageSize: number;
}

export interface SearchAdapter {
  search(
    organizationId: string,
    query: string,
    filter: SearchFilter,
    page: number,
    pageSize: number
  ): Promise<SearchResponse>;
}
