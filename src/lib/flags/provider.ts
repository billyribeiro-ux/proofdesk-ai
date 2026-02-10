import type { FlagContext, FlagProvider } from "./types";
import { FLAG_DEFINITIONS, type FlagKey } from "./keys";

const ENV_PREFIX = "FLAG_";

function envKey(flagKey: string): string {
  return `${ENV_PREFIX}${flagKey.toUpperCase()}`;
}

function parseEnvBool(val: string | undefined, fallback: boolean): boolean {
  if (val === undefined || val === "") return fallback;
  return val === "true" || val === "1";
}

/**
 * Local environment-variable provider.
 * Reads FLAG_<KEY>=true|false from process.env.
 * Zero network calls, deterministic, always available.
 */
export class LocalFlagProvider implements FlagProvider {
  readonly name = "local";

  async initialize(): Promise<void> {
    /* no-op for local provider */
  }

  evaluateBoolean(key: string, defaultValue: boolean, _ctx: FlagContext): boolean {
    const envVal = process.env[envKey(key)];
    if (envVal !== undefined) return parseEnvBool(envVal, defaultValue);

    const def = FLAG_DEFINITIONS[key as FlagKey];
    if (def) return def.defaultValue as boolean;

    return defaultValue;
  }

  evaluateString(key: string, defaultValue: string, _ctx: FlagContext): string {
    return process.env[envKey(key)] ?? defaultValue;
  }

  evaluateNumber(key: string, defaultValue: number, _ctx: FlagContext): number {
    const raw = process.env[envKey(key)];
    if (raw === undefined) return defaultValue;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }

  async shutdown(): Promise<void> {
    /* no-op */
  }
}
