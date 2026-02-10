export type { SearchEntityType, SearchFilter, SearchResult, SearchResponse, SearchAdapter } from "./types";
export { sanitizeFtsQuery, buildDateFilter } from "./query-builder";
export { PostgresFtsAdapter } from "./fts";
export { VectorSearchAdapter, isVectorSearchEnabled } from "./vector-adapter";

import type { SearchAdapter } from "./types";
import { PostgresFtsAdapter } from "./fts";
import { VectorSearchAdapter, isVectorSearchEnabled } from "./vector-adapter";

/** Get the active search adapter based on configuration */
export function getSearchAdapter(): SearchAdapter {
  if (isVectorSearchEnabled()) return new VectorSearchAdapter();
  return new PostgresFtsAdapter();
}
