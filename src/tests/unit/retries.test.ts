import { describe, it, expect } from "vitest";
import { getRetryDelay, shouldRetry, getMaxAttempts } from "@/lib/jobs/retries";

describe("Job Retries", () => {
  describe("getRetryDelay", () => {
    it("returns a positive number", () => {
      const delay = getRetryDelay(0);
      expect(delay).toBeGreaterThan(0);
    });

    it("increases with attempt number (exponential)", () => {
      const delays = Array.from({ length: 4 }, (_, i) => getRetryDelay(i));
      // Each delay should generally be larger than the previous (with jitter variance)
      // We test the base exponential component: 500 * 2^attempt
      expect(delays[1]).toBeGreaterThanOrEqual(500);
      expect(delays[2]).toBeGreaterThanOrEqual(1000);
      expect(delays[3]).toBeGreaterThanOrEqual(2000);
    });

    it("includes jitter (not purely deterministic)", () => {
      const results = new Set<number>();
      for (let i = 0; i < 20; i++) {
        results.add(getRetryDelay(1));
      }
      // With jitter, we should get multiple distinct values
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe("shouldRetry", () => {
    it("returns true when under max attempts", () => {
      expect(shouldRetry(0)).toBe(true);
      expect(shouldRetry(1)).toBe(true);
      expect(shouldRetry(4)).toBe(true);
    });

    it("returns false when at or over max attempts", () => {
      expect(shouldRetry(5)).toBe(false);
      expect(shouldRetry(10)).toBe(false);
    });

    it("respects custom maxAttempts", () => {
      expect(shouldRetry(2, 3)).toBe(true);
      expect(shouldRetry(3, 3)).toBe(false);
    });
  });

  describe("getMaxAttempts", () => {
    it("returns a positive integer", () => {
      const max = getMaxAttempts();
      expect(max).toBeGreaterThan(0);
      expect(Number.isInteger(max)).toBe(true);
    });
  });
});
