import type { JobPayload } from "./types";

interface DeadLetterEntry {
  jobId: string;
  type: string;
  payload: JobPayload;
  error: string;
  attempts: number;
  failedAt: Date;
}

const DLQ_ENABLED = process.env.QUEUE_DLQ_ENABLED !== "false";

/**
 * Dead-letter queue handler.
 * In production, this would persist to a DB table or external queue.
 * Current implementation logs structured entries for alerting/replay.
 */
export function sendToDeadLetter(entry: DeadLetterEntry): void {
  if (!DLQ_ENABLED) return;

  console.error("[DLQ]", JSON.stringify({
    jobId: entry.jobId,
    type: entry.type,
    organizationId: entry.payload.organizationId,
    actorId: entry.payload.actorId,
    error: entry.error,
    attempts: entry.attempts,
    failedAt: entry.failedAt.toISOString(),
  }));
}
