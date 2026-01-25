import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applyRateLimit, createRateLimitResponse, RateLimitPresets } from '@/lib/rate-limit'
import { devLog } from '@/lib/logger'
import { withProtection } from '@/lib/api-protection'
import { z } from 'zod'

const partSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').or(z.string().regex(/^\d+(\.\d{1,2})?$/)),
  images: z.union([z.string(), z.array(z.string())]).optional(),
})

export async function GET(request: NextRequest) {
  // Rate limiting: 100 requests per minute
  const rateLimit = await applyRateLimit(request, RateLimitPresets.RELAXED)
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit)
  }
  try {
    const parts = await db.sparePart.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(parts)
  } catch (error) {
    devLog.error('Error fetching parts:', error)
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 })
  }
}

export const POST = withProtection(async (request: NextRequest) => {
  const body = await request.json()
  const { name, description, price, images } = body

  const part = await db.sparePart.create({
    data: {
      name,
      description,
      price: typeof price === 'string' ? parseFloat(price) : price,
      images: Array.isArray(images) ? JSON.stringify(images) : images,
    },
  })

  return NextResponse.json(part, { status: 201 })
}, {
  requireAuth: true,
  validation: partSchema,
})
