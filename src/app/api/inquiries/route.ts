import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
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
        },
        sparePart: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Inquiries fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}
