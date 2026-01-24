import { db } from '@/lib/db'

export default async function sitemap() {
  const cars = await db.car.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true }
  })

  const parts = await db.sparePart.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true }
  })

  const baseUrl = 'https://vintagepoint.ae'

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
