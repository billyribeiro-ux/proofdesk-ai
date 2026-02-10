import { NextRequest, NextResponse } from "next/server";
import { idempotencyStore } from "./idempotency-store";
import { computeFingerprint } from "./request-fingerprint";

const HEADER_NAME = "idempotency-key";

export interface IdempotencyCheck {
  /** true if a cached response was found and should be returned */
  hit: boolean;
  /** The cached response, if hit is true */
  response?: NextResponse;
  /** The idempotency key from the request header */
  key?: string;
  /** The computed fingerprint of the request body */
  fingerprint?: string;
}

/**
 * Check for an existing idempotent response.
 * Call at the start of a mutation handler.
 */
export function checkIdempotency(
  req: NextRequest,
  body: unknown,
  organizationId: string
): IdempotencyCheck {
  if (process.env.IDEMPOTENCY_ENABLED === "false") return { hit: false };

  const key = req.headers.get(HEADER_NAME);
  if (!key) return { hit: false };

  const fingerprint = computeFingerprint(body);
  const existing = idempotencyStore.get(key, organizationId);

  if (!existing) {
    return { hit: false, key, fingerprint };
  }

  // Same key, different payload → conflict
  if (existing.fingerprint !== fingerprint) {
    return {
      hit: true,
      key,
      fingerprint,
      response: NextResponse.json(
        { code: "IDEMPOTENCY_CONFLICT", message: "Idempotency key reused with different request body" },
        { status: 409 }
      ),
    };
  }

  // Same key, same payload → return cached response
  return {
    hit: true,
    key,
    fingerprint,
    response: NextResponse.json(existing.body, { status: existing.statusCode }),
  };
}

/**
 * Store a successful response for future idempotent replays.
 * Call after a successful mutation.
 */
export function storeIdempotentResponse(
  key: string | undefined,
  organizationId: string,
  fingerprint: string | undefined,
  statusCode: number,
  body: unknown
): void {
  if (process.env.IDEMPOTENCY_ENABLED === "false" || !key || !fingerprint) return;
  idempotencyStore.set(key, organizationId, fingerprint, statusCode, body);
}
