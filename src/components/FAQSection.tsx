'use client'

import { useState } from 'react'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Volume2, 
  Play, 
  Pause,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQ {
  id: number
  question: string
  questionAr: string
  answer: string
  answerAr: string
  audioUrl?: string // للنسخة الصوتية
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'How can I buy a classic car?',
    questionAr: 'كيف أقدر أشتري سيارة كلاسيك؟',
    answer: 'You can browse our collection, select your favorite car, and contact us directly via WhatsApp or phone. Our team will guide you through the entire process.',
    answerAr: 'تقدر تتصفح مجموعتنا وتختار سيارتك المفضلة وتتواصل معانا مباشرة عبر الواتساب أو التلفون. فريقنا بيساعدك في كل خطوة من خطوات الشراء.'
  },
  {
    id: 2,
    question: 'Are the spare parts genuine?',
    questionAr: 'قطع الغيار عندكم أصلية؟',
    answer: 'Absolutely! All our spare parts are 100% genuine and sourced from trusted suppliers. We guarantee authenticity and quality.',
    answerAr: 'أكيد! كل قطع الغيار اللي عندنا أصلية 100٪ ومن موردين موثوقين. نضمن لك الأصالة والجودة العالية.'
  },
  {
    id: 3,
    question: 'Can I schedule a viewing?',
    questionAr: 'أقدر أحجز موعد للمعاينة؟',
    answer: 'Yes, you can schedule a viewing by contacting us via WhatsApp or phone. We are open daily from 9 AM to 9 PM.',
    answerAr: 'أكيد تقدر! احجز موعد معاينة عن طريق الواتساب أو التلفون. إحنا مفتوحين كل يوم من الساعة 9 الصبح لين 9 الليل.'
  },
  {
    id: 4,
    question: 'Do you offer delivery services?',
    questionAr: 'عندكم خدمة توصيل؟',
    answer: 'Yes, we provide professional delivery services across the UAE with full insurance coverage. Delivery fees vary by location. International shipping available upon request.',
    answerAr: 'أيوه، نوفر خدمة توصيل احترافية لكل الإمارات مع تغطية تأمين كاملة. رسوم التوصيل تختلف حسب الموقع. التوصيل الدولي متوفر عند الطلب.'
  },
  {
    id: 5,
    question: 'What payment methods do you accept?',
    questionAr: 'شنو طرق الدفع اللي تقبلونها؟',
    answer: 'We accept cash, bank transfers, credit cards, and certified checks. Flexible payment plans are available for selected vehicles.',
    answerAr: 'نقبل الكاش، التحويلات البنكية، بطاقات الائتمان، والشيكات المعتمدة. وعندنا خطط دفع مرنة لسيارات مختارة.'
  },
  {
    id: 6,
    question: 'Do you provide vehicle inspection reports?',
    questionAr: 'توفرون تقارير فحص للسيارات؟',
    answer: 'Yes, we provide detailed inspection reports for all our classic cars, including mechanical condition, authenticity verification, and complete service history.',
    answerAr: 'أيوه، نوفر تقارير فحص مفصلة لكل السيارات الكلاسيك عندنا، تشمل الحالة الميكانيكية، التأكد من الأصالة، وسجل الصيانة الكامل.'
  }
]

export function FAQSection() {
  const { isRTL } = useLanguage()
  const [openId, setOpenId] = useState<number | null>(null)
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971569141444'

  const handleWhatsApp = (question: string) => {
    const message = encodeURIComponent(`${isRTL ? 'مرحباً، لدي سؤال: ' : 'Hello, I have a question: '}${question}`)
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const toggleAudio = (id: number) => {
    if (playingAudio === id) {
      setPlayingAudio(null)
      // هنا يمكن إضافة منطق إيقاف الصوت الفعلي
    } else {
      setPlayingAudio(id)
      // هنا يمكن إضافة منطق تشغيل الصوت
      // يمكن استخدام Web Speech API أو ملفات صوتية مسجلة
    }
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 rounded-full mb-4"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
            </span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'إجابات سريعة على الأسئلة اللي دايم تنسألنا! ما حصلت إجابتك؟ كلمنا مباشرة!'
              : 'Quick answers to common questions. Can\'t find your answer? Contact us directly!'}
          </p>
        </div>

        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            {isRTL ? 'واتساب' : 'WhatsApp'}
          </Button>
          <Button
            onClick={() => window.location.href = `tel:+${whatsappNumber}`}
            variant="outline"
            className="gap-2"
          >
            <Phone className="h-4 w-4" />
            {isRTL ? 'اتصل فينا' : 'Call Us'}
          </Button>
          <Button
            onClick={() => window.location.href = 'mailto:info@vintagepoint.ae'}
            variant="outline"
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            {isRTL ? 'راسلنا' : 'Email'}
          </Button>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id
            const isPlaying = playingAudio === faq.id

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Question Header */}
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="w-full p-6 flex items-center justify-between gap-4 hover:bg-accent/50 transition-colors text-start"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 font-bold flex-shrink-0">
                          {faq.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {isRTL ? faq.questionAr : faq.question}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Voice Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleAudio(faq.id)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Expand Icon */}
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Answer */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 border-t">
                            <div className={`${isRTL ? 'pr-12' : 'pl-12'}`}>
                              <p className="text-muted-foreground leading-relaxed mb-4">
                                {isRTL ? faq.answerAr : faq.answer}
                              </p>
                              
                              <Button
                                onClick={() => handleWhatsApp(isRTL ? faq.questionAr : faq.question)}
                                size="sm"
                                variant="outline"
                                className="gap-2"
                              >
                                <MessageCircle className="h-3 w-3" />
                                {isRTL ? 'اسأل عبر الواتساب' : 'Ask on WhatsApp'}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Working Hours */}
        <Card className="mt-8 bg-gradient-to-r from-gold-50 to-gold-100 dark:from-gold-950/20 dark:to-gold-900/20 border-gold-200 dark:border-gold-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-600 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {isRTL ? 'أوقات العمل' : 'Working Hours'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'كل يوم من الساعة 9 الصبح لين 9 الليل' : 'Daily: 9:00 AM - 9:00 PM'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
