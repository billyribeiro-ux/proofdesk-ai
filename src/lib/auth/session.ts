import { auth } from "@/lib/auth/config";
import { ApiError } from "@/lib/api/error";
import type { Role } from "@/lib/constants/app";

export interface SessionData {
  userId: string;
  orgId: string;
  orgRole: Role;
  orgName?: string;
  orgSlug?: string;
}

export async function requireSession(): Promise<SessionData> {
  const session = await auth();
  if (!session?.user?.id) throw ApiError.unauthorized();

  const s = session as unknown as Record<string, unknown>;
  const orgId = s.orgId as string | undefined;
  if (!orgId) throw ApiError.forbidden("No organization context");

  return {
    userId: session.user.id,
    orgId,
    orgRole: (s.orgRole as Role) ?? "CLIENT_VIEWER",
    orgName: s.orgName as string | undefined,
    orgSlug: s.orgSlug as string | undefined,
  };
}
