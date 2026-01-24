'use client'

import { motion } from 'framer-motion'
import { Star, Calendar, Gauge, Phone } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from './ui/button'

interface FeaturedCarProps {
  car: {
    id: string
    model: string
    year: number
    condition: string
    description: string | null
    images: string
  }
}

export function FeaturedCar({ car }: FeaturedCarProps) {
  const { isRTL } = useLanguage()
  
  const parseImages = (images: string): string[] => {
    try {
      return JSON.parse(images)
    } catch {
      return []
    }
  }

  const images = parseImages(car.images)
  const mainImage = images[0] || '/placeholder.jpg'

  return (
    <section className="py-16 bg-gradient-to-b from-black via-gold-950/10 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-6 py-2 mb-4">
            <Star className="h-5 w-5 text-gold-500 fill-gold-500" />
            <span className="text-gold-400 font-bold">
              {isRTL ? 'سيارة الأسبوع' : 'Car of the Week'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4">
            {car.model}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'اكتشف اختيارنا المميز لهذا الأسبوع من أروع السيارات الكلاسيكية'
              : 'Discover our featured selection of the week - an extraordinary classic car'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-gold-500/30 bg-black">
              <img
                src={mainImage}
                alt={`${car.model} ${car.year}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card/50 border border-gold-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-gold-500 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'سنة الصنع' : 'Year'}
                </p>
                <p className="text-xl font-bold text-foreground">{car.year}</p>
              </div>
              <div className="p-4 bg-card/50 border border-gold-500/20 rounded-lg">
                <Gauge className="h-6 w-6 text-gold-500 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  {isRTL ? 'الحالة' : 'Condition'}
                </p>
                <p className="text-xl font-bold text-foreground">{car.condition}</p>
              </div>
            </div>

            {car.description && (
              <div className="p-6 bg-card/30 border border-gold-500/10 rounded-lg">
                <p className="text-muted-foreground leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/cars/${car.id}`} className="flex-1">
                <Button className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold">
                  {isRTL ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </Link>
              <a
                href={`https://wa.me/971569141444?text=${encodeURIComponent(
                  `مرحباً، أنا مهتم بسيارة ${car.model} ${car.year}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full border-gold-500/50 hover:bg-gold-500/10">
                  <Phone className="h-5 w-5 mr-2" />
                  {isRTL ? 'استفسر الآن' : 'Inquire Now'}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
