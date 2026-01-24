import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, entityType, entityId, eventType, metadata } = body

    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || null

    // Record page view
    if (page) {
      await db.pageView.create({
        data: {
          page,
          entityType: entityType || null,
          entityId: entityId || null,
          ipAddress,
          userAgent,
          referrer,
        }
      })
    }

    // Record event if provided
    if (eventType) {
      await db.analyticsEvent.create({
        data: {
          eventType,
          entityType: entityType || null,
          entityId: entityId || null,
          metadata: metadata ? JSON.stringify(metadata) : null,
          ipAddress,
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}
