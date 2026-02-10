import { ROLE_HIERARCHY, type Role } from "@/lib/constants/app";

export type Permission =
  | "org:manage"
  | "org:invite"
  | "org:billing"
  | "client:create"
  | "client:read"
  | "client:update"
  | "client:delete"
  | "project:create"
  | "project:read"
  | "project:update"
  | "project:delete"
  | "timeline:read"
  | "timeline:write"
  | "evidence:read"
  | "evidence:write"
  | "report:read"
  | "report:generate"
  | "risk:read"
  | "risk:write"
  | "risk:resolve"
  | "approval:read"
  | "approval:create"
  | "approval:decide"
  | "billing_packet:read"
  | "billing_packet:generate"
  | "audit:read"
  | "notification:read"
  | "settings:read"
  | "settings:write"
  | "demo:access";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: [
    "org:manage",
    "org:invite",
    "org:billing",
    "client:create",
    "client:read",
    "client:update",
    "client:delete",
    "project:create",
    "project:read",
    "project:update",
    "project:delete",
    "timeline:read",
    "timeline:write",
    "evidence:read",
    "evidence:write",
    "report:read",
    "report:generate",
    "risk:read",
    "risk:write",
    "risk:resolve",
    "approval:read",
    "approval:create",
    "approval:decide",
    "billing_packet:read",
    "billing_packet:generate",
    "audit:read",
    "notification:read",
    "settings:read",
    "settings:write",
    "demo:access",
  ],
  ADMIN: [
    "org:invite",
    "org:billing",
    "client:create",
    "client:read",
    "client:update",
    "client:delete",
    "project:create",
    "project:read",
    "project:update",
    "project:delete",
    "timeline:read",
    "timeline:write",
    "evidence:read",
    "evidence:write",
    "report:read",
    "report:generate",
    "risk:read",
    "risk:write",
    "risk:resolve",
    "approval:read",
    "approval:create",
    "approval:decide",
    "billing_packet:read",
    "billing_packet:generate",
    "audit:read",
    "notification:read",
    "settings:read",
    "settings:write",
    "demo:access",
  ],
  MANAGER: [
    "client:create",
    "client:read",
    "client:update",
    "project:create",
    "project:read",
    "project:update",
    "timeline:read",
    "timeline:write",
    "evidence:read",
    "evidence:write",
    "report:read",
    "report:generate",
    "risk:read",
    "risk:write",
    "approval:read",
    "approval:create",
    "billing_packet:read",
    "billing_packet:generate",
    "notification:read",
    "settings:read",
    "demo:access",
  ],
  CLIENT_VIEWER: [
    "project:read",
    "timeline:read",
    "evidence:read",
    "report:read",
    "risk:read",
    "approval:read",
    "approval:decide",
    "billing_packet:read",
    "notification:read",
    "settings:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Role "${role}" does not have permission "${permission}"`
    );
  }
}

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
