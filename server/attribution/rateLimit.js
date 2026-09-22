/**
 * Fixed-window rate limiter held in memory.
 *
 * Best effort by design: it lives in one function instance, and Vercel runs
 * several, so a determined caller spread across instances gets more than the
 * limit. It still stops the cheap abuse (one script hammering the endpoint to
 * fish for leads or burn Zoho API credits), and it needs no store. A shared
 * limit would need Redis or similar; revisit if the logs show abuse.
 */

/**
 * @param {{ limit: number, windowMs: number, maxKeys?: number, now?: () => number }} options
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 5000, now = Date.now }) {
  const windows = new Map();

  function evict() {
    const t = now();
    for (const [key, w] of windows) {
      if (t - w.start >= windowMs) windows.delete(key);
    }
    // Still full of live windows: drop the oldest entries (Map keeps insertion order).
    while (windows.size >= maxKeys) windows.delete(windows.keys().next().value);
  }

  return {
    /** @returns {boolean} true when this call is within the limit for `key` */
    allow(key) {
      const t = now();
      const current = windows.get(key);
      if (!current || t - current.start >= windowMs) {
        if (!current && windows.size >= maxKeys) evict();
        windows.set(key, { start: t, count: 1 });
        return true;
      }
      current.count += 1;
      return current.count <= limit;
    },
    size: () => windows.size,
  };
}
