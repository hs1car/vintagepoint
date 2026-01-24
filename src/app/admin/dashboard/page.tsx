'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Car,
  Wrench,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  ArrowRight,
  Settings,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

interface DashboardStats {
  totalCars: number
  totalParts: number
  totalInquiries: number
}

export default function AdminDashboard() {
  const { t } = useLanguage()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalParts: 0,
    totalInquiries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [carsRes, partsRes, inquiriesRes] = await Promise.all([
          fetch('/api/cars?includeInactive=true'),
          fetch('/api/parts?includeInactive=true'),
          fetch('/api/inquiries')
        ])

        if (carsRes.ok) {
          const cars = await carsRes.json()
          setStats(prev => ({ ...prev, totalCars: cars.length }))
        }

        if (partsRes.ok) {
          const parts = await partsRes.json()
          setStats(prev => ({ ...prev, totalParts: parts.length }))
        }

        if (inquiriesRes.ok) {
          const inquiries = await inquiriesRes.json()
          setStats(prev => ({ ...prev, totalInquiries: inquiries.length }))
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const statCards = [
    {
      title: 'إجمالي السيارات | Total Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'from-gold-600 to-gold-400',
      href: '/admin/cars'
    },
    {
      title: 'إجمالي قطع الغيار | Total Spare Parts',
      value: stats.totalParts,
      icon: Wrench,
      color: 'from-green-600 to-green-400',
      href: '/admin/parts'
    },
    {
      title: 'إجمالي الاستفسارات | Total Inquiries',
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'from-blue-600 to-blue-400',
      href: '/admin/inquiries'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black/30">
      {/* Header */}
      <header className="border-b border-gold-500/20 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-600 to-gold-400 text-black font-bold text-lg">
                VP
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gold-400">لوحة التحكم</span>
                <span className="text-xs text-muted-foreground">Admin Dashboard</span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gold-500 hover:text-gold-600 hover:bg-gold-500/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج | Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold text-gold-400">
            نظرة عامة | Overview
          </h1>
          <p className="text-muted-foreground">
            ملخص النشاط الحالي | Current Activity Summary
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="group cursor-pointer border-gold-500/20 bg-card/50 backdrop-blur hover:border-gold-500/50 transition-all"
                onClick={() => router.push(stat.href)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">{stat.title}</p>
                    {loading ? (
                      <div className="h-8 w-16 animate-pulse bg-muted rounded" />
                    ) : (
                      <p className="text-3xl font-bold text-gold-400">
                        {stat.value}
                      </p>
                    )}
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${stat.color} text-black`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4 text-xl font-semibold">
            إجراءات سريعة | Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              onClick={() => router.push('/admin/analytics')}
              className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white py-8"
            >
              <BarChart3 className="h-8 w-8" />
              <span className="font-semibold">
                لوحة التحليلات<br />
                <span className="text-sm font-normal">Analytics Dashboard</span>
              </span>
            </Button>

            <Button
              onClick={() => router.push('/admin/cars/new')}
              className="flex h-full flex-col items-center justify-center gap-3 bg-gold-500 hover:bg-gold-600 text-black py-8"
            >
              <Car className="h-8 w-8" />
              <span className="font-semibold">
                إضافة سيارة جديدة<br />
                <span className="text-sm font-normal">Add New Car</span>
              </span>
            </Button>

            <Button
              onClick={() => router.push('/admin/parts/new')}
              className="flex h-full flex-col items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-8"
            >
              <Wrench className="h-8 w-8" />
              <span className="font-semibold">
                إضافة قطعة غيار جديدة<br />
                <span className="text-sm font-normal">Add New Part</span>
              </span>
            </Button>

            <Button
              onClick={() => router.push('/admin/settings')}
              className="flex h-full flex-col items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-8"
            >
              <Settings className="h-8 w-8" />
              <span className="font-semibold">
                إعدادات الموقع<br />
                <span className="text-sm font-normal">Site Settings</span>
              </span>
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex h-full flex-col items-center justify-center gap-3 border-gold-500/50 text-gold-500 hover:bg-gold-500/10 py-8"
            >
              <LayoutDashboard className="h-8 w-8" />
              <span className="font-semibold">
                عرض الموقع<br />
                <span className="text-sm font-normal">View Website</span>
              </span>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
