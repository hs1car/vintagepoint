import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/logger'
import { applyRateLimit, createRateLimitResponse, RateLimitPresets } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = await applyRateLimit(request, RateLimitPresets.RELAXED)
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit)
  }

  try {
    const { searchParams } = new URL(request.url)
    
    // Search parameters
    const query = searchParams.get('q') || ''
    const minYear = searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined
    const maxYear = searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined
    const condition = searchParams.get('condition') || undefined
    const isActive = searchParams.get('isActive')
    const isFeatured = searchParams.get('isFeatured')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    // Text search in model and description
    if (query) {
      where.OR = [
        { model: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Year filter
    if (minYear !== undefined || maxYear !== undefined) {
      where.year = {}
      if (minYear !== undefined) where.year.gte = minYear
      if (maxYear !== undefined) where.year.lte = maxYear
    }

    // Condition filter
    if (condition && condition !== 'all') {
      where.condition = condition
    }

    // Active status filter
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    // Featured filter
    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true'
    }

    // Get total count for pagination
    const totalCount = await db.car.count({ where })

    // Build orderBy
    const orderBy: any = {}
    if (sortBy === 'price' || sortBy === 'year' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    // Get cars with pagination
    const cars = await db.car.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      cars,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      },
      filters: {
        query,
        minYear,
        maxYear,
        condition,
        isActive,
        isFeatured,
        sortBy,
        sortOrder
      }
    })
  } catch (error) {
    devLog.error('Cars search error:', error)
    return NextResponse.json(
      { error: 'Failed to search cars' },
      { status: 500 }
    )
  }
}
