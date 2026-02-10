import type { FlagContext, FlagProvider } from "./types";
import type { FlagKey } from "./keys";
import { FLAG_DEFINITIONS } from "./keys";
import { LocalFlagProvider } from "./provider";

let _provider: FlagProvider = new LocalFlagProvider();
let _initialized = false;

export function setFlagProvider(provider: FlagProvider): void {
  _provider = provider;
  _initialized = false;
}

async function ensureInitialized(): Promise<void> {
  if (_initialized) return;
  try {
    await _provider.initialize();
    _initialized = true;
  } catch (err) {
    console.warn(`[FLAGS] Provider "${_provider.name}" init failed, using defaults`, err);
    _provider = new LocalFlagProvider();
    _initialized = true;
  }
}

export async function isEnabled(key: FlagKey, ctx: FlagContext = {}): Promise<boolean> {
  await ensureInitialized();
  const def = FLAG_DEFINITIONS[key];
  try {
    return _provider.evaluateBoolean(key, def?.defaultValue ?? false, ctx);
  } catch {
    return def?.defaultValue ?? false;
  }
}

export async function getFlagString(key: string, defaultValue: string, ctx: FlagContext = {}): Promise<string> {
  await ensureInitialized();
  try {
    return _provider.evaluateString(key, defaultValue, ctx);
  } catch {
    return defaultValue;
  }
}

export async function getFlagNumber(key: string, defaultValue: number, ctx: FlagContext = {}): Promise<number> {
  await ensureInitialized();
  try {
    return _provider.evaluateNumber(key, defaultValue, ctx);
  } catch {
    return defaultValue;
  }
}

/** Synchronous check — reads env directly, no provider init needed */
export function isEnabledSync(key: FlagKey): boolean {
  const envVal = process.env[`FLAG_${key.toUpperCase()}`];
  if (envVal === "true" || envVal === "1") return true;
  if (envVal === "false" || envVal === "0") return false;
  return FLAG_DEFINITIONS[key]?.defaultValue ?? false;
}

export function getProvider(): FlagProvider {
  return _provider;
}
