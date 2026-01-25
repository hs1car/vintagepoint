'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Eye, ShoppingCart, Heart, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChartDataPoint {
  label: string
  value: number
}

interface SimpleBarChartProps {
  title: string
  subtitle?: string
  data: ChartDataPoint[]
  color?: string
  icon?: React.ElementType
  loading?: boolean
}

export function SimpleBarChart({ 
  title, 
  subtitle, 
  data, 
  color = 'bg-gold-500',
  icon: Icon = BarChart3,
  loading 
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold-400">
          <Icon className="h-5 w-5" />
          <div className="flex flex-col">
            <span>{title}</span>
            {subtitle && <span className="text-sm font-normal text-muted-foreground">{subtitle}</span>}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item, i) => {
              const percentage = (item.value / maxValue) * 100

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-gold-400 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-gold-400">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="relative h-8 bg-muted/50 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 ${color} opacity-80 group-hover:opacity-100 transition-opacity`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                    </motion.div>
                    
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-xs font-semibold text-white mix-blend-difference">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد بيانات</p>
            <p className="text-xs text-muted-foreground/70 mt-1">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
