/**
 * Allows at most `limit` attempts in any `windowMs`, and can be paused outright, e.g. for as
 * long as the server's Retry-After says.
 */
export function createRateLimiter({ limit, windowMs }) {
  let attempts = [];
  let pausedUntil = 0;

  return {
    /** Records an attempt. Returns 0 when it's allowed, otherwise the ms until one will be. */
    take(now = Date.now()) {
      if (now < pausedUntil) return pausedUntil - now;
      attempts = attempts.filter((at) => now - at < windowMs);
      if (attempts.length >= limit) return attempts[0] + windowMs - now;
      attempts.push(now);
      return 0;
    },

    pauseFor(ms, now = Date.now()) {
      pausedUntil = Math.max(pausedUntil, now + ms);
    },
  };
}
