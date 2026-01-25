'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Car, Wrench, Phone, Mail, MapPin, Instagram, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { useLanguage, BilingualText } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useWishlist } from '@/contexts/WishlistContext'

export function Header() {
  const { language, setLanguage, t, isRTL } = useLanguage()
  const { wishlist } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState('/logo.svg')
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const languages = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ur', label: 'اردو' },
  ]

  useEffect(() => {
    // Try to load custom logo from settings API
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.logoUrl && data.logoUrl !== '/logo.svg') {
            setLogoUrl(data.logoUrl)
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  // Auto-hide header on scroll down
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        // Always show at top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsVisible(false)
      } else {
        // Scrolling up - show
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlHeader)
    return () => window.removeEventListener('scroll', controlHeader)
  }, [lastScrollY])

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu first
    setMobileMenuOpen(false)
    
    // If we're on homepage, scroll to section
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If we're on another page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] w-full border-b border-gold-500/30 bg-gradient-to-b from-black/98 to-black/95 backdrop-blur-md shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Single Compact Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-18 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logoUrl ? (
              <div className="h-10 md:h-12 flex items-center">
                <img
                  src={logoUrl}
                  alt="Vintage Point Logo"
                  className="h-full w-auto max-h-12 object-contain"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-600 to-gold-400 text-black font-bold text-base md:text-xl">
                VP
              </div>
            )}
            <div className="hidden sm:flex flex-col">
              <span className="text-base md:text-lg font-bold text-gold-500 leading-tight">فينتج بوينت</span>
              <span className="text-xs md:text-sm font-semibold text-foreground leading-tight">Vintage Point</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <button className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gold-500/10 hover:text-gold-500 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    {t('nav.home')}
                  </button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/buying-guide">
                  <button className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gold-500/10 hover:text-gold-500 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    {isRTL ? 'دليل الشراء' : 'Buying Guide'}
                  </button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={() => scrollToSection('cars')}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gold-500/10 hover:text-gold-500 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  {t('nav.cars')}
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={() => scrollToSection('parts')}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gold-500/10 hover:text-gold-500 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  {t('nav.parts')}
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about">
                  <button className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gold-500/10 hover:text-gold-500 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    {t('nav.about')}
                  </button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Actions - Visible on Mobile */}
            <div className="flex md:hidden items-center gap-1">
              {/* Home */}
              <button
                onClick={() => scrollToSection('home')}
                className="px-2 py-1.5 hover:bg-gold-500/10 rounded-lg transition-colors text-xs font-medium text-gold-400"
                title={isRTL ? 'الرئيسية' : 'Home'}
              >
                {isRTL ? 'الرئيسية' : 'Home'}
              </button>
              {/* About Us */}
              <Link href="/about">
                <button className="px-2 py-1.5 hover:bg-gold-500/10 rounded-lg transition-colors text-xs font-medium text-gold-400">
                  {isRTL ? 'من نحن' : 'About'}
                </button>
              </Link>
              {/* Buying Guide */}
              <Link href="/buying-guide">
                <button className="px-2 py-1.5 hover:bg-gold-500/10 rounded-lg transition-colors text-xs font-medium text-gold-400">
                  {isRTL ? 'دليل الشراء' : 'Guide'}
                </button>
              </Link>
              {/* Phone */}
              <a
                href="tel:+971569141444"
                className="p-2 hover:bg-gold-500/10 rounded-lg transition-colors"
                title="اتصل بنا"
              >
                <Phone className="h-4 w-4 text-gold-500" />
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/vintage_point_1995"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gold-500/10 rounded-lg transition-colors"
                title="Instagram"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
              </a>
              {/* Wishlist */}
              <Link href="/wishlist">
                <button className="p-2 hover:bg-gold-500/10 rounded-lg transition-colors relative">
                  <Heart className="h-4 w-4 text-gold-500" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            {/* Contact & Social - Hidden on mobile, visible on desktop */}
            <div className="hidden xl:flex items-center gap-2 mr-3 text-xs">
              <a
                href="tel:+971569141444"
                className="flex items-center gap-1 hover:text-gold-500 transition-colors text-muted-foreground"
                title="+971 56 914 1444"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
              <a
                href="mailto:vintagepoint1444@gmail.com"
                className="flex items-center gap-1 hover:text-gold-500 transition-colors text-muted-foreground"
                title="vintagepoint1444@gmail.com"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com/vintage_point_1995"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 text-white hover:shadow-[0_0_10px_rgba(236,72,153,0.4)] transition-all"
                title="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Language Switcher - Compact */}
            <div className="hidden md:flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`px-2 py-1 text-xs transition-colors rounded ${
                    language === lang.code
                      ? 'bg-gold-500 text-white'
                      : 'hover:text-gold-500 text-muted-foreground'
                  }`}
                  title={lang.label}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Wishlist & Theme - Desktop only */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5 text-gold-500" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gold-500/10"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link href="/buying-guide">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-2 px-4 rounded-md hover:bg-gold-500/10 hover:text-gold-500 transition-colors"
                >
                  {isRTL ? 'دليل الشراء' : 'Buying Guide'}
                </button>
              </Link>
              <button
                onClick={() => scrollToSection('cars')}
                className="block w-full text-left py-2 px-4 rounded-md hover:bg-gold-500/10 hover:text-gold-500 transition-colors"
              >
                {t('nav.cars')}
              </button>
              <button
                onClick={() => scrollToSection('parts')}
                className="block w-full text-left py-2 px-4 rounded-md hover:bg-gold-500/10 hover:text-gold-500 transition-colors"
              >
                {t('nav.parts')}
              </button>
              
              {/* Mobile Language Switcher */}
              <div className="pt-3 border-t border-gold-500/10">
                <div className="flex flex-wrap gap-2 px-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any)
                        setMobileMenuOpen(false)
                      }}
                      className={`px-3 py-1.5 text-xs transition-colors rounded ${
                        language === lang.code
                          ? 'bg-gold-500 text-white'
                          : 'bg-gold-500/10 hover:bg-gold-500/20'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
