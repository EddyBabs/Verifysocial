import { customRateLimiter } from "./custom-rate-limit";
import { rateLimiter, RateLimitHelper } from "./rate-limit";

export async function checkRateLimitAndThrowError({
  rateLimitingType = "core",
  identifier,
  onRateLimiterResponse,
  opts,
}: RateLimitHelper) {
  console.log("Checking Rate Limiter");
  const response = await rateLimiter()({ rateLimitingType, identifier, opts });
  const { success, reset } = response;

  if (onRateLimiterResponse) onRateLimiterResponse(response);

  if (!success) {
    console.log("Not success");
    const convertToSeconds = (ms: number) => Math.floor(ms / 1000);
    const secondsToWait = convertToSeconds(reset - Date.now());
    throw new Error(
      JSON.stringify({
        error: `Rate limit exceeded. Try again in ${secondsToWait} seconds`,
      })
    );
  }
}

export async function customCheckRateLimitAndThrowError(identifier: string) {
  console.log("Checking Rate Limiter");
  const { allowed, reset } = customRateLimiter(identifier, 1, 60 * 1000);
  console.log({ allowed });
  if (!allowed) {
    console.log("Not success");

    throw new Error(`Rate limit exceeded. Try again ${reset || 60} seconds`);
  }
}
