import { db } from '@/lib/db'

export default async function sitemap() {
  const baseUrl = 'https://vintagepoint.ae'
  
  // Return static sitemap if DATABASE_URL is not available (build time on hosting)
  if (!process.env.DATABASE_URL) {
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
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/wishlist`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
    ]
  }

  // Dynamic sitemap with database data when DATABASE_URL is available
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
}
