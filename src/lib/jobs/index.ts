export type { JobPayload, JobDefinition, JobRecord, JobHandler, JobResult, JobStatus } from "./types";
export { jobQueue } from "./queue";
export { enqueueJob } from "./enqueue";
export { registerJobHandler, registerJobHandlers } from "./worker";
export { getRetryDelay, shouldRetry, getMaxAttempts } from "./retries";
export { sendToDeadLetter } from "./dlq";

// ─── Bootstrap: register all job handlers on first import ────
import { registerJobHandlers as _register } from "./worker";
import { generateBillingPacketJob } from "@/features/billing/jobs/generate-billing-packet.job";
import { generateAISummaryJob } from "@/features/reports/jobs/generate-ai-summary.job";
import { sendNotificationJob } from "@/features/notifications/jobs/send-notification.job";
import { resetDemoSnapshotJob } from "@/features/demo/jobs/reset-demo-snapshot.job";

_register([
  generateBillingPacketJob,
  generateAISummaryJob,
  sendNotificationJob,
  resetDemoSnapshotJob,
]);
