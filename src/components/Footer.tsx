'use client'

import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'

export function Footer() {
  const { t } = useLanguage()
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.logoUrl) {
            setLogoUrl(data.logoUrl)
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <footer className="mt-auto border-t border-gold-500/20 bg-gradient-to-b from-black via-black/95 to-black/90 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <div className="h-20 sm:h-24 flex items-center">
                  <img
                    src={logoUrl}
                    alt="Vintage Point Logo"
                    className="h-full w-auto max-h-24 object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-600 to-gold-400 text-black font-bold text-2xl sm:text-3xl">
                  VP
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-gold-500">فينتج بوينت</span>
                <span className="text-sm sm:text-base text-muted-foreground">Vintage Point L.L.C</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="block mb-1">فينتج بوينت – أفضل سيارات كلاسيك في الإمارات</span>
              <span className="block text-xs">Vintage Point – The Best Classic Cars in the UAE</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gold-500">روابط سريعة | Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#cars"
                  className="text-muted-foreground hover:text-gold-500 transition-colors"
                >
                  {t('nav.cars')}
                </a>
              </li>
              <li>
                <a
                  href="#parts"
                  className="text-muted-foreground hover:text-gold-500 transition-colors"
                >
                  {t('nav.parts')}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-gold-500 transition-colors"
                >
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gold-500">معلومات الاتصال | Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/30">
                  <Phone className="h-5 w-5 text-gold-500" />
                </div>
                <div className="flex flex-col">
                  <a
                    href="tel:+971569141444"
                    className="text-foreground hover:text-gold-500 font-semibold transition-colors"
                    dir="ltr"
                  >
                    +971 56 914 1444
                  </a>
                  <a
                    href="tel:+971564487448"
                    className="text-xs text-muted-foreground/70 hover:text-gold-500 transition-colors"
                    dir="ltr"
                  >
                    +971 56 448 7448
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/30">
                  <Mail className="h-5 w-5 text-gold-500" />
                </div>
                <a
                  href="mailto:vintagepoint1444@gmail.com"
                  className="text-foreground hover:text-gold-500 transition-colors"
                >
                  vintagepoint1444@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/30">
                  <MapPin className="h-5 w-5 text-gold-500" />
                </div>
                <div className="flex flex-col text-muted-foreground">
                  <span>منطقة رأس الخور الصناعية -٢ - دبي</span>
                  <span className="text-xs">Ras Al Khor Industrial Area 2 – Dubai</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gold-500">ساعات العمل | Working Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-500" />
                <div className="flex flex-col">
                  <span>الثلاثاء – الاثنين | Mon - Tue</span>
                  <span className="text-xs">8:30ص – 1م | 3:30 – 9م</span>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-500" />
                <div className="flex flex-col">
                  <span>الخميس – الأربعاء | Wed - Thu</span>
                  <span className="text-xs">8:30ص – 1م | 3:30 – 9م</span>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-500" />
                <div className="flex flex-col">
                  <span>الجمعة: مغلق | Friday: Closed</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 pt-8 border-t border-gold-500/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-black transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-black transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-black transition-all"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} فينتج بوينت ل.ل.ج | Vintage Point L.L.C. جميع الحقوق محفوظة | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
