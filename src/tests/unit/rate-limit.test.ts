import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/security/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Reset rate limit state by using unique keys per test
  });

  it("allows requests under the limit", () => {
    const key = `test-${Date.now()}-allow`;
    const result = checkRateLimit(key, "auth");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it("tracks remaining count", () => {
    const key = `test-${Date.now()}-track`;
    const r1 = checkRateLimit(key, "auth");
    const r2 = checkRateLimit(key, "auth");
    expect(r2.remaining).toBe(r1.remaining - 1);
  });

  it("returns rate limit headers", () => {
    const key = `test-${Date.now()}-headers`;
    checkRateLimit(key, "auth");
    const headers = getRateLimitHeaders(key, "auth");
    expect(headers["X-RateLimit-Remaining"]).toBeDefined();
    expect(headers["X-RateLimit-Reset"]).toBeDefined();
  });
});
