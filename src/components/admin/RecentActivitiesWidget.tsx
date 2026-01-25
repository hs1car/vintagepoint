'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Car, Wrench, MessageSquare, Clock, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Activity {
  id: string
  type: 'car' | 'part' | 'inquiry'
  action: string
  title: string
  time: string
  status?: 'active' | 'pending' | 'completed'
}

interface RecentActivitiesWidgetProps {
  activities: Activity[]
  loading?: boolean
  onViewAll?: () => void
}

export function RecentActivitiesWidget({ activities, loading, onViewAll }: RecentActivitiesWidgetProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'car':
        return { icon: Car, color: 'bg-gold-500/20 text-gold-400 border-gold-500/30' }
      case 'part':
        return { icon: Wrench, color: 'bg-green-500/20 text-green-400 border-green-500/30' }
      case 'inquiry':
        return { icon: MessageSquare, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    }
  }

  const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null
    
    const configs = {
      active: { label: 'نشط', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
      pending: { label: 'معلق', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
      completed: { label: 'مكتمل', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' }
    }
    
    const config = configs[status]
    return (
      <Badge variant="outline" className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-gold-400">
          <Activity className="h-5 w-5" />
          <span>آخر الأنشطة</span>
          <span className="text-sm font-normal text-muted-foreground">Recent Activities</span>
        </CardTitle>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 group"
          >
            عرض الكل
            <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : activities.length > 0 ? (
            activities.map((activity, i) => {
              const activityConfig = getActivityIcon(activity.type)
              const Icon = activityConfig.icon

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-4 p-3 rounded-xl border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all cursor-pointer"
                >
                  {/* Icon */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${activityConfig.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:text-gold-400 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>

                  {/* Status & Time */}
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(activity.status)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد أنشطة حديثة</p>
              <p className="text-xs text-muted-foreground/70 mt-1">No recent activities</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
