import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { logger, LogType } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                  request.headers.get('x-real-ip') ||
                  'unknown'

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      await logger.login(email, '', clientIP, false)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

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

    // Set session cookie
    response.cookies.set('admin_session', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    await logger.error('Login failed', { error: String(error) }, undefined, clientIP)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
