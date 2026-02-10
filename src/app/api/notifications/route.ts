import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { apiErrorResponse } from "@/lib/api/error";
import { scopeWhere } from "@/lib/security/tenant";
import { assertPermission } from "@/lib/security/rbac";

export async function GET() {
  try {
    const { userId, orgId, orgRole } = await requireSession();
    assertPermission(orgRole, "notification:read");

    const notifications = await db.notification.findMany({
      where: { ...scopeWhere(orgId), userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await db.notification.count({
      where: { ...scopeWhere(orgId), userId, read: false },
    });

    return NextResponse.json({ data: notifications, unreadCount });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, orgId } = await requireSession();

    const body = await req.json();
    const { notificationIds } = body as { notificationIds?: string[] };

    if (notificationIds?.length) {
      await db.notification.updateMany({
        where: { id: { in: notificationIds }, ...scopeWhere(orgId), userId },
        data: { read: true },
      });
    } else {
      await db.notification.updateMany({
        where: { ...scopeWhere(orgId), userId, read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
