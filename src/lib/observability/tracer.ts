import { getOtelConfig } from "./otel";

export interface SpanAttributes {
  [key: string]: string | number | boolean | undefined;
}

export interface Span {
  setAttribute(key: string, value: string | number | boolean): void;
  setStatus(code: "ok" | "error", message?: string): void;
  end(): void;
}

class NoopSpan implements Span {
  setAttribute(): void { /* noop */ }
  setStatus(): void { /* noop */ }
  end(): void { /* noop */ }
}

/** Start a traced span. No-op if OTel is disabled. */
export function startSpan(name: string, attributes?: SpanAttributes): Span {
  const config = getOtelConfig();
  if (!config.enabled) return new NoopSpan();

  const start = Date.now();
  const spanAttrs: SpanAttributes = { ...attributes };

  return {
    setAttribute(key: string, value: string | number | boolean) {
      spanAttrs[key] = value;
    },
    setStatus(code: "ok" | "error", message?: string) {
      spanAttrs["otel.status_code"] = code;
      if (message) spanAttrs["otel.status_message"] = message;
    },
    end() {
      const duration = Date.now() - start;
      console.debug("[TRACE]", name, { ...spanAttrs, durationMs: duration });
    },
  };
}

/** Wrap an async function in a traced span */
export async function withSpan<T>(
  name: string,
  attributes: SpanAttributes,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  const span = startSpan(name, attributes);
  try {
    const result = await fn(span);
    span.setStatus("ok");
    return result;
  } catch (err) {
    span.setStatus("error", err instanceof Error ? err.message : String(err));
    throw err;
  } finally {
    span.end();
  }
}
