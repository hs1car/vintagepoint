'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Phone, Mail, MapPin, Clock, Car, Wrench, X, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { WishlistButton } from '@/components/WishlistButton'
import CarSkeleton from '@/components/CarSkeleton'
import { toast } from 'sonner'

interface Car {
  id: string
  model: string
  year: number
  condition: string
  price: number
  description: string
  images: string
  isActive: boolean
}

interface SparePart {
  id: string
  name: string
  description: string
  price: number
  images: string
  isActive: boolean
}

export default function Home() {
  const { t, isRTL } = useLanguage()
  const [cars, setCars] = useState<Car[]>([])
  const [parts, setParts] = useState<SparePart[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null)
  const [selectedCarImageIndex, setSelectedCarImageIndex] = useState<{ [key: string]: number }>({})
  const [expandedCarDetails, setExpandedCarDetails] = useState<{ [key: string]: boolean }>({})
  const [selectedPartImageIndex, setSelectedPartImageIndex] = useState<{ [key: string]: number }>({})
  const [expandedPartDetails, setExpandedPartDetails] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Track page view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/' })
    }).catch(() => {})

    async function fetchData() {
      try {
        const [carsRes, partsRes] = await Promise.all([
          fetch('/api/cars'),
          fetch('/api/parts')
        ])

        if (carsRes.ok) {
          const carsData = await carsRes.json()
          setCars(carsData.filter((car: Car) => car.isActive))
        }

        if (partsRes.ok) {
          const partsData = await partsRes.json()
          setParts(partsData.filter((part: SparePart) => part.isActive))
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const parseImages = (images: string): string[] => {
    if (!images) return []
    try {
      return JSON.parse(images)
    } catch {
      return images.split(',').map(img => img.trim()).filter(Boolean)
    }
  }

  const getWhatsAppLink = (car: Car) => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971569141444'
    const message = encodeURIComponent(
      'مرحباً، أنا مهتم بسيارة ' + car.model + ' سنة ' + car.year + '\n\nHello, I am interested in the ' + car.model + ' ' + car.year
    )
    return 'https://wa.me/' + phoneNumber + '?text=' + message
  }

  const getWhatsAppLinkPart = (part: SparePart) => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971569141444'
    const message = encodeURIComponent(
      'مرحباً، أنا مهتم بقطعة الغيار: ' + part.name + '\n\nHello, I am interested in the spare part: ' + part.name
    )
    return 'https://wa.me/' + phoneNumber + '?text=' + message
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - متجاوب مع جميع الأجهزة */}
      <section id="home" className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background - Responsive & Optimized */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%23000000' width='1920' height='1080'/%3E%3C/svg%3E"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              objectPosition: 'center center',
              minHeight: '100%',
              minWidth: '100%',
            }}
          >
            <source 
              src="/hero-video.mp4" 
              type="video/mp4"
            />
            {/* Fallback text for browsers that don't support video */}
            <div className="w-full h-full bg-black" />
          </video>
          {/* Dark Overlay - للتحكم بإضاءة الفيديو */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Decorative Elements - متجاوب مع حجم الشاشة */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gold decorative lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

          {/* Corner decorations - أصغر على الموبايل */}
          <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-10 h-10 sm:w-16 sm:h-16 border-l-2 border-t-2 border-gold-500/30 rounded-tl-3xl" />
          <div className="absolute top-4 sm:top-10 right-4 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 border-r-2 border-t-2 border-gold-500/30 rounded-tr-3xl" />
          <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-10 w-10 h-10 sm:w-16 sm:h-16 border-l-2 border-b-2 border-gold-500/30 rounded-bl-3xl" />
          <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 border-r-2 border-b-2 border-gold-500/30 rounded-br-3xl" />
        </div>

        {/* Hero Content - محسن للموبايل والتابلت */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center"
        >
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <p className="text-[#FFD700] mb-2 drop-shadow-[0_0_30px_rgba(0,0,0,1)] [text-shadow:_0_0_15px_rgb(0_0_0),_0_0_30px_rgb(0_0_0),_0_4px_40px_rgb(0_0_0),_2px_2px_4px_rgb(0_0_0),_-2px_-2px_4px_rgb(0_0_0)] [-webkit-text-stroke:1px_rgba(0,0,0,0.3)]">{t('hero.titleAr')}</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#FFFAF0] drop-shadow-[0_0_30px_rgba(0,0,0,1)] [text-shadow:_0_0_15px_rgb(0_0_0),_0_0_30px_rgb(0_0_0),_0_4px_40px_rgb(0_0_0),_2px_2px_4px_rgb(0_0_0),_-2px_-2px_4px_rgb(0_0_0)] [-webkit-text-stroke:0.5px_rgba(0,0,0,0.4)]">{t('hero.titleEn')}</p>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-[#F5F5DC] max-w-2xl mx-auto px-2 bg-black/60 backdrop-blur-md py-4 px-6 rounded-2xl border border-gold-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
          >
            <span className="block drop-shadow-[0_0_20px_rgba(0,0,0,1)] [text-shadow:_0_2px_10px_rgb(0_0_0),_0_4px_20px_rgb(0_0_0),_1px_1px_3px_rgb(0_0_0)] font-semibold">اكتشف مجموعتنا المختارة بعناية من السيارات الكلاسيكية النادرة</span>
            <span className="block text-xs sm:text-sm text-[#E8E8E8] drop-shadow-[0_0_15px_rgba(0,0,0,1)] [text-shadow:_0_2px_8px_rgb(0_0_0),_0_3px_15px_rgb(0_0_0),_1px_1px_2px_rgb(0_0_0)] mt-1">Discover our carefully curated collection of rare classic cars</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center px-4"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth' })}
              className="
                relative overflow-hidden
                bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600
                hover:from-gold-500 hover:via-gold-400 hover:to-gold-500
                active:scale-95
                text-black font-bold 
                text-base sm:text-lg md:text-xl
                px-8 sm:px-12 py-4 sm:py-5 
                rounded-xl
                shadow-[0_4px_20px_-5px_rgba(234,179,8,0.4)]
                hover:shadow-[0_8px_30px_-5px_rgba(234,179,8,0.5)]
                hover:-translate-y-1
                transition-all duration-300
                border border-gold-400/50
                w-full max-w-xs sm:max-w-none sm:w-auto
              "
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>{t('hero.cta')}</span>
                <ArrowRight className={`${isRTL ? 'rotate-180' : ''} h-4 w-4 sm:h-5 sm:w-5`} />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Classic Cars Section */}
      <section id="cars" className="py-20 bg-gradient-to-b from-background to-black/30 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-gold-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="relative inline-block">
              <h2 className="mb-4 relative text-4xl md:text-5xl font-bold text-gold-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                {t('cars.title')}
              </h2>
              {/* Decorative glow */}
              <div className="absolute -inset-4 -z-10 bg-gold-500/10 blur-2xl" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('cars.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CarSkeleton key={i} />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">{t('cars.noCars')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car, index) => {
                const carImages = parseImages(car.images)
                const currentImageIndex = selectedCarImageIndex[car.id] || 0
                const currentImage = carImages[currentImageIndex] || carImages[0]
                const isExpanded = expandedCarDetails[car.id] || false
                
                return (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-gold-500/40 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur overflow-hidden hover:border-gold-500/70 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)] transition-all duration-500 rounded-lg">
                      
                      {!isExpanded ? (
                        /* Collapsed State - Image + Model Name + Expand Button */
                        <div>
                          {/* Preview Image */}
                          <div 
                            className="relative w-full bg-black overflow-hidden cursor-pointer group"
                            onClick={() => setExpandedCarDetails({ ...expandedCarDetails, [car.id]: true })}
                            style={{ minHeight: '200px', maxHeight: '200px' }}
                          >
                            {carImages.length > 0 ? (
                              <>
                                <div className="absolute inset-0 flex items-center justify-center p-3">
                                  <div className="relative w-full h-full max-w-[300px] max-h-[200px]">
                                    <img
                                      src={carImages[0]}
                                      alt={car.model}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </div>
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                                  <div className="text-center">
                                    <Eye className="h-10 w-10 text-white drop-shadow-lg mx-auto mb-2" />
                                    <p className="text-white text-sm font-semibold">اضغط للتفاصيل</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Car className="h-16 w-16 text-muted-foreground/50" />
                              </div>
                            )}
                            {/* Wishlist Button */}
                            <div className="absolute top-2 right-2 z-20">
                              <WishlistButton carId={car.id} variant="icon" />
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h3 className="mb-3 text-lg font-bold text-gold-400 text-center">
                              <span className="block drop-shadow-[0_2px_4px_rgba(234,179,8,0.3)]">{car.model}</span>
                            </h3>
                            <Button
                              onClick={() => setExpandedCarDetails({ ...expandedCarDetails, [car.id]: true })}
                              size="sm"
                              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-amber-600/80 to-amber-700/80 text-white font-semibold hover:from-amber-500 hover:to-amber-600 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all duration-300 border border-amber-500/30"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                              <span className="drop-shadow-sm">تفاصيل</span>
                            </Button>
                          </CardContent>
                        </div>
                      ) : (
                        /* Expanded State - Full Card Content */
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Close Button at Top */}
                          <div className="p-3 border-b border-gold-500/20 bg-gradient-to-r from-amber-950/40 to-amber-900/30">
                            <button
                              onClick={() => {
                                setExpandedCarDetails({ ...expandedCarDetails, [car.id]: false })
                                setSelectedCarImageIndex({ ...selectedCarImageIndex, [car.id]: 0 })
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-amber-800/30 to-amber-700/30 hover:from-amber-700/40 hover:to-amber-600/40 border border-amber-600/40 hover:border-amber-500/60 transition-all text-amber-200 hover:text-amber-100 font-medium text-sm backdrop-blur-sm"
                            >
                              <ChevronUp className="h-4 w-4" />
                              <span>إغلاق</span>
                            </button>
                          </div>

                          {/* Main Image Section */}
                          <div 
                            className="relative w-full bg-black cursor-pointer group overflow-hidden"
                            onClick={() => setSelectedCar(car)}
                            style={{ minHeight: '180px', maxHeight: '180px' }}
                          >
                            {carImages.length > 0 ? (
                              <>
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                  <div className="relative w-full h-full max-w-[300px] max-h-[180px]">
                                    <img
                                      src={currentImage}
                                      alt={`${car.model} - Image ${currentImageIndex + 1}`}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </div>
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                                  <Eye className="h-12 w-12 text-white drop-shadow-lg" />
                                </div>
                                {/* Image Counter */}
                                {carImages.length > 1 && (
                                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium z-20">
                                    {currentImageIndex + 1} / {carImages.length}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Car className="h-16 w-16 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>

                          {/* Thumbnail Row */}
                          {carImages.length > 1 && (
                            <div className="px-2 py-2 bg-black/20 overflow-x-auto">
                              <div className="flex gap-1.5 min-w-max">
                                {carImages.map((img, imgIndex) => (
                                  <button
                                    key={imgIndex}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedCarImageIndex({ ...selectedCarImageIndex, [car.id]: imgIndex })
                                    }}
                                    className={`relative flex-shrink-0 w-[50px] h-[38px] rounded border-2 overflow-hidden transition-all ${
                                      currentImageIndex === imgIndex 
                                        ? 'border-gold-500 ring-2 ring-gold-500/50' 
                                        : 'border-gold-500/30 hover:border-gold-500/60'
                                    }`}
                                  >
                                    <img
                                      src={img}
                                      alt={`${car.model} thumbnail ${imgIndex + 1}`}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-full object-cover car-image-hover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Car Details */}
                          <CardContent className="p-3 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                            <h3 className="mb-2 text-base font-bold text-gold-400 relative z-10">
                              <span className="block drop-shadow-[0_2px_4px_rgba(234,179,8,0.3)]">{car.model}</span>
                            </h3>
                            <div className="mb-2 grid grid-cols-2 gap-3 text-sm relative z-10">
                              <div className="bg-gold-500/10 rounded-lg px-3 py-2 border border-gold-500/20">
                                <span className="text-muted-foreground block text-xs">{t('common.year')}</span>
                                <span className="font-semibold text-gold-500">{car.year}</span>
                              </div>
                              <div className="bg-gold-500/10 rounded-lg px-3 py-2 border border-gold-500/20">
                                <span className="text-muted-foreground block text-xs">{t('common.condition')}</span>
                                <span className="font-semibold text-gold-500">{car.condition}</span>
                              </div>
                            </div>
                            {car.description && (
                              <p className="mb-3 text-sm text-muted-foreground relative z-10 leading-relaxed">
                                {car.description}
                              </p>
                            )}
                            <div className="relative mb-2">
                              <a
                                href={getWhatsAppLink(car)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-lg bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/40 hover:from-green-600/30 hover:via-green-500/40 hover:to-green-600/30 transition-all duration-300 group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <p className="relative z-10 py-2 text-base font-semibold text-green-400 text-center group-hover:text-green-300 flex items-center justify-center gap-2">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                  </svg>
                                  {isRTL ? 'انقر للاستعلام واتساب' : 'Click to Inquire via WhatsApp'}
                                </p>
                              </a>
                            </div>
                            <div className="relative z-10">
                              <a
                                href={getWhatsAppLink(car)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-bold text-white hover:from-green-400 hover:to-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border border-green-400/50 shadow-lg"
                              >
                                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                <span className="drop-shadow-sm">{t('cars.whatsapp')}</span>
                              </a>
                            </div>
                          </CardContent>
                          
                          {/* Sticky Close Button at Bottom */}
                          <div className="sticky bottom-0 p-3 border-t border-gold-500/20 bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.3)] z-20">
                            <button
                              onClick={() => {
                                setExpandedCarDetails({ ...expandedCarDetails, [car.id]: false })
                                setSelectedCarImageIndex({ ...selectedCarImageIndex, [car.id]: 0 })
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-700/60 to-amber-600/60 hover:from-amber-600/70 hover:to-amber-500/70 border border-amber-500/50 hover:border-amber-400/70 transition-all text-amber-100 hover:text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
                            >
                              <X className="h-4 w-4" />
                              <span>إغلاق الكارت</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Spare Parts Section */}
      <section id="parts" className="py-20 bg-black/30 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="relative inline-block">
              <h2 className="mb-4 relative text-4xl md:text-5xl font-bold text-gold-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                {t('parts.title')}
              </h2>
              {/* Decorative glow */}
              <div className="absolute -inset-4 -z-10 bg-gold-500/10 blur-2xl" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('parts.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-g-gold-500/20 bg-card/50 backdrop-blur overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-4">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : parts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">{t('parts.noParts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {parts.map((part, index) => {
                const partImages = parseImages(part.images)
                const isExpanded = expandedPartDetails[part.id]
                
                return (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-gold-500/40 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur overflow-hidden hover:border-gold-500/70 hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:shadow-[0_10px_30px_-5px_rgba(234,179,8,0.4)] transition-all duration-400">
                      {!isExpanded ? (
                        // Collapsed State: Preview Image + Name + Expand Button
                        <div 
                          className="group cursor-pointer"
                          onClick={() => setExpandedPartDetails(prev => ({ ...prev, [part.id]: true }))}
                        >
                          {/* Preview Image */}
                          <div className="relative h-[200px] overflow-hidden bg-black">
                            {partImages.length > 0 ? (
                              <img
                                src={partImages[0]}
                                alt={part.name}
                                className="w-full h-full object-contain max-w-[300px] max-h-[200px] mx-auto"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Wrench className="h-16 w-16 text-gold-500/40" />
                              </div>
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="text-center">
                                <Eye className="h-12 w-12 text-gold-500 mx-auto mb-2" />
                                <p className="text-white font-semibold text-sm">اضغط للتفاصيل</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Part Name & Expand Button */}
                          <CardContent className="p-4 text-center">
                            <h3 className="text-lg font-bold text-gold-400 mb-3 line-clamp-2">
                              {part.name}
                            </h3>
                            <Button
                              size="sm"
                              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-amber-600/80 to-amber-700/80 text-white font-semibold hover:from-amber-500 hover:to-amber-600 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-all duration-300 border border-amber-500/30"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                              <span className="drop-shadow-sm">تفاصيل</span>
                            </Button>
                          </CardContent>
                        </div>
                      ) : (
                        // Expanded State: Full Details with Image Gallery
                        <div>
                          {/* Close Button at Top */}
                          <div className="p-3 border-b border-gold-500/20 bg-gradient-to-r from-amber-950/40 to-amber-900/30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedPartDetails(prev => ({ ...prev, [part.id]: false }))
                                setSelectedPartImageIndex(prev => ({ ...prev, [part.id]: 0 }))
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-amber-800/30 to-amber-700/30 hover:from-amber-700/40 hover:to-amber-600/40 border border-amber-600/40 hover:border-amber-500/60 transition-all text-amber-200 hover:text-amber-100 font-medium text-sm backdrop-blur-sm"
                            >
                              <ChevronUp className="h-4 w-4" />
                              <span>إغلاق</span>
                            </button>
                          </div>

                          {/* Main Image Display */}
                          <div className="relative h-[180px] overflow-hidden bg-black mb-2">
                            {partImages.length > 0 ? (
                              <img
                                src={partImages[selectedPartImageIndex[part.id] || 0]}
                                alt={`${part.name} - ${(selectedPartImageIndex[part.id] || 0) + 1}`}
                                className="w-full h-full object-contain p-2"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Wrench className="h-16 w-16 text-gold-500/40" />
                              </div>
                            )}
                            {/* Image Counter */}
                            {partImages.length > 1 && (
                              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {(selectedPartImageIndex[part.id] || 0) + 1} / {partImages.length}
                              </div>
                            )}
                          </div>

                          {/* Thumbnail Row */}
                          {partImages.length > 1 && (
                            <div className="px-2 mb-2">
                              <div className="flex gap-1.5 overflow-x-auto pb-1">
                                {partImages.map((img, imgIndex) => (
                                  <button
                                    key={imgIndex}
                                    onClick={() => setSelectedPartImageIndex(prev => ({ ...prev, [part.id]: imgIndex }))}
                                    className={`relative flex-shrink-0 w-[50px] h-[38px] rounded overflow-hidden border-2 transition-all ${
                                      (selectedPartImageIndex[part.id] || 0) === imgIndex
                                        ? 'border-gold-500 scale-110'
                                        : 'border-transparent hover:border-gold-500/50'
                                    }`}
                                  >
                                    <img
                                      src={img}
                                      alt={`Thumbnail ${imgIndex + 1}`}
                                      className="w-full h-full object-cover car-image-hover"
                                      loading="lazy"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Part Details */}
                          <CardContent className="p-3 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                            <h3 className="mb-2 text-base font-bold text-gold-400 relative z-10 line-clamp-2 drop-shadow-[0_1px_2px_rgba(234,179,8,0.2)]">
                              {part.name}
                            </h3>
                            {part.description && (
                              <p className="mb-3 text-sm text-muted-foreground line-clamp-2 relative z-10">
                                {part.description}
                              </p>
                            )}
                            <div className="relative mb-3 overflow-hidden rounded-lg bg-gradient-to-r from-gold-600/20 via-gold-500/30 to-gold-600/20 border border-gold-500/40">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                              <p className="relative z-10 py-2 text-xl font-bold text-gold-500 text-center">
                                AED {part.price.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <a
                                href={getWhatsAppLinkPart(part)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 via-green-500 to-green-600 px-6 py-4 text-base font-bold text-white hover:from-green-500 hover:to-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border border-green-400/50 shadow-xl"
                              >
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                <span className="drop-shadow-sm">{t('parts.whatsappContact')}</span>
                              </a>
                            </div>
                          </CardContent>
                          
                          {/* Sticky Close Button at Bottom */}
                          <div className="sticky bottom-0 p-3 border-t border-gold-500/20 bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.3)] z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedPartDetails(prev => ({ ...prev, [part.id]: false }))
                                setSelectedPartImageIndex(prev => ({ ...prev, [part.id]: 0 }))
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-700/60 to-amber-600/60 hover:from-amber-600/70 hover:to-amber-500/70 border border-amber-500/50 hover:border-amber-400/70 transition-all text-amber-100 hover:text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
                            >
                              <X className="h-4 w-4" />
                              <span>إغلاق الكارت</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Spare Part Details Modal */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedPart(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl lg:max-w-3xl my-4 sm:my-8 bg-gradient-to-br from-card to-card/90 border-2 border-gold-500/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPart(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-black/80 hover:bg-black/90 text-white transition-all"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Image Gallery */}
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {parseImages(selectedPart.images).map((img, i) => (
                      <CarouselItem key={i}>
                        <div className="relative bg-black overflow-hidden aspect-[4/3] sm:aspect-[3/2] lg:aspect-video">
                          <img
                            src={img}
                            alt={`${selectedPart.name} - ${i + 1}`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs sm:text-sm font-medium z-10">
                            {i + 1} / {parseImages(selectedPart.images).length}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {parseImages(selectedPart.images).length > 1 && (
                    <>
                      <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-black/80 border-gold-500/50 hover:bg-gold-500 hover:text-black" />
                      <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-black/80 border-gold-500/50 hover:bg-gold-500 hover:text-black" />
                    </>
                  )}
                </Carousel>
              </div>

              {/* Part Details */}
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gold-400 mb-4 sm:mb-6">{selectedPart.name}</h2>
                
                <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gold-500/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-gold-500/20">
                    <span className="text-muted-foreground block text-xs sm:text-sm">{t('common.price')}</span>
                    <span className="font-bold text-gold-500 text-base sm:text-lg">
                      AED {selectedPart.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedPart.description && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gold-400 mb-2 sm:mb-3">{t('common.description')}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">{selectedPart.description}</p>
                  </div>
                )}

                {/* WhatsApp Button */}
                <a
                  href={getWhatsAppLinkPart(selectedPart)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white hover:from-green-400 hover:to-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t('parts.whatsappContact')}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Car Details Modal */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedCar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl lg:max-w-3xl my-4 sm:my-8 bg-gradient-to-br from-card to-card/90 border-2 border-gold-500/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCar(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-black/80 hover:bg-black/90 text-white transition-all"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Image Gallery */}
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {parseImages(selectedCar.images).map((img, i) => (
                      <CarouselItem key={i}>
                        <div className="relative bg-black overflow-hidden aspect-[4/3] sm:aspect-[3/2] lg:aspect-video">
                          <img
                            src={img}
                            alt={`${selectedCar.model} - ${i + 1}`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs sm:text-sm font-medium z-10">
                            {i + 1} / {parseImages(selectedCar.images).length}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {parseImages(selectedCar.images).length > 1 && (
                    <>
                      <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10 bg-black/80 border-gold-500/50 hover:bg-gold-500 hover:text-black" />
                      <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-black/80 border-gold-500/50 hover:bg-gold-500 hover:text-black" />
                    </>
                  )}
                </Carousel>
              </div>

              {/* Car Details */}
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gold-400 mb-4 sm:mb-6">{selectedCar.model}</h2>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-gold-500/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-gold-500/20">
                    <span className="text-muted-foreground block text-xs sm:text-sm">{t('common.year')}</span>
                    <span className="font-bold text-gold-500 text-base sm:text-lg">{selectedCar.year}</span>
                  </div>
                  <div className="bg-gold-500/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-gold-500/20">
                    <span className="text-muted-foreground block text-xs sm:text-sm">{t('common.condition')}</span>
                    <span className="font-bold text-gold-500 text-base sm:text-lg">{selectedCar.condition}</span>
                  </div>
                  <div className="bg-gold-500/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-gold-500/20 col-span-2 lg:col-span-1">
                    <span className="text-muted-foreground block text-xs sm:text-sm">{t('common.price')}</span>
                    <span className="font-bold text-gold-500 text-base sm:text-lg">
                      {selectedCar.price ? `AED ${selectedCar.price.toLocaleString()}` : t('cars.contactForPrice')}
                    </span>
                  </div>
                </div>

                {selectedCar.description && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gold-400 mb-2 sm:mb-3">{t('common.description')}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">{selectedCar.description}</p>
                  </div>
                )}

                {/* WhatsApp Button */}
                <a
                  href={getWhatsAppLink(selectedCar)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white hover:from-green-400 hover:to-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t('cars.whatsappContact')}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
