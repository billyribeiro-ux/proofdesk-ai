export type JobStatus = "pending" | "running" | "completed" | "failed" | "dead";

export interface JobPayload {
  organizationId: string;
  actorId: string;
  [key: string]: unknown;
}

export interface JobDefinition<T extends JobPayload = JobPayload> {
  type: string;
  payload: T;
  idempotencyKey?: string;
}

export interface JobRecord {
  id: string;
  type: string;
  payload: JobPayload;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface JobHandler<T extends JobPayload = JobPayload> {
  type: string;
  handle(payload: T, jobId: string): Promise<void>;
}

export interface JobResult {
  jobId: string;
  status: JobStatus;
}
