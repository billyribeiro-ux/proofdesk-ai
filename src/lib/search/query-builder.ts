import type { SearchFilter } from "./types";

/** Sanitize user input for Postgres FTS — escape special characters */
export function sanitizeFtsQuery(raw: string): string {
  return raw
    .replace(/[<>()&|!:*\\]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => `${term}:*`)
    .join(" & ");
}

/** Build a WHERE clause fragment for date range filtering */
export function buildDateFilter(filter: SearchFilter): { gte?: Date; lte?: Date } | undefined {
  if (!filter.dateFrom && !filter.dateTo) return undefined;
  const range: { gte?: Date; lte?: Date } = {};
  if (filter.dateFrom) range.gte = new Date(filter.dateFrom);
  if (filter.dateTo) range.lte = new Date(filter.dateTo);
  return range;
}
