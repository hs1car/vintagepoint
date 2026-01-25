'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface QuickActionCardProps {
  title: string
  subtitle: string
  icon: LucideIcon
  gradient: string
  onClick: () => void
  disabled?: boolean
}

export function QuickActionCard({
  title,
  subtitle,
  icon: Icon,
  gradient,
  onClick,
  disabled = false
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -4 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`group h-full w-full p-0 overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        variant="ghost"
      >
        <Card className={`w-full h-full border-0 ${gradient} relative overflow-hidden`}>
          {/* Animated Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
          </div>

          <CardContent className="relative flex flex-col items-center justify-center gap-4 py-8 px-4">
            {/* Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-75 transition-opacity">
                <Icon className="h-10 w-10 text-white" />
              </div>
              <Icon className="relative h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Text */}
            <div className="text-center space-y-1">
              <div className="font-bold text-white text-base leading-tight">
                {title}
              </div>
              <div className="text-sm text-white/80 leading-tight">
                {subtitle}
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full group-hover:w-16 group-hover:bg-white/60 transition-all duration-300" />
          </CardContent>
        </Card>
      </Button>
    </motion.div>
  )
}
