'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface CountdownTimerProps {
  endDate: Date | string
  onComplete?: () => void
  className?: string
}

export function CountdownTimer({ endDate, onComplete, className = '' }: CountdownTimerProps) {
  const { isRTL } = useLanguage()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    completed: false
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true })
        if (onComplete) onComplete()
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds, completed: false })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [endDate, onComplete])

  if (timeLeft.completed) {
    return (
      <div className={`text-center ${className}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
          <Clock className="h-4 w-4" />
          <span className="font-semibold">
            {isRTL ? 'انتهى العرض' : 'Offer Ended'}
          </span>
        </div>
      </div>
    )
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center min-w-[60px]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/20 to-gold-600/20 rounded-lg blur-sm"></div>
        <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-lg p-3 shadow-xl border border-gold-500/30">
          <div className="text-2xl md:text-3xl font-bold font-mono leading-none">
            {value.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-2 font-medium uppercase">
        {label}
      </div>
    </div>
  )

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gold-600 animate-pulse" />
        <span className="text-sm font-semibold text-gold-600 uppercase tracking-wide">
          {isRTL ? 'ينتهي العرض خلال' : 'Offer Ends In'}
        </span>
      </div>
      
      <div className="flex items-center justify-center gap-2 md:gap-4" dir="ltr">
        <TimeUnit value={timeLeft.days} label={isRTL ? 'يوم' : 'Days'} />
        <div className="text-2xl font-bold text-gold-600 mb-6">:</div>
        <TimeUnit value={timeLeft.hours} label={isRTL ? 'ساعة' : 'Hours'} />
        <div className="text-2xl font-bold text-gold-600 mb-6">:</div>
        <TimeUnit value={timeLeft.minutes} label={isRTL ? 'دقيقة' : 'Mins'} />
        <div className="text-2xl font-bold text-gold-600 mb-6">:</div>
        <TimeUnit value={timeLeft.seconds} label={isRTL ? 'ثانية' : 'Secs'} />
      </div>
    </div>
  )
}
