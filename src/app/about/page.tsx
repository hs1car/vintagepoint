'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
import { Car, Shield, Clock, DollarSign, Eye, Target, Award, Users, Phone, MapPin, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  const { t, isRTL } = useLanguage()

  const phoneNumber = '+971569141444'
  const instagramUrl = 'https://www.instagram.com/vintagepoint_llc'
  const whatsappUrl = `https://wa.me/${phoneNumber}`

  const reasons = [
    {
      icon: Car,
      title: t('about.reason1Title'),
      description: t('about.reason1Desc'),
    },
    {
      icon: Shield,
      title: t('about.reason2Title'),
      description: t('about.reason2Desc'),
    },
    {
      icon: Clock,
      title: t('about.reason3Title'),
      description: t('about.reason3Desc'),
    },
    {
      icon: DollarSign,
      title: t('about.reason4Title'),
      description: t('about.reason4Desc'),
    },
  ]

  const values = [
    {
      icon: Award,
      title: t('about.value1Title'),
      description: t('about.value1Desc'),
    },
    {
      icon: Shield,
      title: t('about.value2Title'),
      description: t('about.value2Desc'),
    },
    {
      icon: Users,
      title: t('about.value3Title'),
      description: t('about.value3Desc'),
    },
    {
      icon: Target,
      title: t('about.value4Title'),
      description: t('about.value4Desc'),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black pt-32 sm:pt-36 md:pt-40 pb-12 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight">
            {t('about.title')}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
            <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-transparent to-gold-500 rounded-full" />
            <Car className="w-6 h-6 md:w-8 md:h-8 text-gold-500" />
            <div className="h-1 w-12 md:w-20 bg-gradient-to-l from-transparent to-gold-500 rounded-full" />
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {t('about.welcome')}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 md:mb-16 lg:mb-20"
        >
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gold-500/30 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl backdrop-blur-sm">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-7 md:leading-8 lg:leading-9">
              {t('about.intro')}
            </p>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-8 md:mb-12">
            {t('about.whyChooseTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gold-500/20 rounded-xl p-5 sm:p-6 md:p-8 hover:border-gold-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20"
              >
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-lg flex items-center justify-center border border-gold-500/30">
                    <reason.icon className="w-6 h-6 md:w-7 md:h-7 text-gold-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gold-400 mb-2 md:mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-6 md:leading-7">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16 lg:mb-20">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-br from-gold-900/20 to-black/80 border border-gold-500/30 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-gold-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Eye className="w-8 h-8 md:w-10 md:h-10 text-gold-500" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400">
                {t('about.visionTitle')}
              </h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-7 md:leading-8">
              {t('about.visionDesc')}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-gold-900/20 to-black/80 border border-gold-500/30 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-gold-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <Target className="w-8 h-8 md:w-10 md:h-10 text-gold-500" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400">
                {t('about.missionTitle')}
              </h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-7 md:leading-8">
              {t('about.missionDesc')}
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-8 md:mb-12">
            {t('about.valuesTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gold-500/20 rounded-xl p-5 sm:p-6 text-center hover:border-gold-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-5 border border-gold-500/30">
                  <value.icon className="w-7 h-7 md:w-8 md:h-8 text-gold-500" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gold-400 mb-2 md:mb-3">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-5 md:leading-6">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-12 md:mb-16"
        >
          <div className="bg-gradient-to-br from-gold-900/30 to-black/90 border-2 border-gold-500/40 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400 mb-4 md:mb-6">
              {t('contact.title')}
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-gold-500" />
                <span className="text-gray-300">{isRTL ? 'منطقة رأس الخور الصناعية 2، دبي' : 'Ras Al Khor Industrial Area 2, Dubai'}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-gold-500" />
                <a href={`tel:${phoneNumber}`} className="text-gray-300 hover:text-gold-400 transition-colors">
                  {phoneNumber}
                </a>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
              {t('about.visitCta')}
            </p>

            {/* Location Image with Google Maps Link */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <a
                href="https://maps.app.goo.gl/ajpHTNU2GjwKdJHw7"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group overflow-hidden rounded-2xl border-2 border-gold-500/40 hover:border-gold-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-gold-500/20"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <img
                    src="/location-map.jpg"
                    alt="Vintage Point LLC Location"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gold-500 mx-auto mb-3 drop-shadow-lg" />
                      <p className="text-white text-lg md:text-xl font-bold mb-2">
                        {isRTL ? 'اضغط لفتح الخريطة' : 'Click to Open Map'}
                      </p>
                      <p className="text-gold-400 text-sm md:text-base">
                        {isRTL ? 'انتقل إلى موقعنا على Google Maps' : 'Navigate to our location on Google Maps'}
                      </p>
                    </div>
                  </div>
                  {/* Corner badge */}
                  <div className="absolute top-4 right-4 bg-gold-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    <MapPin className="inline-block w-4 h-4 mr-1" />
                    {isRTL ? 'موقعنا' : 'Our Location'}
                  </div>
                </div>
              </a>
            </motion.div>

            {/* WhatsApp Contact Button - Large & Prominent */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-6"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full sm:max-w-md mx-auto overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-green-600 p-1 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="relative bg-gradient-to-r from-green-600 to-green-500 rounded-xl px-8 py-6 text-center">
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {/* WhatsApp Icon with Animation */}
                    <div className="bg-white/20 p-3 rounded-full group-hover:rotate-12 transition-transform duration-300">
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    
                    <div className="text-left">
                      <p className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                        {isRTL ? 'تواصل واتساب' : 'Contact WhatsApp'}
                      </p>
                      <p className="text-sm text-white/90 font-medium">
                        +971 56 914 1444
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-bold transition-all duration-300 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-5 sm:py-6"
              >
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                  Instagram
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-bold transition-all duration-300 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-5 sm:py-6"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Car className="w-5 h-5 md:w-6 md:h-6" />
                  {isRTL ? 'تصفح السيارات' : 'Browse Cars'}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
