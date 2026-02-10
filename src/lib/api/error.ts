import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiErrorEnvelope {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 400,
    public readonly fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string, fieldErrors?: Record<string, string[]>) {
    return new ApiError("BAD_REQUEST", message, 400, fieldErrors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError("UNAUTHORIZED", message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError("FORBIDDEN", message, 403);
  }

  static notFound(message = "Not found") {
    return new ApiError("NOT_FOUND", message, 404);
  }

  static conflict(message: string) {
    return new ApiError("CONFLICT", message, 409);
  }

  static tooManyRequests(message = "Too many requests") {
    return new ApiError("TOO_MANY_REQUESTS", message, 429);
  }

  static internal(message = "Internal server error") {
    return new ApiError("INTERNAL_ERROR", message, 500);
  }
}

export function formatZodError(error: ZodError): ApiErrorEnvelope {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  }
  return {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    fieldErrors,
  };
}

export function apiErrorResponse(
  error: unknown,
  requestId?: string
): NextResponse<ApiErrorEnvelope> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        code: error.code,
        message: error.message,
        fieldErrors: error.fieldErrors,
        requestId,
      },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { ...formatZodError(error), requestId },
      { status: 400 }
    );
  }

  console.error("[API_ERROR]", error);
  return NextResponse.json(
    {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      requestId,
    },
    { status: 500 }
  );
}
