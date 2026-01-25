import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { applyRateLimit, createRateLimitResponse, RateLimitPresets } from '@/lib/rate-limit'
import { carCreateSchema, validateData } from '@/lib/validation'
import { devLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  // Rate limiting: 100 requests per minute
  const rateLimit = await applyRateLimit(request, RateLimitPresets.RELAXED)
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit)
  }
  try {
    const cars = await db.car.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(cars)
  } catch (error) {
    devLog.error('Error fetching cars:', error)
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth()

    const body = await request.json()
    
    // Validate input with Zod
    const validation = validateData(carCreateSchema, body)
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 })
    }

    const car = await db.car.create({
      data: validation.data,
    })

    devLog.info('[POST /api/cars] Car created successfully:', car.id)
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    devLog.error('Error creating car:', error)
    return NextResponse.json({ 
      error: 'Failed to create car',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
