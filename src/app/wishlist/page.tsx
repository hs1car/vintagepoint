'use client'

import { useState, useEffect } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Phone, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Car {
  id: string
  model: string
  year: number
  condition: string
  price: number | null
  images: string
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { t, isRTL } = useLanguage()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWishlistCars() {
      if (wishlist.length === 0) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/cars')
        if (res.ok) {
          const allCars = await res.json()
          const wishlistCars = allCars.filter((car: Car) => wishlist.includes(car.id))
          setCars(wishlistCars)
        }
      } catch (error) {
        console.error('Error fetching wishlist cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlistCars()
  }, [wishlist])

  const parseImages = (imagesString: string) => {
    try {
      return JSON.parse(imagesString)
    } catch {
      return []
    }
  }

  const getWhatsAppLink = (car: Car) => {
    const message = `${isRTL ? 'مرحباً، أنا مهتم بـ' : 'Hello, I am interested in'} ${car.model} ${car.year}`
    return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-500 mb-4">
            {isRTL ? 'قائمة المفضلة' : 'My Wishlist'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? `${wishlist.length} ${wishlist.length === 1 ? 'سيارة' : 'سيارات'} في المفضلة`
              : `${wishlist.length} ${wishlist.length === 1 ? 'car' : 'cars'} in wishlist`
            }
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gold-500/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isRTL 
                ? 'ابدأ بإضافة السيارات التي تحبها إلى قائمة المفضلة'
                : 'Start adding cars you love to your wishlist'
              }
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500">
                {isRTL ? 'تصفح السيارات' : 'Browse Cars'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => {
              const carImages = parseImages(car.images)
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-gold-500/40 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur overflow-hidden hover:border-gold-500/70 hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] transition-all duration-400">
                    <div className="relative">
                      <div className="aspect-video overflow-hidden bg-black">
                        {carImages.length > 0 ? (
                          <img
                            src={carImages[0]}
                            alt={car.model}
                            className="w-full h-full object-contain p-4"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromWishlist(car.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-xl font-bold text-gold-400 mb-2">{car.model}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">{isRTL ? 'السنة:' : 'Year:'}</span>
                          <span className="font-semibold"> {car.year}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{isRTL ? 'الحالة:' : 'Condition:'}</span>
                          <span className="font-semibold"> {car.condition}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/cars/${car.id}`} className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500">
                            {isRTL ? 'التفاصيل' : 'Details'}
                          </Button>
                        </Link>
                        <a href={getWhatsAppLink(car)} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
