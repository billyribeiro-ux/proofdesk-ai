import type { JobHandler, JobPayload } from "@/lib/jobs/types";
import { db } from "@/lib/db";

interface DemoResetPayload extends JobPayload {
  scenarioId?: string;
}

export const resetDemoSnapshotJob: JobHandler<DemoResetPayload> = {
  type: "reset-demo-snapshot",

  async handle(payload, jobId) {
    const { organizationId } = payload;

    console.info("[JOB:demo-reset] Starting", { jobId, organizationId });

    await db.demoEvent.deleteMany({
      where: { run: { organizationId } },
    });

    await db.demoRun.deleteMany({
      where: { organizationId },
    });

    console.info("[JOB:demo-reset] Completed", { jobId, organizationId });
  },
};
