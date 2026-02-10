import { describe, it, expect } from "vitest";
import { enforceTenant, scopeWhere, scopedQuery } from "@/lib/security/tenant";

describe("enforceTenant", () => {
  it("does not throw when orgIds match", () => {
    expect(() => enforceTenant("org-1", "org-1")).not.toThrow();
  });

  it("throws when orgIds do not match (cross-tenant)", () => {
    expect(() => enforceTenant("org-1", "org-2")).toThrow(
      "Cross-tenant access denied"
    );
  });

  it("throws with different org IDs (attack scenario)", () => {
    expect(() => enforceTenant("attacker-org", "victim-org")).toThrow();
  });
});

describe("scopeWhere", () => {
  it("returns object with organizationId", () => {
    const result = scopeWhere("org-abc");
    expect(result).toEqual({ organizationId: "org-abc" });
  });

  it("always includes organizationId key", () => {
    const result = scopeWhere("any-id");
    expect(result).toHaveProperty("organizationId", "any-id");
  });
});

describe("scopedQuery", () => {
  it("merges organizationId into existing where clause", () => {
    const result = scopedQuery("org-1", { status: "ACTIVE" });
    expect(result).toEqual({ status: "ACTIVE", organizationId: "org-1" });
  });

  it("overwrites any existing organizationId in where clause", () => {
    const result = scopedQuery("org-safe", {
      organizationId: "org-attacker",
      name: "test",
    });
    expect(result.organizationId).toBe("org-safe");
  });

  it("preserves all original where properties", () => {
    const result = scopedQuery("org-1", { a: 1, b: "two", c: true });
    expect(result).toEqual({
      a: 1,
      b: "two",
      c: true,
      organizationId: "org-1",
    });
  });
});
