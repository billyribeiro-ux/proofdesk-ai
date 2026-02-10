import type { FlagDefinition } from "./types";

export const FLAG_KEYS = {
  DEMO_MODE_ENABLED: "demo_mode_enabled",
  AI_SUMMARY_ENABLED: "ai_summary_enabled",
  BILLING_PACKET_ENABLED: "billing_packet_enabled",
  NEW_RISK_ENGINE_ENABLED: "new_risk_engine_enabled",
  SHORTCUTS_ENABLED: "shortcuts_enabled",
  OTEL_VERBOSE_ENABLED: "otel_verbose_enabled",
  QUEUE_PROCESSING_ENABLED: "queue_processing_enabled",
} as const;

export type FlagKey = (typeof FLAG_KEYS)[keyof typeof FLAG_KEYS];

export const FLAG_DEFINITIONS: Record<FlagKey, FlagDefinition<boolean>> = {
  [FLAG_KEYS.DEMO_MODE_ENABLED]: {
    key: FLAG_KEYS.DEMO_MODE_ENABLED,
    defaultValue: false,
    description: "Enable demo mode with sandbox tenant and guided scenarios",
  },
  [FLAG_KEYS.AI_SUMMARY_ENABLED]: {
    key: FLAG_KEYS.AI_SUMMARY_ENABLED,
    defaultValue: true,
    description: "Enable AI summary generation for projects",
  },
  [FLAG_KEYS.BILLING_PACKET_ENABLED]: {
    key: FLAG_KEYS.BILLING_PACKET_ENABLED,
    defaultValue: true,
    description: "Enable billing packet generation",
  },
  [FLAG_KEYS.NEW_RISK_ENGINE_ENABLED]: {
    key: FLAG_KEYS.NEW_RISK_ENGINE_ENABLED,
    defaultValue: false,
    description: "Enable the new risk detection engine (v2)",
  },
  [FLAG_KEYS.SHORTCUTS_ENABLED]: {
    key: FLAG_KEYS.SHORTCUTS_ENABLED,
    defaultValue: true,
    description: "Enable keyboard shortcuts globally",
  },
  [FLAG_KEYS.OTEL_VERBOSE_ENABLED]: {
    key: FLAG_KEYS.OTEL_VERBOSE_ENABLED,
    defaultValue: false,
    description: "Enable verbose OpenTelemetry span attributes",
  },
  [FLAG_KEYS.QUEUE_PROCESSING_ENABLED]: {
    key: FLAG_KEYS.QUEUE_PROCESSING_ENABLED,
    defaultValue: true,
    description: "Enable background job queue processing",
  },
};
