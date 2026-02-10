import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { apiErrorResponse } from "@/lib/api/error";
import { scopeWhere } from "@/lib/security/tenant";
import { assertPermission } from "@/lib/security/rbac";
import { IS_DEMO } from "@/lib/constants/app";

export async function GET(req: NextRequest) {
  try {
    const { orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "timeline:read");

    if (IS_DEMO) return NextResponse.json({ data: [], total: 0, limit: 50, offset: 0 });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const source = searchParams.get("source");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
    const offset = Number(searchParams.get("offset")) || 0;

    const where = {
      ...scopeWhere(orgId),
      ...(projectId ? { projectId } : {}),
      ...(source ? { source } : {}),
    };

    const [events, total] = await Promise.all([
      db.workEvent.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        take: limit,
        skip: offset,
        include: { project: { select: { id: true, name: true } } },
      }),
      db.workEvent.count({ where }),
    ]);

    return NextResponse.json({ data: events, total, limit, offset });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
