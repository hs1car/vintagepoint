'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, XCircle, Server, Database, Activity, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface SystemMetric {
  label: string
  labelEn: string
  value: number
  total: number
  color: 'green' | 'yellow' | 'red'
}

interface SystemService {
  name: string
  nameEn: string
  status: 'online' | 'warning' | 'offline'
  icon: React.ElementType
}

interface SystemHealthWidgetProps {
  metrics: SystemMetric[]
  services: SystemService[]
  loading?: boolean
}

export function SystemHealthWidget({ metrics, services, loading }: SystemHealthWidgetProps) {
  const getStatusIcon = (status: SystemService['status']) => {
    switch (status) {
      case 'online':
        return { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50' }
      case 'warning':
        return { icon: AlertCircle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50' }
      case 'offline':
        return { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50' }
    }
  }

  const getStatusText = (status: SystemService['status']) => {
    switch (status) {
      case 'online':
        return 'نشط'
      case 'warning':
        return 'تحذير'
      case 'offline':
        return 'متوقف'
    }
  }

  const getProgressColor = (color: SystemMetric['color']) => {
    switch (color) {
      case 'green':
        return 'bg-green-500'
      case 'yellow':
        return 'bg-yellow-500'
      case 'red':
        return 'bg-red-500'
    }
  }

  const getTextColor = (color: SystemMetric['color']) => {
    switch (color) {
      case 'green':
        return 'text-green-400'
      case 'yellow':
        return 'text-yellow-400'
      case 'red':
        return 'text-red-400'
    }
  }

  return (
    <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold-400">
          <Activity className="h-5 w-5" />
          <span>صحة النظام</span>
          <span className="text-sm font-normal text-muted-foreground">System Health</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metrics Section */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-2 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            metrics.map((metric, i) => {
              const percentage = metric.total > 0 ? (metric.value / metric.total) * 100 : 0
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{metric.label}</p>
                      <p className="text-xs text-muted-foreground">{metric.labelEn}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getTextColor(metric.color)}`}>
                        {metric.value}/{metric.total}
                      </span>
                      <span className={`text-xs ${getTextColor(metric.color)}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={percentage}
                    className="h-2"
                    indicatorClassName={getProgressColor(metric.color)}
                  />
                </motion.div>
              )
            })
          )}
        </div>

        {/* Services Section */}
        <div className="pt-4 space-y-3 border-t border-gold-500/20">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            services.map((service, i) => {
              const statusConfig = getStatusIcon(service.status)
              const StatusIcon = statusConfig.icon
              const ServiceIcon = service.icon

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/10">
                      <ServiceIcon className="h-4 w-4 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.nameEn}</p>
                    </div>
                  </div>
                  
                  <Badge className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {getStatusText(service.status)}
                  </Badge>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Overall Health Score */}
        <div className="pt-4 border-t border-gold-500/20">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-green-400">النظام يعمل بشكل ممتاز</p>
                <p className="text-xs text-muted-foreground">System running smoothly</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">98%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
