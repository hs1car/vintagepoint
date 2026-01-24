import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const cars = await db.car.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(cars)
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { model, year, condition, price, description, images } = body
    
    console.log('[POST /api/cars] Received:', { model, year, condition, price, description, images })

    if (!model || !year || !condition) {
      console.log('[POST /api/cars] Missing fields:', { model, year, condition })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const car = await db.car.create({
      data: {
        model,
        year: parseInt(year),
        condition,
        price: price ? parseFloat(price) : null,
        description: description || '',
        images: Array.isArray(images) ? JSON.stringify(images) : (images || '[]'),
      },
    })

    console.log('[POST /api/cars] Car created:', car.id)
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error('Error creating car:', error)
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}
