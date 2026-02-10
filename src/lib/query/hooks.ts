"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";

// ─── Shared types ───────────────────────────────────────────

interface ListResponse<T = Record<string, unknown>> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
}

// ─── CLIENTS ────────────────────────────────────────────────

export function useClients(params?: { archived?: boolean }) {
  return useQuery({
    queryKey: queryKeys.clients.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<ListResponse>(
        `/api/clients${params?.archived ? "?archived=true" : ""}`
      ),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post("/api/clients", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}

// ─── PROJECTS ───────────────────────────────────────────────

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.list(),
    queryFn: () => apiClient.get<ListResponse>("/api/projects"),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () =>
      apiClient.get<{ data: Record<string, unknown> }>(`/api/projects/${id}`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post("/api/projects", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

// ─── TIMELINE ───────────────────────────────────────────────

export function useTimeline(params?: {
  projectId?: string;
  source?: string;
  limit?: number;
  offset?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.projectId) qs.set("projectId", params.projectId);
  if (params?.source) qs.set("source", params.source);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const q = qs.toString();
  return useQuery({
    queryKey: queryKeys.timeline.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<ListResponse>(`/api/timeline${q ? `?${q}` : ""}`),
  });
}

// ─── EVIDENCE ───────────────────────────────────────────────

export function useEvidence(params?: { projectId?: string; type?: string }) {
  const qs = new URLSearchParams();
  if (params?.projectId) qs.set("projectId", params.projectId);
  if (params?.type) qs.set("type", params.type);
  const q = qs.toString();
  return useQuery({
    queryKey: queryKeys.evidence.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<ListResponse>(`/api/evidence${q ? `?${q}` : ""}`),
  });
}

// ─── RISKS ──────────────────────────────────────────────────

export function useRisks(params?: {
  projectId?: string;
  severity?: string;
  resolved?: boolean;
}) {
  const qs = new URLSearchParams();
  if (params?.projectId) qs.set("projectId", params.projectId);
  if (params?.severity) qs.set("severity", params.severity);
  if (params?.resolved !== undefined)
    qs.set("resolved", String(params.resolved));
  const q = qs.toString();
  return useQuery({
    queryKey: queryKeys.risks.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<ListResponse>(`/api/risks${q ? `?${q}` : ""}`),
  });
}

export function useCreateRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post("/api/risks", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.risks.all });
    },
  });
}

// ─── APPROVALS ──────────────────────────────────────────────

export function useApprovals(params?: {
  projectId?: string;
  status?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.projectId) qs.set("projectId", params.projectId);
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString();
  return useQuery({
    queryKey: queryKeys.approvals.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<ListResponse>(`/api/approvals${q ? `?${q}` : ""}`),
  });
}

export function useCreateApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post("/api/approvals", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.approvals.all });
    },
  });
}

// ─── BILLING ────────────────────────────────────────────────

export function useBillingPackets(params?: {
  projectId?: string;
  status?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.projectId) qs.set("projectId", params.projectId);
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString();
  return useQuery({
    queryKey: queryKeys.billing.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<ListResponse>(`/api/billing${q ? `?${q}` : ""}`),
  });
}

// ─── AUDIT ──────────────────────────────────────────────────

export function useAuditLogs(params?: {
  entity?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.entity) qs.set("entity", params.entity);
  if (params?.action) qs.set("action", params.action);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const q = qs.toString();
  return useQuery({
    queryKey: queryKeys.audit.list(params as Record<string, unknown>),
    queryFn: () =>
      apiClient.get<ListResponse>(`/api/audit${q ? `?${q}` : ""}`),
  });
}

// ─── NOTIFICATIONS ──────────────────────────────────────────

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () =>
      apiClient.get<{ data: Record<string, unknown>[]; unreadCount: number }>(
        "/api/notifications"
      ),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationIds?: string[]) =>
      apiClient.patch("/api/notifications", { notificationIds }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
