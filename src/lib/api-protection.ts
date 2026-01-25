/**
 * API Protection Utilities
 * Combines CSRF, Rate Limiting, and Input Validation
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyCsrfToken } from './csrf'
import { applyRateLimit, RateLimitPresets } from './rate-limit'
import { z } from 'zod'

export interface ProtectionOptions {
  csrf?: boolean
  rateLimit?: typeof RateLimitPresets[keyof typeof RateLimitPresets]
  validation?: z.ZodSchema
  requireAuth?: boolean
}

/**
 * Protect API route with multiple security layers
 */
export async function protectRoute(
  request: NextRequest,
  options: ProtectionOptions = {}
): Promise<NextResponse | null> {
  
  // 1. Rate Limiting
  if (options.rateLimit) {
    const rateLimit = await applyRateLimit(request, options.rateLimit)
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 60)
          }
        }
      )
    }
  }

  // 2. CSRF Protection (for mutating requests)
  if (options.csrf) {
    const method = request.method
    if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
      const isValid = await verifyCsrfToken(request)
      if (!isValid) {
        return NextResponse.json(
          { error: 'CSRF token validation failed' },
          { status: 403 }
        )
      }
    }
  }

  // 3. Authentication Check
  if (options.requireAuth) {
    const sessionId = request.cookies.get('admin-session')?.value
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  // 4. Input Validation
  if (options.validation && (request.method === 'POST' || request.method === 'PUT')) {
    try {
      const body = await request.clone().json()
      const result = options.validation.safeParse(body)
      
      if (!result.success) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: result.error.issues 
          },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
  }

  // All checks passed
  return null
}

/**
 * Wrapper for API routes with automatic protection
 */
export function withProtection(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  options: ProtectionOptions = {}
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    // Apply protections
    const protectionResult = await protectRoute(req, options)
    
    if (protectionResult) {
      return protectionResult
    }

    // Run the actual handler
    return handler(req, ...args)
  }
}
