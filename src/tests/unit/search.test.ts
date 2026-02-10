import { describe, it, expect } from "vitest";
import { sanitizeFtsQuery, buildDateFilter } from "@/lib/search/query-builder";

describe("Search", () => {
  describe("sanitizeFtsQuery", () => {
    it("converts simple terms to tsquery format", () => {
      expect(sanitizeFtsQuery("hello world")).toBe("hello:* & world:*");
    });

    it("strips special characters", () => {
      expect(sanitizeFtsQuery("hello<script>")).toBe("hello:* & script:*");
      expect(sanitizeFtsQuery("test|injection")).toBe("test:* & injection:*");
    });

    it("handles single term", () => {
      expect(sanitizeFtsQuery("acme")).toBe("acme:*");
    });

    it("returns empty for empty input", () => {
      expect(sanitizeFtsQuery("")).toBe("");
      expect(sanitizeFtsQuery("   ")).toBe("");
    });

    it("collapses multiple spaces", () => {
      expect(sanitizeFtsQuery("a   b   c")).toBe("a:* & b:* & c:*");
    });

    it("strips parentheses and operators", () => {
      expect(sanitizeFtsQuery("(test) & !foo")).toBe("test:* & foo:*");
    });
  });

  describe("buildDateFilter", () => {
    it("returns undefined when no dates provided", () => {
      expect(buildDateFilter({})).toBeUndefined();
    });

    it("builds gte from dateFrom", () => {
      const result = buildDateFilter({ dateFrom: "2024-01-01" });
      expect(result).toBeDefined();
      expect(result!.gte).toBeInstanceOf(Date);
      expect(result!.lte).toBeUndefined();
    });

    it("builds lte from dateTo", () => {
      const result = buildDateFilter({ dateTo: "2024-12-31" });
      expect(result).toBeDefined();
      expect(result!.lte).toBeInstanceOf(Date);
      expect(result!.gte).toBeUndefined();
    });

    it("builds both when both provided", () => {
      const result = buildDateFilter({ dateFrom: "2024-01-01", dateTo: "2024-12-31" });
      expect(result).toBeDefined();
      expect(result!.gte).toBeInstanceOf(Date);
      expect(result!.lte).toBeInstanceOf(Date);
    });
  });
});
