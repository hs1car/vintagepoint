import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Edge Runtime compatible - cannot import Node.js modules
// CSRF protection is handled in API routes directly

// Environment-aware logging (Edge Runtime compatible)
const isDevelopment = process.env.NODE_ENV === 'development'
const log = (...args: any[]) => isDevelopment && console.log(...args)

/**
 * Middleware for Next.js
 * Runs before all requests
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/images/') ||
    pathname.includes('/upload/') ||
    pathname.includes('/uploads/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp')
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  
  // === COMPREHENSIVE SECURITY HEADERS ===
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // XSS Protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions Policy (disable unused features)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )
  
  // HSTS (HTTP Strict Transport Security) - Production only
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  // Content Security Policy - Strict but functional
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://wa.me",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', cspDirectives)

  // Log API requests (development only)
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown'
    log(`[API] ${request.method} ${pathname} - IP: ${ip}`)
  }

  return response
}

/**
 * Configure which routes use middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (sw.js, robots.txt, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.json|sw.js|offline.html).*)',
  ],
}
