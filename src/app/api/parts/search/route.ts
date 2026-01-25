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
    const isActive = searchParams.get('isActive')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    // Text search in name and description
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Active status filter
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    // Get total count for pagination
    const totalCount = await db.sparePart.count({ where })

    // Build orderBy
    const orderBy: any = {}
    if (sortBy === 'price' || sortBy === 'name' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    // Get parts with pagination
    const parts = await db.sparePart.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      parts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore
      },
      filters: {
        query,
        isActive,
        sortBy,
        sortOrder
      }
    })
  } catch (error) {
    devLog.error('Parts search error:', error)
    return NextResponse.json(
      { error: 'Failed to search parts' },
      { status: 500 }
    )
  }
}
