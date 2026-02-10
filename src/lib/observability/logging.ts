type LogLevel = "debug" | "info" | "warn" | "error";

interface StructuredLog {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  [key: string]: unknown;
}

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME ?? "proofdesk-app";

function createLog(level: LogLevel, message: string, context?: Record<string, unknown>): StructuredLog {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: SERVICE_NAME,
    ...context,
  };
}

/** Structured logger — no PII in output */
export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === "production") return;
    console.debug(JSON.stringify(createLog("debug", message, context)));
  },

  info(message: string, context?: Record<string, unknown>): void {
    console.info(JSON.stringify(createLog("info", message, context)));
  },

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(JSON.stringify(createLog("warn", message, context)));
  },

  error(message: string, context?: Record<string, unknown>): void {
    console.error(JSON.stringify(createLog("error", message, context)));
  },
};
