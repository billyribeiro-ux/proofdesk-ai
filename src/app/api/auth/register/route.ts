import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/validation/schemas";
import { apiErrorResponse, ApiError } from "@/lib/api/error";
import { hash } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rl = checkRateLimit(`${ip}:auth`, "auth");
    if (!rl.allowed) throw ApiError.tooManyRequests();

    const body = await req.json();
    const { name, email, password, orgName } = signUpSchema.parse(body);

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict("An account with this email already exists");

    const passwordHash = await hash(password);
    const slug = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existingOrg = await db.organization.findUnique({ where: { slug } });
    if (existingOrg) throw ApiError.conflict("Organization slug already taken");

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, passwordHash },
      });

      const org = await tx.organization.create({
        data: { name: orgName, slug },
      });

      await tx.membership.create({
        data: { userId: user.id, organizationId: org.id, role: "OWNER" },
      });

      await tx.subscription.create({
        data: { organizationId: org.id, plan: "FREE", status: "TRIALING" },
      });

      await tx.activityLog.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          action: "REGISTER",
          entity: "User",
          entityId: user.id,
          ipAddress: ip,
        },
      });

      return { user: { id: user.id, name: user.name, email: user.email }, org: { id: org.id, name: org.name, slug: org.slug } };
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
