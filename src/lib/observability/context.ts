import type { SessionData } from "@/lib/auth/session";

export interface RequestContext {
  requestId: string;
  organizationId?: string;
  userId?: string;
  method: string;
  path: string;
  startTime: number;
}

/** Build a request context from a session + request metadata */
export function buildRequestContext(
  method: string,
  path: string,
  session?: SessionData
): RequestContext {
  return {
    requestId: crypto.randomUUID(),
    organizationId: session?.orgId,
    userId: session?.userId,
    method,
    path,
    startTime: Date.now(),
  };
}

/** Extract safe span attributes from a request context (no PII) */
export function contextToAttributes(ctx: RequestContext): Record<string, string | number> {
  const attrs: Record<string, string | number> = {
    "request.id": ctx.requestId,
    "http.method": ctx.method,
    "http.route": ctx.path,
  };
  if (ctx.organizationId) attrs["organization.id"] = ctx.organizationId;
  if (ctx.userId) attrs["user.id"] = ctx.userId;
  return attrs;
}
