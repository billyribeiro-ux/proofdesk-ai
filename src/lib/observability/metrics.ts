import { getOtelConfig } from "./otel";

interface MetricEntry {
  name: string;
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}

/** Increment a counter metric */
export function incrementCounter(name: string, labels: Record<string, string> = {}, delta = 1): void {
  const config = getOtelConfig();
  if (!config.enabled) return;

  const entry: MetricEntry = { name, value: delta, labels, timestamp: Date.now() };
  console.debug("[METRIC:counter]", entry);
}

/** Record a histogram/gauge value */
export function recordHistogram(name: string, value: number, labels: Record<string, string> = {}): void {
  const config = getOtelConfig();
  if (!config.enabled) return;

  const entry: MetricEntry = { name, value, labels, timestamp: Date.now() };
  console.debug("[METRIC:histogram]", entry);
}

/** Record API request duration */
export function recordRequestDuration(method: string, path: string, status: number, durationMs: number): void {
  recordHistogram("http.server.duration", durationMs, {
    "http.method": method,
    "http.route": path,
    "http.status_code": String(status),
  });
}
