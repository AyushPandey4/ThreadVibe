import { RateLimiterMemory } from 'rate-limiter-flexible';

export const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'rlflx-ip',
  points: 10, // 3 requests
  duration: 24 * 60 * 60, // per 24 hours
}); 