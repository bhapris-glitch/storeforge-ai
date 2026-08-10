/**
 * ============================================================================
 * StoreForge AI
 * Rate Limiter Middleware
 * ============================================================================
 *
 * File:
 *   backend/src/middleware/rateLimiter.js
 *
 * Purpose:
 *   Protect StoreForge API endpoints from excessive requests.
 *
 * Storage:
 *   Redis
 *
 * Features:
 *   - IP-based rate limiting
 *   - Optional user-based rate limiting
 *   - Configurable window and request limit
 *   - Redis-backed counters
 *   - Standard rate-limit headers
 *   - Graceful fallback when Redis is unavailable
 * ============================================================================
 */

'use strict';

const {
  getRedisClient,
  connectRedis
} = require('../config/redis');


// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_WINDOW_MS =
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;

const DEFAULT_MAX_REQUESTS =
  Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;


// ============================================================================
// HELPERS
// ============================================================================

function getClientIdentifier(req, options = {}) {
  if (options.keyGenerator) {
    return options.keyGenerator(req);
  }

  if (
    options.byUser !== false &&
    req.user &&
    (req.user.id || req.user._id)
  ) {
    return `user:${req.user.id || req.user._id}`;
  }

  const forwardedFor = req.headers['x-forwarded-for'];

  if (forwardedFor) {
    return `ip:${forwardedFor.split(',')[0].trim()}`;
  }

  return `ip:${req.ip || req.socket?.remoteAddress || 'unknown'}`;
}


function getWindowSeconds(windowMs) {
  return Math.max(1, Math.ceil(windowMs / 1000));
}


function getRetryAfterSeconds(resetAt) {
  return Math.max(
    1,
    Math.ceil((resetAt - Date.now()) / 1000)
  );
}


// ============================================================================
// RATE LIMITER FACTORY
// ============================================================================

function createRateLimiter(options = {}) {
  const windowMs =
    Number(options.windowMs) || DEFAULT_WINDOW_MS;

  const max =
    Number(options.max) || DEFAULT_MAX_REQUESTS;

  const prefix =
    options.prefix || 'storeforge:ratelimit';

  const byUser =
    options.byUser !== false;

  const failOpen =
    options.failOpen !== false;

  return async function rateLimiter(req, res, next) {
    const identifier = getClientIdentifier(req, {
      ...options,
      byUser
    });

    const key =
      `${prefix}:${identifier}`;

    const windowSeconds =
      getWindowSeconds(windowMs);

    try {
      const redis = getRedisClient();

      if (!redis.isReady) {
        await connectRedis();
      }

      const current =
        await redis.incr(key);

      // First request in the window.
      if (current === 1) {
        await redis.expire(
          key,
          windowSeconds
        );
      }

      const ttl =
        await redis.ttl(key);

      const resetAt =
        Date.now() +
        (Math.max(ttl, 1) * 1000);

      const remaining =
        Math.max(0, max - current);

      // ----------------------------------------------------------------------
      // RATE LIMIT HEADERS
      // ----------------------------------------------------------------------

      res.setHeader(
        'X-RateLimit-Limit',
        String(max)
      );

      res.setHeader(
        'X-RateLimit-Remaining',
        String(remaining)
      );

      res.setHeader(
        'X-RateLimit-Reset',
        String(Math.ceil(resetAt / 1000))
      );

      // ----------------------------------------------------------------------
      // LIMIT EXCEEDED
      // ----------------------------------------------------------------------

      if (current > max) {
        const retryAfter =
          getRetryAfterSeconds(resetAt);

        res.setHeader(
          'Retry-After',
          String(retryAfter)
        );

        return res.status(429).json({
          success: false,
          message:
            'Too many requests. Please try again later.',
          retryAfter
        });
      }

      return next();

    } catch (error) {
      console.error(
        '[RateLimiter] Redis error:',
        error.message
      );

      // ----------------------------------------------------------------------
      // FAIL OPEN
      // ----------------------------------------------------------------------
      //
      // If Redis is temporarily unavailable, allow the request through.
      // This prevents Redis from becoming a single point of failure for
      // the entire API.
      //

      if (failOpen) {
        return next();
      }

      return next(error);
    }
  };
}


// ============================================================================
// DEFAULT API RATE LIMITER
// ============================================================================

const apiRateLimiter = createRateLimiter({
  windowMs: DEFAULT_WINDOW_MS,
  max: DEFAULT_MAX_REQUESTS,
  prefix: 'storeforge:ratelimit:api'
});


// ============================================================================
// AUTH RATE LIMITER
// ============================================================================
//
// More restrictive because login/register endpoints are sensitive.
//

const authRateLimiter = createRateLimiter({
  windowMs:
    Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) ||
    15 * 60 * 1000,

  max:
    Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) ||
    10,

  prefix: 'storeforge:ratelimit:auth',

  byUser: false
});


// ============================================================================
// AI RATE LIMITER
// ============================================================================
//
// AI requests can be expensive, so keep this limit separate.
//

const aiRateLimiter = createRateLimiter({
  windowMs:
    Number(process.env.AI_RATE_LIMIT_WINDOW_MS) ||
    60 * 1000,

  max:
    Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) ||
    20,

  prefix: 'storeforge:ratelimit:ai',

  byUser: true
});


// ============================================================================
// STORE GENERATION RATE LIMITER
// ============================================================================
//
// Store generation is an expensive operation. This gets its own limit.
//

const themeGenerationRateLimiter = createRateLimiter({
  windowMs:
    Number(process.env.THEME_RATE_LIMIT_WINDOW_MS) ||
    60 * 60 * 1000,

  max:
    Number(process.env.THEME_RATE_LIMIT_MAX_REQUESTS) ||
    5,

  prefix: 'storeforge:ratelimit:theme',

  byUser: true
});


// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createRateLimiter,

  apiRateLimiter,
  authRateLimiter,
  aiRateLimiter,
  themeGenerationRateLimiter,

  // Backwards-friendly default export.
  rateLimiter: apiRateLimiter
};
