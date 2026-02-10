import { NextRequest, NextResponse } from "next/server";
import { type RiskSeverity } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { createRiskSchema } from "@/lib/validation/schemas";
import { apiErrorResponse } from "@/lib/api/error";
import { scopeWhere } from "@/lib/security/tenant";
import { assertPermission } from "@/lib/security/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { checkIdempotency, storeIdempotentResponse } from "@/lib/api/idempotency";

export async function GET(req: NextRequest) {
  try {
    const { orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "risk:read");

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const resolved = searchParams.get("resolved");
    const severity = searchParams.get("severity");

    const where = {
      ...scopeWhere(orgId),
      ...(projectId ? { projectId } : {}),
      ...(resolved !== null ? { resolved: resolved === "true" } : {}),
      ...(severity ? { severity: severity as RiskSeverity } : {}),
    };

    const risks = await db.riskFlag.findMany({
      where,
      orderBy: { detectedAt: "desc" },
      include: { project: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ data: risks });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "risk:write");

    const rl = checkRateLimit(`${userId}:mutation`, "mutation");
    if (!rl.allowed) {
      return NextResponse.json({ code: "TOO_MANY_REQUESTS", message: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const validated = createRiskSchema.parse(body);

    const idempotency = checkIdempotency(req, validated, orgId);
    if (idempotency.hit) return idempotency.response!;

    const { metadata, ...rest } = validated;
    const risk = await db.riskFlag.create({
      data: {
        ...rest,
        organizationId: orgId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });

    await logAudit({
      organizationId: orgId,
      userId,
      action: "CREATE",
      entity: "RiskFlag",
      entityId: risk.id,
      metadata: { title: risk.title, severity: risk.severity, category: risk.category },
      ipAddress: getClientIp(req.headers),
      userAgent: getUserAgent(req.headers),
    });

    const responseBody = { data: risk };
    storeIdempotentResponse(idempotency.key, orgId, idempotency.fingerprint, 201, responseBody);

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
