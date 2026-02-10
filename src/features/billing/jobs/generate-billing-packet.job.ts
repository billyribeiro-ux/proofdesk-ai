import type { JobHandler, JobPayload } from "@/lib/jobs/types";
import { db } from "@/lib/db";

interface BillingPacketPayload extends JobPayload {
  projectId: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  totalHours?: number;
  totalAmount?: number;
  lineItems?: { description: string; hours?: number; amount: number }[];
}

export const generateBillingPacketJob: JobHandler<BillingPacketPayload> = {
  type: "generate-billing-packet",

  async handle(payload, jobId) {
    const { organizationId, actorId, projectId, title, periodStart, periodEnd, totalHours, totalAmount, lineItems } = payload;

    console.info("[JOB:billing-packet] Starting", { jobId, projectId });

    const project = await db.project.findFirst({
      where: { id: projectId, organizationId },
    });

    if (!project) {
      throw new Error(`Project ${projectId} not found in org ${organizationId}`);
    }

    const evidences = await db.evidenceArtifact.findMany({
      where: {
        organizationId,
        projectId,
        createdAt: { gte: new Date(periodStart), lte: new Date(periodEnd) },
      },
      select: { id: true },
    });

    await db.billingPacket.create({
      data: {
        organizationId,
        projectId,
        title,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        totalHours,
        totalAmount,
        lineItems: lineItems ? JSON.parse(JSON.stringify(lineItems)) : undefined,
        evidenceIds: evidences.map((e) => e.id),
        generatedBy: actorId,
        status: "GENERATED",
      },
    });

    console.info("[JOB:billing-packet] Completed", { jobId, projectId, evidenceCount: evidences.length });
  },
};
