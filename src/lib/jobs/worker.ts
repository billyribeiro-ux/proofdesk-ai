import { jobQueue } from "./queue";
import type { JobHandler, JobPayload } from "./types";

/** Register a job handler with the global queue */
export function registerJobHandler<T extends JobPayload>(handler: JobHandler<T>): void {
  jobQueue.registerHandler(handler);
}

/** Register multiple handlers at once */
export function registerJobHandlers(handlers: JobHandler[]): void {
  for (const handler of handlers) {
    jobQueue.registerHandler(handler);
  }
}
