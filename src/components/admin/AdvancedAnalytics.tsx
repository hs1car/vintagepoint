'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Eye, ShoppingCart, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalyticsMetric {
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
}

interface TopItem {
  name: string
  views: number
  inquiries: number
}

export function AdvancedAnalytics() {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])
  const [topCars, setTopCars] = useState<TopItem[]>([])
  const [topParts, setTopParts] = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/advanced')
      if (res.ok) {
        const data = await res.json()
        setMetrics(data.metrics || [])
        setTopCars(data.topCars || [])
        setTopParts(data.topParts || [])
      }
    } catch (error) {
      console.error('Error fetching advanced analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold-400">
            <BarChart3 className="h-5 w-5" />
            <span>مقاييس الأداء</span>
            <span className="text-sm font-normal text-muted-foreground">Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg border border-gold-500/20 hover:border-gold-500/40 hover:bg-gold-500/5 transition-all"
                >
                  <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-gold-400">
                      {metric.value}
                      {metric.label.includes('معدل') ? '%' : metric.label.includes('وقت') ? 'د' : '%'}
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${
                      (metric.trend === 'up' && metric.change > 0) || (metric.trend === 'down' && metric.change < 0)
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(metric.change)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Cars */}
        <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold-400">
              <Eye className="h-5 w-5" />
              أكثر السيارات مشاهدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : topCars.length > 0 ? (
              <div className="space-y-3">
                {topCars.map((car, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{car.name}</p>
                        <p className="text-xs text-muted-foreground">{car.inquiries} استفسار</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gold-400">
                      <Eye className="h-4 w-4" />
                      <span className="font-bold">{car.views}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
            )}
          </CardContent>
        </Card>

        {/* Top Parts */}
        <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold-400">
              <ShoppingCart className="h-5 w-5" />
              أكثر القطع طلباً
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : topParts.length > 0 ? (
              <div className="space-y-3">
                {topParts.map((part, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-400 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{part.name}</p>
                        <p className="text-xs text-muted-foreground">{part.inquiries} استفسار</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <Eye className="h-4 w-4" />
                      <span className="font-bold">{part.views}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">لا توجد بيانات</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
