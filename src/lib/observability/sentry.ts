export function initSentry() {
  if (!process.env.SENTRY_DSN) return;

  // Sentry is initialized via @sentry/nextjs instrumentation
  // This module provides helper utilities for manual capture
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>
) {
  console.error("[SENTRY_CAPTURE]", error, context);
  // In production, @sentry/nextjs captures automatically via error boundaries
  // Manual capture available via: Sentry.captureException(error, { extra: context })
}

export function setUserContext(user: {
  id: string;
  email: string;
  orgId?: string;
}) {
  // Set via Sentry.setUser in client-side code
  if (typeof window !== "undefined") {
    console.debug("[SENTRY_USER]", user.id);
  }
}
