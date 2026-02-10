import type { SearchAdapter, SearchFilter, SearchResponse } from "./types";

/**
 * Vector search adapter interface.
 * Stub-ready for pgvector integration in phase 2.
 * Implement this interface when SEARCH_VECTOR_ENABLED=true.
 */
export class VectorSearchAdapter implements SearchAdapter {
  async search(
    _organizationId: string,
    query: string,
    _filter: SearchFilter,
    page: number,
    pageSize: number
  ): Promise<SearchResponse> {
    // Vector search not yet implemented — return empty results
    // When pgvector is available, this will:
    // 1. Generate embedding from query text
    // 2. Perform cosine similarity search against stored embeddings
    // 3. Return ranked results with similarity scores
    return { results: [], total: 0, query, page, pageSize };
  }
}

export function isVectorSearchEnabled(): boolean {
  return process.env.SEARCH_VECTOR_ENABLED === "true";
}
