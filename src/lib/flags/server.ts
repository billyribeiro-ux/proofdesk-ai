import type { FlagContext } from "./types";
import type { FlagKey } from "./keys";
import type { SessionData } from "@/lib/auth/session";
import { isEnabled } from "./evaluate";

/** Build a FlagContext from a session — use in API route handlers */
export function flagContextFromSession(session: SessionData): FlagContext {
  return {
    organizationId: session.orgId,
    userId: session.userId,
    role: session.orgRole,
    environment: process.env.NODE_ENV,
  };
}

/** Server-side flag gate — throws if flag is disabled */
export async function requireFlag(key: FlagKey, ctx: FlagContext = {}): Promise<void> {
  const enabled = await isEnabled(key, ctx);
  if (!enabled) {
    const { ApiError } = await import("@/lib/api/error");
    throw ApiError.forbidden(`Feature "${key}" is not enabled`);
  }
}

/** Server-side flag check — returns boolean */
export async function checkFlag(key: FlagKey, ctx: FlagContext = {}): Promise<boolean> {
  return isEnabled(key, ctx);
}
