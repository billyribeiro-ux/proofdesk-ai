import { ApiError } from "@/lib/api/error";

export function enforceTenant(
  resourceOrgId: string,
  sessionOrgId: string
): void {
  if (resourceOrgId !== sessionOrgId) {
    throw ApiError.forbidden("Cross-tenant access denied");
  }
}

export function scopeWhere(organizationId: string) {
  return { organizationId };
}

export function scopedQuery<T extends Record<string, unknown>>(
  organizationId: string,
  where: T
): T & { organizationId: string } {
  return { ...where, organizationId };
}
