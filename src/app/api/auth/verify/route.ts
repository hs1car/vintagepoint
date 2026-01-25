import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('admin-session')?.value

    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const admin = await db.adminUser.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      admin
    })
  } catch (error) {
    devLog.error('Verify session error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
