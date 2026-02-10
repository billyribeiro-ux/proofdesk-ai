import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { apiErrorResponse } from "@/lib/api/error";
import { getSearchAdapter } from "@/lib/search";
import { IS_DEMO } from "@/lib/constants/app";

const VALID_ENTITY_TYPES = ["client", "project", "evidence", "work_event"] as const;
type ValidEntityType = (typeof VALID_ENTITY_TYPES)[number];

const searchParamsSchema = z.object({
  q: z.string().min(1).max(200),
  entityTypes: z.string().optional(),
  projectId: z.string().optional(),
  clientId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
});

export async function GET(req: NextRequest) {
  try {
    const { orgId } = await requireSession();

    if (IS_DEMO) return NextResponse.json({ results: [], total: 0, page: 1, pageSize: 20 });

    const { searchParams } = new URL(req.url);
    const params = searchParamsSchema.parse({
      q: searchParams.get("q") ?? "",
      entityTypes: searchParams.get("entityTypes") ?? undefined,
      projectId: searchParams.get("projectId") ?? undefined,
      clientId: searchParams.get("clientId") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
    });

    const entityTypes = params.entityTypes
      ? params.entityTypes.split(",").filter((t): t is ValidEntityType =>
          (VALID_ENTITY_TYPES as readonly string[]).includes(t)
        )
      : undefined;

    const adapter = getSearchAdapter();
    const results = await adapter.search(
      orgId,
      params.q,
      { entityTypes, projectId: params.projectId, clientId: params.clientId, dateFrom: params.dateFrom, dateTo: params.dateTo },
      params.page,
      params.pageSize
    );

    return NextResponse.json(results);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
