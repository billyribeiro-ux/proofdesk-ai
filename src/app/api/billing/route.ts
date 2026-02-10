import { NextRequest, NextResponse } from "next/server";
import { type BillingPacketStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { createBillingPacketSchema } from "@/lib/validation/schemas";
import { apiErrorResponse } from "@/lib/api/error";
import { scopeWhere } from "@/lib/security/tenant";
import { assertPermission } from "@/lib/security/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { requireFlag, flagContextFromSession } from "@/lib/flags";
import { checkIdempotency, storeIdempotentResponse } from "@/lib/api/idempotency";

export async function GET(req: NextRequest) {
  try {
    const { orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "billing_packet:read");

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    const where = {
      ...scopeWhere(orgId),
      ...(projectId ? { projectId } : {}),
      ...(status ? { status: status as BillingPacketStatus } : {}),
    };

    const packets = await db.billingPacket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { project: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ data: packets });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "billing_packet:generate");

    const rl = checkRateLimit(`${userId}:mutation`, "mutation");
    if (!rl.allowed) {
      return NextResponse.json({ code: "TOO_MANY_REQUESTS", message: "Too many requests" }, { status: 429 });
    }

    const session = { userId, orgId, orgRole } as const;
    await requireFlag("billing_packet_enabled", flagContextFromSession(session));

    const body = await req.json();
    const validated = createBillingPacketSchema.parse(body);

    const idempotency = checkIdempotency(req, validated, orgId);
    if (idempotency.hit) return idempotency.response!;

    const packet = await db.billingPacket.create({
      data: {
        organizationId: orgId,
        projectId: validated.projectId,
        title: validated.title,
        periodStart: new Date(validated.periodStart),
        periodEnd: new Date(validated.periodEnd),
        totalHours: validated.totalHours,
        totalAmount: validated.totalAmount,
        lineItems: validated.lineItems ? JSON.parse(JSON.stringify(validated.lineItems)) : undefined,
        generatedBy: userId,
      },
    });

    await logAudit({
      organizationId: orgId,
      userId,
      action: "CREATE",
      entity: "BillingPacket",
      entityId: packet.id,
      metadata: { title: packet.title, totalAmount: packet.totalAmount },
      ipAddress: getClientIp(req.headers),
      userAgent: getUserAgent(req.headers),
    });

    const responseBody = { data: packet };
    storeIdempotentResponse(idempotency.key, orgId, idempotency.fingerprint, 201, responseBody);

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
