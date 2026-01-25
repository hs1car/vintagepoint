/**
 * CSRF Protection Utility
 * Protects against Cross-Site Request Forgery attacks
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomBytes, createHash } from 'crypto'

const CSRF_TOKEN_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const TOKEN_LENGTH = 32

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(TOKEN_LENGTH).toString('hex')
}

/**
 * Hash a CSRF token for storage
 */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies()
  const storedToken = cookieStore.get(CSRF_TOKEN_NAME)?.value
  
  // Get token from header or body
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  let bodyToken: string | undefined

  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    try {
      const body = await request.clone().json()
      bodyToken = body.csrfToken || body._csrf
    } catch {
      // Not JSON or no body
    }
  }

  const requestToken = headerToken || bodyToken

  if (!storedToken || !requestToken) {
    return false
  }

  // Compare hashed tokens
  return hashToken(requestToken) === hashToken(storedToken)
}

/**
 * Create response with CSRF token cookie
 */
export function setCsrfToken(response: NextResponse): NextResponse {
  const token = generateCsrfToken()
  
  response.cookies.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  })

  // Also set in header for client to read
  response.headers.set(CSRF_HEADER_NAME, token)
  
  return response
}

/**
 * Middleware to check CSRF token on mutating requests
 */
export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
  const method = request.method

  // Only check on mutating methods
  if (method !== 'POST' && method !== 'PUT' && method !== 'DELETE' && method !== 'PATCH') {
    return null
  }

  // Skip CSRF for specific endpoints (like webhooks, public APIs)
  const pathname = request.nextUrl.pathname
  const skipPaths = [
    '/api/analytics/track', // Public tracking
    '/api/webhooks/',       // External webhooks
  ]

  if (skipPaths.some(path => pathname.startsWith(path))) {
    return null
  }

  // Verify CSRF token
  const isValid = await verifyCsrfToken(request)

  if (!isValid) {
    return NextResponse.json(
      { error: 'CSRF token validation failed' },
      { status: 403 }
    )
  }

  return null
}

/**
 * Get CSRF token for client-side use
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_NAME)?.value
}
