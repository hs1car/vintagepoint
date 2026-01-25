'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface QuickStatsWidgetProps {
  title: string
  subtitle?: string
  value: number | string
  previousValue?: number
  icon: React.ElementType
  color: string
  bgColor: string
  textColor: string
  trend?: string
  onClick?: () => void
  loading?: boolean
}

export function QuickStatsWidget({
  title,
  subtitle,
  value,
  previousValue,
  icon: Icon,
  color,
  bgColor,
  textColor,
  trend,
  onClick,
  loading
}: QuickStatsWidgetProps) {
  const calculateChange = () => {
    if (!previousValue || typeof value !== 'number') return null
    const change = ((value - previousValue) / previousValue) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    }
  }

  const change = calculateChange()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group cursor-pointer border-gold-500/20 bg-card/50 backdrop-blur hover:border-gold-500/50 hover:shadow-xl transition-all duration-300 overflow-hidden relative ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {/* Background Gradient Effect */}
        <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Content */}
        <CardContent className="relative p-6">
          {/* Header with Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            
            {change && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                change.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {change.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span className="text-xs font-bold">{change.value}%</span>
              </div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1 mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground group-hover:text-gold-400 transition-colors">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-muted-foreground/70">{subtitle}</p>}
          </div>

          {/* Main Value */}
          {loading ? (
            <div className="h-10 w-24 animate-pulse bg-muted rounded-lg" />
          ) : (
            <div className={`text-4xl font-bold ${textColor} group-hover:scale-105 transition-transform`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          )}

          {/* Trend Badge */}
          {trend && (
            <div className="mt-3 text-xs text-muted-foreground">
              {trend}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
