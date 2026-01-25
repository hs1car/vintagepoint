import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { devLog } from '@/lib/logger'

interface Notification {
  id: string
  type: 'inquiry' | 'view' | 'car' | 'part' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
}

export async function GET() {
  try {
    // Get recent inquiries
    const recentInquiries = await db.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
      }
    })

    // Get recent cars
    const recentCars = await db.car.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        model: true,
        year: true,
        isActive: true,
        createdAt: true,
      }
    })

    // Get view analytics from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentViews = await db.pageView.findMany({
      where: {
        createdAt: { gte: oneDayAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const notifications: Notification[] = []

    // Add inquiry notifications
    for (const inquiry of recentInquiries.slice(0, 3)) {
      const timeAgo = getTimeAgo(inquiry.createdAt)
      notifications.push({
        id: `inq-${inquiry.id}`,
        type: 'inquiry',
        title: 'استفسار جديد',
        message: `استفسار من ${inquiry.name}`,
        time: timeAgo,
        read: false,
        priority: 'high',
        createdAt: inquiry.createdAt
      })
    }

    // Add car notifications
    for (const car of recentCars.slice(0, 2)) {
      const timeAgo = getTimeAgo(car.createdAt)
      notifications.push({
        id: `car-${car.id}`,
        type: 'car',
        title: car.isActive ? 'سيارة جديدة نشطة' : 'سيارة جديدة',
        message: `تم إضافة ${car.model} ${car.year}`,
        time: timeAgo,
        read: true,
        priority: 'low',
        createdAt: car.createdAt
      })
    }

    // Check for high view counts
    const viewCounts = new Map<string, number>()
    recentViews.forEach(view => {
      const key = view.page
      viewCounts.set(key, (viewCounts.get(key) || 0) + 1)
    })

    for (const [page, count] of viewCounts.entries()) {
      if (count >= 50) {
        notifications.push({
          id: `view-${page}`,
          type: 'view',
          title: 'مشاهدات قياسية',
          message: `الصفحة ${page} وصلت ${count} مشاهدة اليوم`,
          time: 'اليوم',
          read: false,
          priority: 'medium',
          createdAt: new Date()
        })
      }
    }

    // Sort by creation date
    notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(notifications.slice(0, 10))
  } catch (error) {
    devLog.error('Error fetching notifications:', error)
    
    // Return mock data as fallback
    return NextResponse.json([
      {
        id: '1',
        type: 'inquiry',
        title: 'استفسار جديد',
        message: 'لديك استفسارات جديدة تحتاج للمراجعة',
        time: 'الآن',
        read: false,
        priority: 'high'
      }
    ])
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'الآن'
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  if (diffDays < 7) return `منذ ${diffDays} يوم`
  return new Date(date).toLocaleDateString('ar')
}
