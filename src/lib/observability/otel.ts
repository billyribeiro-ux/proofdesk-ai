const OTEL_ENABLED = process.env.OTEL_ENABLED === "true";
const SERVICE_NAME = process.env.OTEL_SERVICE_NAME ?? "proofdesk-app";
const SAMPLE_RATE = Number(process.env.OTEL_SAMPLE_RATE) || 0.2;

export interface OtelConfig {
  enabled: boolean;
  serviceName: string;
  sampleRate: number;
  endpoint?: string;
}

export function getOtelConfig(): OtelConfig {
  return {
    enabled: OTEL_ENABLED,
    serviceName: SERVICE_NAME,
    sampleRate: SAMPLE_RATE,
    endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || undefined,
  };
}

let _initialized = false;

export function initOtel(): void {
  if (_initialized || !OTEL_ENABLED) return;
  _initialized = true;
  console.info("[OTEL] Initialized", { serviceName: SERVICE_NAME, sampleRate: SAMPLE_RATE });
}
