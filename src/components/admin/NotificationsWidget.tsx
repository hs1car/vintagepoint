'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, MessageSquare, Car, Wrench, Eye, TrendingUp, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'inquiry' | 'view' | 'car' | 'part' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
}

export function NotificationsWidget() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Fetch notifications
    fetchNotifications()
    
    // Polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      } else {
        // Fallback to empty array if API fails
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setNotifications([])
      setUnreadCount(0)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'inquiry': return MessageSquare
      case 'car': return Car
      case 'part': return Wrench
      case 'view': return Eye
      default: return Bell
    }
  }

  const getColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10'
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10'
      case 'low': return 'border-blue-500/50 bg-blue-500/10'
    }
  }

  const getBadgeColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    }
  }

  return (
    <Card className="border-gold-500/20 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-gold-400">
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{unreadCount}</span>
              </div>
            )}
          </div>
          <span>الإشعارات</span>
          <span className="text-sm font-normal text-muted-foreground">Notifications</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          className="text-xs text-gold-400 hover:text-gold-300"
        >
          تعليم الكل كمقروء
        </Button>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification, i) => {
                const Icon = getIcon(notification.type)
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative p-4 rounded-lg border ${getColor(notification.priority)} ${
                      !notification.read ? 'shadow-lg' : 'opacity-60'
                    } transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getBadgeColor(notification.priority)}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{notification.title}</p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70">{notification.time}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0 hover:bg-red-500/20"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 px-2 text-xs"
                          >
                            ✓
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد إشعارات</p>
              <p className="text-xs text-muted-foreground/70 mt-1">No notifications</p>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
