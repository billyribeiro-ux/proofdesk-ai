/**
 * Generate a deterministic fingerprint from request body.
 * Used to detect if the same idempotency key is reused with different payloads.
 */
export function computeFingerprint(body: unknown): string {
  if (body === null || body === undefined || typeof body !== "object") {
    const canonical = String(JSON.stringify(body) ?? "undefined");
    let hash = 0;
    for (let i = 0; i < canonical.length; i++) {
      hash = ((hash << 5) - hash + canonical.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
  }

  const canonical = JSON.stringify(body, Object.keys(body as Record<string, unknown>).sort());
  let hash = 0;
  for (let i = 0; i < canonical.length; i++) {
    const char = canonical.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}
