import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vintagepoint.ae'
    
    // Fetch all active cars and parts
    const [cars, parts] = await Promise.all([
      prisma.car.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true }
      }),
      prisma.sparePart.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true }
      })
    ])

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Home Page -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/?lang=en"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/?lang=ar"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/?lang=ru"/>
    <xhtml:link rel="alternate" hreflang="hi" href="${baseUrl}/?lang=hi"/>
    <xhtml:link rel="alternate" hreflang="ur" href="${baseUrl}/?lang=ur"/>
  </url>

  <!-- About Page -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Buying Guide -->
  <url>
    <loc>${baseUrl}/buying-guide</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Wishlist -->
  <url>
    <loc>${baseUrl}/wishlist</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Individual Cars -->
  ${cars.map(car => `
  <url>
    <loc>${baseUrl}/cars/${car.id}</loc>
    <lastmod>${car.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}

  <!-- Individual Parts -->
  ${parts.map(part => `
  <url>
    <loc>${baseUrl}/parts/${part.id}</loc>
    <lastmod>${part.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
