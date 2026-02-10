import type { JobDefinition, JobHandler, JobPayload, JobRecord, JobStatus } from "./types";
import { getRetryDelay, shouldRetry, getMaxAttempts } from "./retries";
import { sendToDeadLetter } from "./dlq";

const CONCURRENCY = Number(process.env.QUEUE_CONCURRENCY) || 5;

/** In-process job registry and queue. Backed by DB for persistence. */
class JobQueue {
  private handlers = new Map<string, JobHandler>();
  private processing = 0;
  private pending: JobRecord[] = [];
  private enabled = process.env.QUEUE_ENABLED !== "false";

  registerHandler<T extends JobPayload>(handler: JobHandler<T>): void {
    this.handlers.set(handler.type, handler as JobHandler);
  }

  async enqueue(def: JobDefinition): Promise<JobRecord> {
    const record: JobRecord = {
      id: crypto.randomUUID(),
      type: def.type,
      payload: def.payload,
      status: "pending",
      attempts: 0,
      maxAttempts: getMaxAttempts(),
      scheduledAt: new Date(),
      createdAt: new Date(),
    };

    this.pending.push(record);

    console.info("[QUEUE] Enqueued", {
      jobId: record.id,
      type: record.type,
      orgId: def.payload.organizationId,
    });

    if (this.enabled) {
      this.drain();
    }

    return record;
  }

  async getJobStatus(jobId: string): Promise<JobRecord | undefined> {
    return this.pending.find((j) => j.id === jobId);
  }

  private async drain(): Promise<void> {
    while (this.processing < CONCURRENCY && this.pending.length > 0) {
      const job = this.pending.find((j) => j.status === "pending");
      if (!job) break;

      job.status = "running";
      job.startedAt = new Date();
      this.processing++;

      this.executeJob(job).finally(() => {
        this.processing--;
        this.drain();
      });
    }
  }

  private async executeJob(job: JobRecord): Promise<void> {
    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = "failed";
      job.lastError = `No handler registered for job type "${job.type}"`;
      console.error("[QUEUE] No handler", { jobId: job.id, type: job.type });
      return;
    }

    try {
      job.attempts++;
      await handler.handle(job.payload, job.id);
      job.status = "completed";
      job.completedAt = new Date();

      console.info("[QUEUE] Completed", {
        jobId: job.id,
        type: job.type,
        attempts: job.attempts,
        durationMs: Date.now() - (job.startedAt?.getTime() ?? Date.now()),
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      job.lastError = errorMsg;

      if (shouldRetry(job.attempts, job.maxAttempts)) {
        const delay = getRetryDelay(job.attempts);
        job.status = "pending";

        console.warn("[QUEUE] Retry scheduled", {
          jobId: job.id,
          type: job.type,
          attempt: job.attempts,
          delayMs: delay,
          error: errorMsg,
        });

        setTimeout(() => this.drain(), delay);
      } else {
        job.status = "dead";

        sendToDeadLetter({
          jobId: job.id,
          type: job.type,
          payload: job.payload,
          error: errorMsg,
          attempts: job.attempts,
          failedAt: new Date(),
        });

        console.error("[QUEUE] Dead letter", {
          jobId: job.id,
          type: job.type,
          attempts: job.attempts,
          error: errorMsg,
        });
      }
    }
  }
}

const globalForQueue = globalThis as unknown as { jobQueue: JobQueue | undefined };
export const jobQueue = globalForQueue.jobQueue ?? new JobQueue();
if (process.env.NODE_ENV !== "production") globalForQueue.jobQueue = jobQueue;
