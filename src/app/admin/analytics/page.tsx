'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, ShoppingCart, Heart, TrendingUp, Package, Car, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  overview: {
    totalViews: number
    viewsLast30Days: number
    viewsLast7Days: number
    viewsToday: number
    totalInquiries: number
    inquiriesLast30Days: number
    inquiriesToday: number
    totalWishlist: number
    activeCars: number
    activeParts: number
  }
  topCars: Array<{
    id: string
    model: string
    year: number
    image: string | null
    views: number
  }>
  topParts: Array<{
    id: string
    name: string
    image: string | null
    views: number
  }>
  dailyViews: Array<{
    date: string
    count: number
  }>
  topPages: Array<{
    page: string
    views: number
  }>
}

export default function AnalyticsDashboard() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load analytics data</p>
      </div>
    )
  }

  const stats = [
    {
      title: language === 'ar' ? 'مشاهدات اليوم' : 'Today\'s Views',
      value: data.overview.viewsToday,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: language === 'ar' ? 'مشاهدات آخر 7 أيام' : 'Last 7 Days',
      value: data.overview.viewsLast7Days,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: language === 'ar' ? 'استفسارات اليوم' : 'Today\'s Inquiries',
      value: data.overview.inquiriesToday,
      icon: ShoppingCart,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: language === 'ar' ? 'إجمالي الاستفسارات' : 'Total Inquiries',
      value: data.overview.totalInquiries,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: language === 'ar' ? 'قائمة الرغبات' : 'Wishlist Items',
      value: data.overview.totalWishlist,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: language === 'ar' ? 'سيارات نشطة' : 'Active Cars',
      value: data.overview.activeCars,
      icon: Car,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: language === 'ar' ? 'قطع غيار نشطة' : 'Active Parts',
      value: data.overview.activeParts,
      icon: Package,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: language === 'ar' ? 'إجمالي المشاهدات' : 'Total Views',
      value: data.overview.totalViews,
      icon: Eye,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-amber-600">
            {language === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            {language === 'ar' ? 'تحديث تلقائي كل 30 ثانية' : 'Auto-refresh every 30 seconds'}
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'ar' ? 'العودة' : 'Back'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 mb-1 truncate">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="cars" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="cars" className="text-xs md:text-sm py-2">
            {language === 'ar' ? 'السيارات' : 'Cars'}
          </TabsTrigger>
          <TabsTrigger value="parts" className="text-xs md:text-sm py-2">
            {language === 'ar' ? 'القطع' : 'Parts'}
          </TabsTrigger>
          <TabsTrigger value="pages" className="text-xs md:text-sm py-2">
            {language === 'ar' ? 'أكثر الصفحات' : 'Top Pages'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cars" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'أكثر 10 سيارات مشاهدة' : 'Top 10 Most Viewed Cars'}
            </h3>
            <div className="space-y-3">
              {data.topCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl font-bold text-amber-600 w-6">
                    {index + 1}
                  </span>
                  {car.image && (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={car.image}
                        alt={car.model}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base truncate">{car.model}</h4>
                    <p className="text-sm text-gray-600">{car.year}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-blue-600">{car.views}</p>
                    <p className="text-xs text-gray-600">
                      {language === 'ar' ? 'مشاهدة' : 'views'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="parts" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'أكثر 10 قطع غيار مشاهدة' : 'Top 10 Most Viewed Parts'}
            </h3>
            <div className="space-y-3">
              {data.topParts.map((part, index) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl font-bold text-amber-600 w-6">
                    {index + 1}
                  </span>
                  {part.image && (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={part.image}
                        alt={part.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base truncate">{part.name}</h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-blue-600">{part.views}</p>
                    <p className="text-xs text-gray-600">
                      {language === 'ar' ? 'مشاهدة' : 'views'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-bold mb-4">
              {language === 'ar' ? 'أكثر الصفحات زيارة' : 'Most Visited Pages'}
            </h3>
            <div className="space-y-4">
              {data.topPages.map((page, index) => (
                <motion.div
                  key={page.page}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-amber-600 w-8">
                      {index + 1}
                    </span>
                    <p className="font-mono text-sm">{page.page}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{page.views}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'زيارة' : 'visits'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Daily Views Chart */}
      <Card className="p-4 mt-6">
        <h3 className="text-lg font-bold mb-4">
          {language === 'ar' ? 'المشاهدات اليومية (آخر 7 أيام)' : 'Daily Views (Last 7 Days)'}
        </h3>
        <div className="space-y-2">
          {data.dailyViews.reverse().map((day: any) => {
            const maxViews = Math.max(...data.dailyViews.map((d: any) => d.count))
            const percentage = (day.count / maxViews) * 100
            const date = new Date(day.date)
            
            return (
              <div key={day.date} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="font-bold text-blue-600">{day.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gradient-to-r from-blue-500 to-amber-500 h-full rounded-full"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
