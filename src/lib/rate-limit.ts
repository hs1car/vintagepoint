/**
 * In-memory Rate Limiter
 * Protects APIs from abuse by limiting requests per IP
 */

interface RateLimitStore {
  count: number
  resetTime: number
}

// Store rate limit data in memory
const rateLimitMap = new Map<string, RateLimitStore>()

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 10 * 60 * 1000)

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number
  
  /**
   * Time window in seconds
   */
  windowSeconds: number
  
  /**
   * Optional identifier (defaults to IP)
   */
  identifier?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  
  const key = `${identifier}:${config.limit}:${config.windowSeconds}`
  const record = rateLimitMap.get(key)

  // No record or expired window - create new
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs
    rateLimitMap.set(key, {
      count: 1,
      resetTime
    })
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.floor(resetTime / 1000)
    }
  }

  // Within window - check limit
  if (record.count < config.limit) {
    record.count++
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - record.count,
      reset: Math.floor(record.resetTime / 1000)
    }
  }

  // Rate limit exceeded
  return {
    success: false,
    limit: config.limit,
    remaining: 0,
    reset: Math.floor(record.resetTime / 1000),
    retryAfter: Math.ceil((record.resetTime - now) / 1000)
  }
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  // Check common headers for real IP
  const headers = request.headers
  
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Fallback to a default
  return 'unknown'
}

/**
 * Presets for different API types
 */
export const RateLimitPresets = {
  // Very strict - for sensitive operations
  STRICT: {
    limit: 5,
    windowSeconds: 60 // 5 requests per minute
  },
  
  // Standard - for most APIs
  STANDARD: {
    limit: 30,
    windowSeconds: 60 // 30 requests per minute
  },
  
  // Relaxed - for public read operations
  RELAXED: {
    limit: 100,
    windowSeconds: 60 // 100 requests per minute
  },
  
  // File uploads
  UPLOAD: {
    limit: 10,
    windowSeconds: 300 // 10 uploads per 5 minutes
  },
  
  // Authentication
  AUTH: {
    limit: 5,
    windowSeconds: 300 // 5 attempts per 5 minutes
  }
} as const

/**
 * Create rate limit response
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString()
  })

  if (result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString())
  }

  return new Response(
    JSON.stringify({
      error: 'تم تجاوز الحد المسموح من الطلبات',
      message: `Too many requests. Please try again in ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter,
      reset: result.reset
    }),
    {
      status: 429,
      headers
    }
  )
}

/**
 * Helper to apply rate limiting to API routes
 */
export async function applyRateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const ip = config.identifier || getClientIp(request)
  return checkRateLimit(ip, config)
}
