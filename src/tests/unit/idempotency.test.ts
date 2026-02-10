import { describe, it, expect } from "vitest";
import { computeFingerprint } from "@/lib/api/request-fingerprint";

describe("Idempotency", () => {
  describe("computeFingerprint", () => {
    it("produces deterministic output for same input", () => {
      const body = { projectId: "p1", title: "Test", amount: 100 };
      const fp1 = computeFingerprint(body);
      const fp2 = computeFingerprint(body);
      expect(fp1).toBe(fp2);
    });

    it("produces different output for different input", () => {
      const fp1 = computeFingerprint({ projectId: "p1", title: "A" });
      const fp2 = computeFingerprint({ projectId: "p1", title: "B" });
      expect(fp1).not.toBe(fp2);
    });

    it("is order-independent (sorted keys)", () => {
      const fp1 = computeFingerprint({ a: 1, b: 2 });
      const fp2 = computeFingerprint({ b: 2, a: 1 });
      expect(fp1).toBe(fp2);
    });

    it("returns a string", () => {
      const fp = computeFingerprint({ key: "value" });
      expect(typeof fp).toBe("string");
      expect(fp.length).toBeGreaterThan(0);
    });

    it("handles null body without crashing", () => {
      expect(() => computeFingerprint(null)).not.toThrow();
      expect(typeof computeFingerprint(null)).toBe("string");
    });

    it("handles undefined body without crashing", () => {
      expect(() => computeFingerprint(undefined)).not.toThrow();
      expect(typeof computeFingerprint(undefined)).toBe("string");
    });

    it("handles string body without crashing", () => {
      expect(() => computeFingerprint("raw-string")).not.toThrow();
      const fp = computeFingerprint("raw-string");
      expect(typeof fp).toBe("string");
    });

    it("handles array body without crashing", () => {
      expect(() => computeFingerprint([1, 2, 3])).not.toThrow();
    });
  });

  describe("IdempotencyStore", () => {
    it("stores and retrieves a response", async () => {
      const { idempotencyStore } = await import("@/lib/api/idempotency-store");
      idempotencyStore.set("key-1", "org-1", "fp-1", 201, { data: "test" });

      const record = idempotencyStore.get("key-1", "org-1");
      expect(record).toBeDefined();
      expect(record!.statusCode).toBe(201);
      expect(record!.fingerprint).toBe("fp-1");
      expect(record!.body).toEqual({ data: "test" });
    });

    it("returns undefined for unknown key", async () => {
      const { idempotencyStore } = await import("@/lib/api/idempotency-store");
      const record = idempotencyStore.get("nonexistent", "org-1");
      expect(record).toBeUndefined();
    });

    it("scopes by organizationId", async () => {
      const { idempotencyStore } = await import("@/lib/api/idempotency-store");
      idempotencyStore.set("key-2", "org-A", "fp-2", 200, { a: true });

      const fromA = idempotencyStore.get("key-2", "org-A");
      const fromB = idempotencyStore.get("key-2", "org-B");
      expect(fromA).toBeDefined();
      expect(fromB).toBeUndefined();
    });
  });
});
