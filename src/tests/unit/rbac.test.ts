import { describe, it, expect } from "vitest";
import {
  hasPermission,
  hasMinRole,
  getPermissionsForRole,
  assertPermission,
} from "@/lib/security/rbac";

describe("hasPermission", () => {
  it("OWNER has all permissions", () => {
    expect(hasPermission("OWNER", "client:create")).toBe(true);
    expect(hasPermission("OWNER", "project:delete")).toBe(true);
    expect(hasPermission("OWNER", "org:billing")).toBe(true);
    expect(hasPermission("OWNER", "org:manage")).toBe(true);
    expect(hasPermission("OWNER", "audit:read")).toBe(true);
  });

  it("ADMIN has most permissions but not billing:manage", () => {
    expect(hasPermission("ADMIN", "client:create")).toBe(true);
    expect(hasPermission("ADMIN", "project:create")).toBe(true);
    expect(hasPermission("ADMIN", "audit:read")).toBe(true);
  });

  it("MANAGER can create clients and projects", () => {
    expect(hasPermission("MANAGER", "client:create")).toBe(true);
    expect(hasPermission("MANAGER", "project:create")).toBe(true);
    expect(hasPermission("MANAGER", "client:read")).toBe(true);
  });

  it("CLIENT_VIEWER has read-only access", () => {
    expect(hasPermission("CLIENT_VIEWER", "project:read")).toBe(true);
    expect(hasPermission("CLIENT_VIEWER", "timeline:read")).toBe(true);
    expect(hasPermission("CLIENT_VIEWER", "approval:read")).toBe(true);
    expect(hasPermission("CLIENT_VIEWER", "client:create")).toBe(false);
    expect(hasPermission("CLIENT_VIEWER", "project:create")).toBe(false);
    expect(hasPermission("CLIENT_VIEWER", "project:delete")).toBe(false);
    expect(hasPermission("CLIENT_VIEWER", "org:manage")).toBe(false);
  });
});

describe("hasMinRole", () => {
  it("OWNER meets all minimum role requirements", () => {
    expect(hasMinRole("OWNER", "OWNER")).toBe(true);
    expect(hasMinRole("OWNER", "ADMIN")).toBe(true);
    expect(hasMinRole("OWNER", "MANAGER")).toBe(true);
    expect(hasMinRole("OWNER", "CLIENT_VIEWER")).toBe(true);
  });

  it("CLIENT_VIEWER only meets CLIENT_VIEWER minimum", () => {
    expect(hasMinRole("CLIENT_VIEWER", "CLIENT_VIEWER")).toBe(true);
    expect(hasMinRole("CLIENT_VIEWER", "MANAGER")).toBe(false);
    expect(hasMinRole("CLIENT_VIEWER", "ADMIN")).toBe(false);
    expect(hasMinRole("CLIENT_VIEWER", "OWNER")).toBe(false);
  });

  it("MANAGER meets MANAGER and CLIENT_VIEWER minimums", () => {
    expect(hasMinRole("MANAGER", "MANAGER")).toBe(true);
    expect(hasMinRole("MANAGER", "CLIENT_VIEWER")).toBe(true);
    expect(hasMinRole("MANAGER", "ADMIN")).toBe(false);
  });
});

describe("getPermissionsForRole", () => {
  it("returns permissions array for valid role", () => {
    const perms = getPermissionsForRole("OWNER");
    expect(Array.isArray(perms)).toBe(true);
    expect(perms.length).toBeGreaterThan(0);
  });

  it("CLIENT_VIEWER has fewer permissions than OWNER", () => {
    const ownerPerms = getPermissionsForRole("OWNER");
    const viewerPerms = getPermissionsForRole("CLIENT_VIEWER");
    expect(viewerPerms.length).toBeLessThan(ownerPerms.length);
  });
});

describe("assertPermission", () => {
  it("does not throw for valid permission", () => {
    expect(() => assertPermission("OWNER", "client:create")).not.toThrow();
  });

  it("throws for invalid permission", () => {
    expect(() => assertPermission("CLIENT_VIEWER", "client:create")).toThrow();
  });
});
