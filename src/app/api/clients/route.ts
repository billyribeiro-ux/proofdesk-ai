import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { createClientSchema } from "@/lib/validation/schemas";
import { apiErrorResponse, ApiError } from "@/lib/api/error";
import { scopeWhere } from "@/lib/security/tenant";
import { assertPermission } from "@/lib/security/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { checkIdempotency, storeIdempotentResponse } from "@/lib/api/idempotency";
import { IS_DEMO } from "@/lib/constants/app";

export async function GET(req: NextRequest) {
  try {
    const { orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "client:read");

    if (IS_DEMO) return NextResponse.json({ data: [] });

    const { searchParams } = new URL(req.url);
    const archived = searchParams.get("archived") === "true";

    const clients = await db.client.findMany({
      where: { ...scopeWhere(orgId), archived },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { projects: true } } },
    });

    return NextResponse.json({ data: clients });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "client:create");

    const ip = getClientIp(req.headers);
    const rl = checkRateLimit(`${userId}:mutation`, "mutation");
    if (!rl.allowed) throw ApiError.tooManyRequests();

    const body = await req.json();
    const validated = createClientSchema.parse(body);

    const idempotency = checkIdempotency(req, validated, orgId);
    if (idempotency.hit) return idempotency.response!;

    const client = await db.client.create({
      data: { ...validated, organizationId: orgId },
    });

    await logAudit({
      organizationId: orgId,
      userId,
      action: "CREATE",
      entity: "Client",
      entityId: client.id,
      metadata: { name: client.name },
      ipAddress: ip,
      userAgent: getUserAgent(req.headers),
    });

    const responseBody = { data: client };
    storeIdempotentResponse(idempotency.key, orgId, idempotency.fingerprint, 201, responseBody);

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
