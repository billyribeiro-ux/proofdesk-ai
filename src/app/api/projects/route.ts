import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { createProjectSchema } from "@/lib/validation/schemas";
import { apiErrorResponse } from "@/lib/api/error";
import { scopeWhere } from "@/lib/security/tenant";
import { logAudit, getClientIp, getUserAgent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { assertPermission } from "@/lib/security/rbac";
import { IS_DEMO } from "@/lib/constants/app";

export async function GET() {
  try {
    const { orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "project:read");

    if (IS_DEMO) return NextResponse.json({ data: [] });

    const projects = await db.project.findMany({
      where: scopeWhere(orgId),
      orderBy: { updatedAt: "desc" },
      include: {
        client: { select: { id: true, name: true } },
        _count: { select: { workEvents: true, riskFlags: true, approvals: true } },
      },
    });

    return NextResponse.json({ data: projects });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "project:create");

    const rl = checkRateLimit(`${userId}:mutation`, "mutation");
    if (!rl.allowed) {
      return NextResponse.json({ code: "TOO_MANY_REQUESTS", message: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const validated = createProjectSchema.parse(body);

    const project = await db.project.create({
      data: {
        ...validated,
        organizationId: orgId,
        startDate: validated.startDate ? new Date(validated.startDate) : undefined,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
      },
    });

    await db.projectStageHistory.create({
      data: { projectId: project.id, toStatus: project.status, changedBy: userId },
    });

    await logAudit({
      organizationId: orgId,
      userId,
      action: "CREATE",
      entity: "Project",
      entityId: project.id,
      metadata: { name: project.name, clientId: project.clientId },
      ipAddress: getClientIp(req.headers),
      userAgent: getUserAgent(req.headers),
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
