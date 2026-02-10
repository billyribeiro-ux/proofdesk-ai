import type { JobHandler, JobPayload } from "@/lib/jobs/types";
import { db } from "@/lib/db";
import type { NotificationType } from "@prisma/client";

interface NotificationPayload extends JobPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  href?: string;
}

export const sendNotificationJob: JobHandler<NotificationPayload> = {
  type: "send-notification",

  async handle(payload, jobId) {
    const { organizationId, userId, type, title, body, href } = payload;

    console.info("[JOB:notification] Starting", { jobId, userId, type });

    await db.notification.create({
      data: {
        organizationId,
        userId,
        type,
        title,
        body,
        href,
      },
    });

    console.info("[JOB:notification] Completed", { jobId, userId, type });
  },
};
