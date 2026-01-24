import { db } from '@/lib/db'
import type { MetadataRoute } from 'next'

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vintagepoint.ae'
  
  try {
    // Try to fetch database data
    const cars = await db.car.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true }
    })

    const parts = await db.sparePart.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true }
    })

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/buying-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...cars.map((car) => ({
      url: `${baseUrl}/cars/${car.id}`,
      lastModified: car.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...parts.map((part) => ({
      url: `${baseUrl}/parts/${part.id}`,
      lastModified: part.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
  } catch (error) {
    // Return basic sitemap if database is not available
    console.error('Sitemap database error:', error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/buying-guide`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ]
  }
}
