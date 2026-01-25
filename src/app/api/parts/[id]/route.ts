import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/logger'
import { withProtection } from '@/lib/api-protection'
import { z } from 'zod'

const partUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  price: z.number().positive().or(z.string().regex(/^\d+(\.\d{1,2})?$/)).optional(),
  images: z.union([z.string(), z.array(z.string())]).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const part = await db.sparePart.findUnique({
      where: { id },
    })

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }

    return NextResponse.json(part)
  } catch (error) {
    devLog.error('Error fetching part:', error)
    return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 })
  }
}

export const PUT = withProtection(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await request.json()
  const { name, description, price, images, isActive } = body

  const part = await db.sparePart.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: typeof price === 'string' ? parseFloat(price) : price }),
      ...(images && { images: Array.isArray(images) ? JSON.stringify(images) : images }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return NextResponse.json(part)
}, {
  requireAuth: true,
  validation: partUpdateSchema,
})

export const DELETE = withProtection(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  await db.sparePart.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}, {
  requireAuth: true,
})
