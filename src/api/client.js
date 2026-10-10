// Empty by default: in development Vite proxies the API's paths to its server (see vite.config.js).
// Set VITE_API_BASE_URL when the dashboard is hosted somewhere other than the API.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const REQUEST_TIMEOUT_MS = 8000;
// Used when a 429 arrives without a usable Retry-After; the API's limits use one-minute windows.
const DEFAULT_RETRY_AFTER_MS = 60_000;

/** The API's rate limit was hit; nothing it rejects will succeed for `retryAfterMs`. */
export class RateLimitedError extends Error {
  constructor(retryAfterMs) {
    super(`Rate limited by the API for ${Math.ceil(retryAfterMs / 1000)} s`);
    this.name = "RateLimitedError";
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * Calls an API path. A `body` is sent as JSON, or as multipart when it's FormData, and makes the
 * request a POST unless `method` says otherwise. Every API response is wrapped as
 * { status, statusCode, message, data }.
 */
export async function request(path, { method, signal, body, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const isForm = body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: method ?? (body ? "POST" : "GET"),
    // For FormData the browser sets the multipart Content-Type itself, boundary included.
    headers:
      body && !isForm
        ? { Accept: "application/json", "Content-Type": "application/json" }
        : { Accept: "application/json" },
    body: isForm ? body : body && JSON.stringify(body),
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
      : AbortSignal.timeout(timeoutMs),
  });
  if (response.status === 429) {
    // Retry-After is in seconds.
    const retryAfterSeconds = Number(response.headers.get("Retry-After"));
    throw new RateLimitedError(
      retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : DEFAULT_RETRY_AFTER_MS,
    );
  }
  const json = await response.json().catch(() => null);
  // The dev proxy answers 502 when nothing is listening on the API's port.
  if (!json && response.status >= 502 && response.status <= 504) {
    throw new Error(`Can't reach the API server (HTTP ${response.status}). Is NUSIS-I2 running?`);
  }
  return { response, body: json };
}
