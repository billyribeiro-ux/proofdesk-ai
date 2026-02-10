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
    assertPermission(orgRole, "audit:read");

    if (IS_DEMO) return NextResponse.json({ data: [], total: 0, limit: 50, offset: 0 });

    const { searchParams } = new URL(req.url);
    const entity = searchParams.get("entity");
    const action = searchParams.get("action");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
    const offset = Number(searchParams.get("offset")) || 0;

    const where = {
      ...scopeWhere(orgId),
      ...(entity ? { entity } : {}),
      ...(action ? { action } : {}),
    };

    const [logs, total] = await Promise.all([
      db.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      db.activityLog.count({ where }),
    ]);

    return NextResponse.json({ data: logs, total, limit, offset });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
