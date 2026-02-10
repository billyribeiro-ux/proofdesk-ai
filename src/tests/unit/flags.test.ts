import { describe, it, expect, beforeEach, vi } from "vitest";

// Test the flag evaluation logic directly without module-level env reads
describe("Feature Flags", () => {
  describe("FLAG_DEFINITIONS", () => {
    it("defines all required flag keys", async () => {
      const { FLAG_KEYS, FLAG_DEFINITIONS } = await import("@/lib/flags/keys");
      const keys = Object.values(FLAG_KEYS);
      expect(keys).toContain("demo_mode_enabled");
      expect(keys).toContain("ai_summary_enabled");
      expect(keys).toContain("billing_packet_enabled");
      expect(keys).toContain("new_risk_engine_enabled");
      expect(keys).toContain("shortcuts_enabled");
      expect(keys).toContain("otel_verbose_enabled");
      expect(keys).toContain("queue_processing_enabled");

      for (const key of keys) {
        const def = FLAG_DEFINITIONS[key];
        expect(def).toBeDefined();
        expect(def.key).toBe(key);
        expect(typeof def.defaultValue).toBe("boolean");
        expect(def.description.length).toBeGreaterThan(0);
      }
    });

    it("has correct default values", async () => {
      const { FLAG_KEYS, FLAG_DEFINITIONS } = await import("@/lib/flags/keys");
      expect(FLAG_DEFINITIONS[FLAG_KEYS.DEMO_MODE_ENABLED].defaultValue).toBe(false);
      expect(FLAG_DEFINITIONS[FLAG_KEYS.AI_SUMMARY_ENABLED].defaultValue).toBe(true);
      expect(FLAG_DEFINITIONS[FLAG_KEYS.BILLING_PACKET_ENABLED].defaultValue).toBe(true);
      expect(FLAG_DEFINITIONS[FLAG_KEYS.NEW_RISK_ENGINE_ENABLED].defaultValue).toBe(false);
      expect(FLAG_DEFINITIONS[FLAG_KEYS.SHORTCUTS_ENABLED].defaultValue).toBe(true);
    });
  });

  describe("LocalFlagProvider", () => {
    it("reads boolean from env var", async () => {
      const { LocalFlagProvider } = await import("@/lib/flags/provider");
      const provider = new LocalFlagProvider();

      vi.stubEnv("FLAG_DEMO_MODE_ENABLED", "true");
      expect(provider.evaluateBoolean("demo_mode_enabled", false, {})).toBe(true);

      vi.stubEnv("FLAG_DEMO_MODE_ENABLED", "false");
      expect(provider.evaluateBoolean("demo_mode_enabled", true, {})).toBe(false);

      vi.unstubAllEnvs();
    });

    it("falls back to definition default when env is unset", async () => {
      const { LocalFlagProvider } = await import("@/lib/flags/provider");
      const provider = new LocalFlagProvider();

      delete process.env.FLAG_AI_SUMMARY_ENABLED;
      expect(provider.evaluateBoolean("ai_summary_enabled", false, {})).toBe(true);
    });

    it("evaluates string from env", async () => {
      const { LocalFlagProvider } = await import("@/lib/flags/provider");
      const provider = new LocalFlagProvider();

      vi.stubEnv("FLAG_CUSTOM_STRING", "hello");
      expect(provider.evaluateString("custom_string", "default", {})).toBe("hello");
      vi.unstubAllEnvs();
    });

    it("evaluates number from env", async () => {
      const { LocalFlagProvider } = await import("@/lib/flags/provider");
      const provider = new LocalFlagProvider();

      vi.stubEnv("FLAG_CUSTOM_NUMBER", "42");
      expect(provider.evaluateNumber("custom_number", 0, {})).toBe(42);

      vi.stubEnv("FLAG_CUSTOM_NUMBER", "not-a-number");
      expect(provider.evaluateNumber("custom_number", 99, {})).toBe(99);
      vi.unstubAllEnvs();
    });
  });

  describe("isEnabledSync", () => {
    it("reads env directly without provider init", async () => {
      const { isEnabledSync } = await import("@/lib/flags/evaluate");

      vi.stubEnv("FLAG_DEMO_MODE_ENABLED", "true");
      expect(isEnabledSync("demo_mode_enabled")).toBe(true);

      vi.stubEnv("FLAG_DEMO_MODE_ENABLED", "0");
      expect(isEnabledSync("demo_mode_enabled")).toBe(false);

      vi.unstubAllEnvs();
    });
  });
});
