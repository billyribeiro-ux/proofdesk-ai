import { NextRequest, NextResponse } from "next/server";
import { type ApprovalStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { apiErrorResponse } from "@/lib/api/error";
import { createApprovalSchema } from "@/lib/validation/schemas";
import { scopeWhere } from "@/lib/security/tenant";
import { assertPermission } from "@/lib/security/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { checkIdempotency, storeIdempotentResponse } from "@/lib/api/idempotency";
import { IS_DEMO } from "@/lib/constants/app";

export async function GET(req: NextRequest) {
  try {
    const { orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "approval:read");

    if (IS_DEMO) return NextResponse.json({ data: [] });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    const where = {
      ...scopeWhere(orgId),
      ...(projectId ? { projectId } : {}),
      ...(status ? { status: status as ApprovalStatus } : {}),
    };

    const approvals = await db.approvalRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { id: true, name: true } },
        decisions: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ data: approvals });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "approval:create");

    const rl = checkRateLimit(`${userId}:mutation`, "mutation");
    if (!rl.allowed) {
      return NextResponse.json({ code: "TOO_MANY_REQUESTS", message: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const validated = createApprovalSchema.parse(body);

    const idempotency = checkIdempotency(req, validated, orgId);
    if (idempotency.hit) return idempotency.response!;

    const approval = await db.approvalRequest.create({
      data: {
        organizationId: orgId,
        projectId: validated.projectId,
        title: validated.title,
        description: validated.description,
        requestedBy: userId,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
        metadata: validated.metadata ? JSON.parse(JSON.stringify(validated.metadata)) : undefined,
      },
    });

    await logAudit({
      organizationId: orgId,
      userId,
      action: "CREATE",
      entity: "ApprovalRequest",
      entityId: approval.id,
      metadata: { title: approval.title, projectId: approval.projectId },
      ipAddress: getClientIp(req.headers),
      userAgent: getUserAgent(req.headers),
    });

    const responseBody = { data: approval };
    storeIdempotentResponse(idempotency.key, orgId, idempotency.fingerprint, 201, responseBody);

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
