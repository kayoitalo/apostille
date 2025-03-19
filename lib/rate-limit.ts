//claude olhou mas tá zuado ainda

// import { Ratelimit } from '@upstash/ratelimit';
// import { Redis } from '@upstash/redis';

/*
// Initialize Redis client
let redis: Redis;
let rateLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
    prefix: '@upstash/ratelimit',
  });
} 

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  // If rate limiting is not configured, allow all requests
  if (!rateLimiter) {
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  const result = await rateLimiter.limit(identifier);
  return result;
} // End of file*/