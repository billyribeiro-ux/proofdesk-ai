const TTL_HOURS = Number(process.env.IDEMPOTENCY_TTL_HOURS) || 24;
const TTL_MS = TTL_HOURS * 60 * 60 * 1000;

interface StoredResponse {
  key: string;
  fingerprint: string;
  organizationId: string;
  statusCode: number;
  body: unknown;
  createdAt: number;
}

/**
 * In-memory idempotency store with TTL eviction.
 * In production, back this with the IdempotencyRecord Prisma model.
 */
class IdempotencyStore {
  private records = new Map<string, StoredResponse>();

  get(key: string, organizationId: string): StoredResponse | undefined {
    const record = this.records.get(`${organizationId}:${key}`);
    if (!record) return undefined;
    if (Date.now() - record.createdAt > TTL_MS) {
      this.records.delete(`${organizationId}:${key}`);
      return undefined;
    }
    return record;
  }

  set(key: string, organizationId: string, fingerprint: string, statusCode: number, body: unknown): void {
    this.records.set(`${organizationId}:${key}`, {
      key,
      fingerprint,
      organizationId,
      statusCode,
      body,
      createdAt: Date.now(),
    });
  }

  /** Evict expired entries — call periodically */
  evict(): number {
    const now = Date.now();
    let evicted = 0;
    for (const [compositeKey, record] of this.records) {
      if (now - record.createdAt > TTL_MS) {
        this.records.delete(compositeKey);
        evicted++;
      }
    }
    return evicted;
  }

  get size(): number {
    return this.records.size;
  }
}

const globalForStore = globalThis as unknown as { idempotencyStore: IdempotencyStore | undefined };
export const idempotencyStore = globalForStore.idempotencyStore ?? new IdempotencyStore();
if (process.env.NODE_ENV !== "production") globalForStore.idempotencyStore = idempotencyStore;
