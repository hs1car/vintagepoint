'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function WhatsAppFloating() {
  const [showTooltip, setShowTooltip] = useState(false)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971569141444'
  const message = encodeURIComponent(
    'مرحباً، أنا مهتم بسيارات أو قطع الغيار من Vintage Point\n\nHello, I am interested in cars or spare parts from Vintage Point'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="fixed bottom-16 right-4 z-[999] flex items-center justify-center"
      >
        {/* Pulse Effect */}
        <motion.span
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0.2, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-11 h-11 rounded-full bg-gradient-to-br from-green-500 to-green-600"
        />

        {/* WhatsApp Icon - أصغر */}
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4),0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5),0_0_40px_rgba(34,197,94,0.3)] transition-shadow duration-300 border-2 border-white/20">
          <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
        </div>
      </motion.a>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="fixed bottom-6 right-22 z-[999] max-w-xs"
          >
            <div className="rounded-2xl bg-black/95 border border-gold-500/30 p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="mb-2 text-base font-bold text-gold-400">
                    تواصل معنا عبر واتساب
                  </p>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Contact us on WhatsApp
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    +971 56 914 1444
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
