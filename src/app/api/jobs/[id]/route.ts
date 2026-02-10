import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { apiErrorResponse, ApiError } from "@/lib/api/error";
import { jobQueue } from "@/lib/jobs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { orgId } = await requireSession();
    const { id } = await params;

    const job = await jobQueue.getJobStatus(id);
    if (!job || job.payload.organizationId !== orgId) throw ApiError.notFound("Job not found");

    return NextResponse.json({
      id: job.id,
      type: job.type,
      status: job.status,
      attempts: job.attempts,
      createdAt: job.createdAt.toISOString(),
      startedAt: job.startedAt?.toISOString(),
      completedAt: job.completedAt?.toISOString(),
      lastError: job.lastError,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
