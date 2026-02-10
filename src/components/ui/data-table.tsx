"use client";

import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  selectedIds?: string[];
  focusedIndex?: number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = "No data found",
  emptyAction,
  onRowClick,
  selectedIds = [],
  focusedIndex = -1,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16" role="status">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-12 w-12 rounded-full bg-bg-subtle flex items-center justify-center">
          <svg className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-sm text-text-muted">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm" role="grid">
        <thead>
          <tr className="border-b border-border/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted/60 whitespace-nowrap",
                  col.className
                )}
                scope="col"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const id = keyExtractor(row);
            const isSelected = selectedIds.includes(id);
            const isFocused = index === focusedIndex;
            return (
              <tr
                key={id}
                className={cn(
                  "border-b border-border/40 transition-all duration-150",
                  onRowClick && "cursor-pointer hover:bg-bg-subtle/70",
                  isSelected && "bg-primary-light",
                  isFocused && "ring-2 ring-inset ring-border-focus"
                )}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && onRowClick) onRowClick(row);
                }}
                role="row"
                aria-selected={isSelected ? "true" : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 text-text", col.className)}
                  >
                    {col.render(row, index)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { type Column, type DataTableProps };
