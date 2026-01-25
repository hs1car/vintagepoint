import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { devLog } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const car = await db.car.findUnique({
      where: { id },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    devLog.error('Error fetching car:', error)
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAuth()

    const { id } = await params
    const body = await request.json()
    const { model, year, condition, price, description, images, isActive } = body

    devLog.log('[PUT /api/cars/:id] Updating car:', id, body)

    if (!model || !year || !condition || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const car = await db.car.update({
      where: { id },
      data: {
        model,
        year: parseInt(year),
        condition,
        price: parseFloat(price),
        description: description || '',
        images: Array.isArray(images) ? JSON.stringify(images) : images,
        ...(isActive !== undefined && { isActive }),
      },
    })

    devLog.log('[PUT /api/cars/:id] Car updated successfully:', car.id)
    return NextResponse.json(car)
  } catch (error) {
    devLog.error('Error updating car:', error)
    return NextResponse.json({ 
      error: 'Failed to update car',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAuth()

    const { id } = await params
    
    devLog.log('[DELETE /api/cars/:id] Deleting car:', id)
    
    await db.car.delete({
      where: { id },
    })

    devLog.log('[DELETE /api/cars/:id] Car deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    devLog.error('Error deleting car:', error)
    return NextResponse.json({ 
      error: 'Failed to delete car',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
