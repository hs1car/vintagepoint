import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applyRateLimit, createRateLimitResponse, RateLimitPresets } from '@/lib/rate-limit'
import { devLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  // Rate limiting: 30 requests per minute
  const rateLimit = await applyRateLimit(request, RateLimitPresets.STANDARD)
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit)
  }
  try {
    const inquiries = await db.inquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        car: {
          select: {
            model: true,
            year: true
          }
        }
      }
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    devLog.error('Inquiries fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}
