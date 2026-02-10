import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { createEvidenceSchema } from "@/lib/validation/schemas";
import { apiErrorResponse } from "@/lib/api/error";
import { scopeWhere } from "@/lib/security/tenant";
import { assertPermission } from "@/lib/security/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { checkIdempotency, storeIdempotentResponse } from "@/lib/api/idempotency";
import { IS_DEMO } from "@/lib/constants/app";

export async function GET(req: NextRequest) {
  try {
    const { orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "evidence:read");

    if (IS_DEMO) return NextResponse.json({ data: [] });

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    const where = {
      ...scopeWhere(orgId),
      ...(projectId ? { projectId } : {}),
      ...(type ? { type } : {}),
    };

    const artifacts = await db.evidenceArtifact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { project: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ data: artifacts });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "evidence:write");

    const rl = checkRateLimit(`${userId}:mutation`, "mutation");
    if (!rl.allowed) {
      return NextResponse.json({ code: "TOO_MANY_REQUESTS", message: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const validated = createEvidenceSchema.parse(body);

    const idempotency = checkIdempotency(req, validated, orgId);
    if (idempotency.hit) return idempotency.response!;

    const { metadata, ...rest } = validated;
    const artifact = await db.evidenceArtifact.create({
      data: {
        ...rest,
        organizationId: orgId,
        uploadedBy: userId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });

    await logAudit({
      organizationId: orgId,
      userId,
      action: "CREATE",
      entity: "EvidenceArtifact",
      entityId: artifact.id,
      metadata: { title: artifact.title, projectId: artifact.projectId },
      ipAddress: getClientIp(req.headers),
      userAgent: getUserAgent(req.headers),
    });

    const responseBody = { data: artifact };
    storeIdempotentResponse(idempotency.key, orgId, idempotency.fingerprint, 201, responseBody);

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
