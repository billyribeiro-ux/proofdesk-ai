const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const AUTH_LIMIT: RateLimitConfig = {
  windowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 900_000,
  max: Number(process.env.RATE_LIMIT_AUTH_MAX) || 20,
};

const MUTATION_LIMIT: RateLimitConfig = {
  windowMs: Number(process.env.RATE_LIMIT_MUTATION_WINDOW_MS) || 60_000,
  max: Number(process.env.RATE_LIMIT_MUTATION_MAX) || 60,
};

export function checkRateLimit(
  key: string,
  type: "auth" | "mutation" = "mutation"
): { allowed: boolean; remaining: number; resetAt: number } {
  const config = type === "auth" ? AUTH_LIMIT : MUTATION_LIMIT;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs };
  }

  entry.count++;
  const allowed = entry.count <= config.max;
  return {
    allowed,
    remaining: Math.max(0, config.max - entry.count),
    resetAt: entry.resetAt,
  };
}

export function getRateLimitHeaders(
  key: string,
  type: "auth" | "mutation" = "mutation"
): Record<string, string> {
  const result = checkRateLimit(key, type);
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetAt),
  };
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 60_000);
}
