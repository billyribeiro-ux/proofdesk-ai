import type { JobPayload, JobResult } from "./types";
import { jobQueue } from "./queue";

/** Convenience wrapper — enqueue a typed job and return its ID + status */
export async function enqueueJob<T extends JobPayload>(
  type: string,
  payload: T,
  idempotencyKey?: string
): Promise<JobResult> {
  const record = await jobQueue.enqueue({ type, payload, idempotencyKey });
  return { jobId: record.id, status: record.status };
}
