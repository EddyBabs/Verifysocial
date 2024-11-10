interface RateLimitEntry {
  count: number;
  lastRequestTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Custom rate limiter to track request counts for a specific identifier within a time window.
 *
 * @param identifier - Unique identifier for rate limiting (e.g., IP address, user ID)
 * @param limit - Maximum allowed requests within the duration
 * @param duration - Time window for rate limiting, in milliseconds
 * @returns An object indicating if the request is allowed
 */

export function customRateLimiter(
  identifier: string,
  limit: number,
  duration: number
): { allowed: boolean; reset?: number } {
  const currentTime = Date.now();

  // Clean up expired entries in the rate limit store
  cleanupExpiredEntries(duration);

  // Check if identifier exists in rate limit store
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, { count: 1, lastRequestTime: currentTime });
    return { allowed: true };
  }

  const userData = rateLimitStore.get(identifier)!;
  const timePassed = currentTime - userData.lastRequestTime;

  if (timePassed > duration) {
    // Reset count after time window has passed
    rateLimitStore.set(identifier, { count: 1, lastRequestTime: currentTime });
    return { allowed: true };
  } else if (userData.count < limit) {
    // Increment count within time window
    userData.count += 1;
    rateLimitStore.set(identifier, userData);
    return { allowed: true };
  } else {
    // Deny if limit is reached within time window
    const reset = Math.ceil((duration - timePassed) / 1000);
    return { allowed: false, reset };
  }
}

/**
 * Helper function to clean up expired entries from the rate limit store
 *
 * @param duration - Duration after which rate limit entries expire, in milliseconds
 */
function cleanupExpiredEntries(duration: number) {
  const currentTime = Date.now();

  rateLimitStore.forEach((value, key) => {
    if (currentTime - value.lastRequestTime > duration) {
      rateLimitStore.delete(key);
    }
  });
}
