import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { logger, LogType, devLog } from '@/lib/logger'
import { applyRateLimit, createRateLimitResponse, RateLimitPresets } from '@/lib/rate-limit'
import { loginSchema, validateData } from '@/lib/validation'

export async function POST(request: NextRequest) {
  // Rate limiting: 5 login attempts per 5 minutes
  const rateLimit = await applyRateLimit(request, RateLimitPresets.AUTH)
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit)
  }
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                  request.headers.get('x-real-ip') ||
                  'unknown'

  try {
    const body = await request.json()
    
    // Validate input
    const validation = validateData(loginSchema, body)
    if (!validation.success) {
      await logger.login(body.email || 'unknown', '', clientIP, false)
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 })
    }

    const { email, password } = validation.data

    // Support both email and username login
    // If user enters 'vp', convert to email format
    const loginEmail = email === 'vp' ? 'vp@admin.com' : email

    // Find admin user
    const admin = await db.adminUser.findUnique({
      where: { email: loginEmail }
    })

    if (!admin) {
      await logger.login(email, '', clientIP, false)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      await logger.login(email, admin.id, clientIP, false)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Log successful login
    await logger.login(email, admin.id, clientIP, true)

    // Create session
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })

    // Set session cookie with maximum security
    response.cookies.set('admin_session', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Changed from 'lax' to 'strict' for CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    devLog.error('Login error:', error)
    await logger.error('Login failed', { error: String(error) }, undefined, clientIP)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
