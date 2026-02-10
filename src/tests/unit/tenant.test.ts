import { describe, it, expect } from "vitest";
import { enforceTenant, scopeWhere } from "@/lib/security/tenant";

describe("scopeWhere", () => {
  it("returns object with organizationId", () => {
    const result = scopeWhere("org-123");
    expect(result).toEqual({ organizationId: "org-123" });
  });

  it("works with different org IDs", () => {
    const result = scopeWhere("org-abc");
    expect(result.organizationId).toBe("org-abc");
  });
});

describe("enforceTenant", () => {
  it("does not throw when org IDs match", () => {
    expect(() => enforceTenant("org-123", "org-123")).not.toThrow();
  });

  it("throws when org IDs do not match", () => {
    expect(() => enforceTenant("org-123", "org-456")).toThrow();
  });
});
