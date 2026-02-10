"use client";

import { FLAG_DEFINITIONS, type FlagKey } from "./keys";

/**
 * Client-safe flag read.
 * Reads from NEXT_PUBLIC_FLAG_<KEY> env vars injected at build time.
 * Falls back to FLAG_DEFINITIONS defaults.
 */
export function useFlag(key: FlagKey): boolean {
  const publicKey = `NEXT_PUBLIC_FLAG_${key.toUpperCase()}`;
  const envVal = typeof window !== "undefined"
    ? (process.env[publicKey] as string | undefined)
    : undefined;

  if (envVal === "true" || envVal === "1") return true;
  if (envVal === "false" || envVal === "0") return false;

  return FLAG_DEFINITIONS[key]?.defaultValue ?? false;
}
