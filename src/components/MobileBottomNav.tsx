'use client'

import { useState, useEffect } from 'react'
import { Home, Car, Wrench, Heart, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useWishlist } from '@/contexts/WishlistContext'
import { useLanguage } from '@/contexts/LanguageContext'

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { wishlist } = useWishlist()
  const { isRTL } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    {
      icon: Home,
      label: isRTL ? 'الرئيسية' : 'Home',
      path: '/',
      active: pathname === '/'
    },
    {
      icon: Car,
      label: isRTL ? 'السيارات' : 'Cars',
      path: '/#cars',
      active: pathname?.includes('/cars')
    },
    {
      icon: Wrench,
      label: isRTL ? 'قطع الغيار' : 'Parts',
      path: '/#parts',
      active: pathname?.includes('/parts')
    },
    {
      icon: Heart,
      label: isRTL ? 'المفضلة' : 'Wishlist',
      path: '/wishlist',
      active: pathname === '/wishlist',
      badge: wishlist.length
    },
    {
      icon: Menu,
      label: isRTL ? 'القائمة' : 'Menu',
      path: '/about',
      active: pathname === '/about' || pathname === '/buying-guide'
    }
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="relative">
            {/* Glass effect background */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-xl border-t border-border/50 shadow-2xl"></div>
            
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

            {/* Nav items */}
            <div className="relative flex items-center justify-around px-2 py-2 safe-bottom">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = item.active

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (item.path.includes('#')) {
                        const section = item.path.split('#')[1]
                        if (pathname !== '/') {
                          router.push('/')
                          setTimeout(() => {
                            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
                          }, 500)
                        } else {
                          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
                        }
                      } else {
                        router.push(item.path)
                      }
                    }}
                    className="relative flex flex-col items-center justify-center gap-1 min-w-[60px] py-2 px-3 rounded-xl transition-all duration-300"
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="mobileActiveTab"
                        className="absolute inset-0 bg-gradient-to-b from-gold-500/20 to-gold-600/10 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Icon with badge */}
                    <div className="relative">
                      <Icon 
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive 
                            ? 'text-gold-600 scale-110' 
                            : 'text-muted-foreground'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      
                      {item.badge && item.badge > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full"
                        >
                          {item.badge > 9 ? '9+' : item.badge}
                        </motion.div>
                      )}
                    </div>

                    {/* Label */}
                    <span 
                      className={`text-[10px] font-medium transition-all duration-300 ${
                        isActive 
                          ? 'text-gold-600' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="mobileActiveDot"
                        className="absolute -bottom-1 w-1 h-1 bg-gold-600 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
