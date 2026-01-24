import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Total views
    const [totalViews, viewsLast30Days, viewsLast7Days, viewsToday] = await Promise.all([
      db.pageView.count(),
      db.pageView.count({ where: { createdAt: { gte: last30Days } } }),
      db.pageView.count({ where: { createdAt: { gte: last7Days } } }),
      db.pageView.count({ where: { createdAt: { gte: today } } }),
    ])

    // Most viewed cars
    const carViews = await db.pageView.groupBy({
      by: ['entityId'],
      where: {
        entityType: 'car',
        entityId: { not: null },
        createdAt: { gte: last30Days }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })

    const carIds = carViews.map(v => v.entityId).filter(Boolean) as string[]
    const cars = await db.car.findMany({
      where: { id: { in: carIds } },
      select: { id: true, model: true, year: true, images: true }
    })

    const topCars = carViews.map(view => {
      const car = cars.find(c => c.id === view.entityId)
      return {
        id: view.entityId,
        model: car?.model || 'Unknown',
        year: car?.year || 0,
        image: car?.images ? JSON.parse(car.images)[0] : null,
        views: view._count.id
      }
    })

    // Most viewed parts
    const partViews = await db.pageView.groupBy({
      by: ['entityId'],
      where: {
        entityType: 'part',
        entityId: { not: null },
        createdAt: { gte: last30Days }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })

    const partIds = partViews.map(v => v.entityId).filter(Boolean) as string[]
    const parts = await db.sparePart.findMany({
      where: { id: { in: partIds } },
      select: { id: true, name: true, images: true }
    })

    const topParts = partViews.map(view => {
      const part = parts.find(p => p.id === view.entityId)
      return {
        id: view.entityId,
        name: part?.name || 'Unknown',
        image: part?.images ? JSON.parse(part.images)[0] : null,
        views: view._count.id
      }
    })

    // Daily views for last 7 days
    const dailyViews = await db.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count
      FROM PageView
      WHERE createdAt >= ${last7Days.toISOString()}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `

    // Total inquiries
    const [totalInquiries, inquiriesLast30Days, inquiriesToday] = await Promise.all([
      db.inquiry.count(),
      db.inquiry.count({ where: { createdAt: { gte: last30Days } } }),
      db.inquiry.count({ where: { createdAt: { gte: today } } }),
    ])

    // Total wishlist items
    const totalWishlist = await db.wishlist.count()

    // Active cars and parts
    const [activeCars, activeParts] = await Promise.all([
      db.car.count({ where: { isActive: true } }),
      db.sparePart.count({ where: { isActive: true } }),
    ])

    // Top pages
    const topPages = await db.pageView.groupBy({
      by: ['page'],
      where: { createdAt: { gte: last30Days } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })

    return NextResponse.json({
      overview: {
        totalViews,
        viewsLast30Days,
        viewsLast7Days,
        viewsToday,
        totalInquiries,
        inquiriesLast30Days,
        inquiriesToday,
        totalWishlist,
        activeCars,
        activeParts,
      },
      topCars,
      topParts,
      dailyViews,
      topPages: topPages.map(p => ({
        page: p.page,
        views: p._count.id
      })),
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
