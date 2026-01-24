import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ImageGallery } from '@/components/ImageGallery'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await db.car.findUnique({
    where: { id: params.id }
  })

  if (!car || !car.isActive) {
    return {
      title: 'Car Not Found | السيارة غير موجودة',
      description: 'The requested car could not be found.',
    }
  }

  return {
    title: `${car.model} ${car.year} - Classic Car for Sale | سيارة كلاسيكية للبيع`,
    description: `${car.description || `Beautiful ${car.model} ${car.year} in ${car.condition} condition.`} - ${car.condition} condition${car.price ? ` - AED ${car.price.toLocaleString()}` : ''} - Vintage Point L.L.C`,
    keywords: [
      car.model,
      car.year.toString(),
      'classic car',
      'vintage car',
      'سيارة كلاسيكية',
      'سيارة نادرة',
      car.condition,
      'Dubai',
      'UAE',
      'دبي',
      'الإمارات',
      'Vintage Point'
    ],
    openGraph: {
      title: `${car.model} ${car.year}`,
      description: `${car.description || `Beautiful ${car.model} ${car.year}`}${car.price ? ` - AED ${car.price.toLocaleString()}` : ''}`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/cars/${car.id}`,
      siteName: 'Vintage Point L.L.C - Classic Car Dealership',
      locale: 'ar_AE',
      type: 'website',
      images: car.images ? JSON.parse(car.images).slice(0, 1) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${car.model} ${car.year}`,
      description: `${car.description || `Beautiful ${car.model} ${car.year}`}${car.price ? ` - AED ${car.price.toLocaleString()}` : ''}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/cars/${car.id}`,
    },
  }
}

export default async function CarPage({ params }: PageProps) {
  const car = await db.car.findUnique({
    where: { id: params.id }
  })

  if (!car || !car.isActive) {
    notFound()
  }

  const parseImages = (images: string): string[] => {
    if (!images) return []
    try {
      return JSON.parse(images)
    } catch {
      return images.split(',').map(img => img.trim()).filter(Boolean)
    }
  }

  const images = parseImages(car.images)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="border-b border-gold-500/20 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <a href="/" className="hover:text-gold-500">الرئيسية | Home</a>
            </li>
            <li>/</li>
            <li>
              <a href="/#cars" className="hover:text-gold-500">السيارات | Cars</a>
            </li>
            <li>/</li>
            <li className="text-gold-400">{car.model}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-background to-black/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images Gallery */}
            <div className="space-y-4">
              {images.length > 0 ? (
                <ImageGallery images={images} alt={`${car.model} ${car.year}`} />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center rounded-xl">
                  <span className="text-muted-foreground">No Images Available</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="mb-2 text-3xl md:text-4xl font-bold text-gold-400">
                  <span className="block">{car.model}</span>
                </h1>
                <p className="text-muted-foreground">
                  سنة الصنع: <span className="text-foreground font-semibold">{car.year}</span>
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border border-gold-500/20 bg-card/50">
                  <p className="mb-1 text-sm text-muted-foreground">الحالة | Condition</p>
                  <p className="text-lg font-semibold text-foreground">{car.condition}</p>
                </div>
                <div className="p-4 rounded-lg border border-gold-500/20 bg-card/50">
                  <p className="mb-1 text-sm text-muted-foreground">السعر | Price</p>
                  <p className="text-lg font-bold text-gold-500">
                    {car.price ? `AED ${car.price.toLocaleString()}` : 'اتصل للاستفسار | Contact for Price'}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-gold-500/20 bg-card/50">
                  <p className="mb-1 text-sm text-muted-foreground">الحالة | Status</p>
                  <p className="text-lg font-semibold text-green-500">متوفر | Available</p>
                </div>
              </div>

              {car.description && (
                <div className="p-6 rounded-lg border border-gold-500/20 bg-card/50">
                  <h2 className="mb-3 text-xl font-bold text-gold-400">الوصف | Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>
              )}

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971569141444'}?text=${encodeURIComponent(
                  `مرحباً، أنا مهتم بسيارة ${car.model} سنة ${car.year}\n\nHello, I am interested in the ${car.model} ${car.year}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-green-500 px-8 py-4 text-base font-semibold text-black hover:bg-green-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-2.033l-7.5-4.361c-2.316-1.336-4.816-1.336-7.132 0-2.32.998-5.283 2.556-6.553l.603-2.073c.253-.853.38-1.786.38-2.642 0-1.836-1.332-3.554-1.57-5.367l-1.994 1.913-1.324 2.858-1.29-3.568-3.758-1.648-6.018 3.838-6.018 7.377V15c0-4.142-2.358-7.5-5.5-7.5s-7.5 3.358-7.5 7.5v3.042c0 2.32.998 5.283-2.556 6.553l-.603 2.073c-.253.853-.38 1.786-.38 2.642 0 1.836 1.332 3.554 1.57 5.367l1.994-1.913 1.324-2.858 1.29-3.568-3.758-1.648-6.018 3.838-6.018 7.377z"/>
                </svg>
                <span>تواصل عبر واتساب | Contact via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-black/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-center text-gold-400">
            لماذا تختار فينتج بوينت؟ | Why Choose Vintage Point?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/20 mx-auto text-gold-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2l-2-2-4 4m6-2l2 2-4-4" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">سيارات أصلية | Authentic Cars</h3>
              <p className="text-sm text-muted-foreground">نضمن أصالة كل سيارة في مجموعتنا</p>
            </div>
            <div className="text-center p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/20 mx-auto text-gold-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2l-2-2-4 4m6-2l2 2-4-4" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">فحص شامل | Full Inspection</h3>
              <p className="text-sm text-muted-foreground">كل سيارة تخضع لفحص شامل قبل العرض</p>
            </div>
            <div className="text-center p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/20 mx-auto text-gold-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0 9 9 0 01-18 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">دعم متميز | Premium Support</h3>
              <p className="text-sm text-muted-foreground">دعم فني واستشارات متخصصة للسيارات الكلاسيكية</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
