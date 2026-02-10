const BASE_MS = Number(process.env.QUEUE_RETRY_BASE_MS) || 500;
const MAX_ATTEMPTS = Number(process.env.QUEUE_MAX_RETRIES) || 5;

/** Exponential backoff with jitter: base * 2^attempt + random(0..base) */
export function getRetryDelay(attempt: number): number {
  const exponential = BASE_MS * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * BASE_MS);
  return exponential + jitter;
}

export function shouldRetry(attempt: number, maxAttempts?: number): boolean {
  return attempt < (maxAttempts ?? MAX_ATTEMPTS);
}

export function getMaxAttempts(): number {
  return MAX_ATTEMPTS;
}
